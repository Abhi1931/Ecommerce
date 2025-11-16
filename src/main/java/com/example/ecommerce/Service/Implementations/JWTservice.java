package com.example.ecommerce.Service.Implementations;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JWTservice {

    @Value("${jwt.secret}")
    private String skey;

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(skey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String token(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));

        if (userDetails instanceof UserPrincipal principal) {
            if (principal.getUserData() != null) {
                claims.put("id", principal.getUserData().getId());
            } else if (principal.getSeller() != null) {
                claims.put("id", principal.getSeller().getSid());
            }
        }

        return Jwts.builder()
                .claims(claims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15)) // 15 minutes
                .signWith(getKey())
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return Jwts.builder()
                .subject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 7L * 24 * 60 * 60 * 1000)) // 7 days
                .signWith(getKey())
                .compact();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public List<String> extractRoles(String token) {
        return extractClaim(token, claims -> (List<String>) claims.get("role"));
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> {
            Object id = claims.get("id");
            if (id instanceof Integer) {
                return ((Integer) id).longValue();
            }
            return (Long) id;
        });
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .clockSkewSeconds(60) // Increased clock skew to 60 seconds
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Utility method to check if token is valid without user details
    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}