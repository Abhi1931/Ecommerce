package com.example.ecommerce.Security;

import com.example.ecommerce.Service.Implementations.JWTservice;
import com.example.ecommerce.Service.Implementations.MyUserDetailsService;
import io.jsonwebtoken.JwtException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTservice jwtservice;
    private final MyUserDetailsService userDetailsService;

    public JWTFilter(JWTservice jwtservice, MyUserDetailsService userDetailsService) {
        this.jwtservice = jwtservice;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (isPublicEndpoint(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String authToken = null;
        String authUser = null;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No valid Authorization header found");
            sendUnauthorized(response, "Missing or invalid Authorization header");
            return;
        }

        authToken = authHeader.substring(7);
        try {
            if (!jwtservice.isTokenValid(authToken)) {
                logger.warn("Invalid or expired token");
                sendUnauthorized(response, "Invalid or expired token");
                return;
            }
            authUser = jwtservice.extractUsername(authToken);
        } catch (JwtException | IllegalArgumentException ex) {
            sendUnauthorized(response, "Invalid or expired token");
            return;
        }

        if (authUser != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(authUser);
                if (jwtservice.validateToken(authToken, userDetails)) {
                    List<SimpleGrantedAuthority> authorities = jwtservice.extractRoles(authToken).stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(token);
                } else {

                    sendUnauthorized(response, "Token validation failed");
                    return;
                }
            } catch (JwtException | IllegalArgumentException ex){
                sendUnauthorized(response, "Invalid or expired token");
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String path) {
        return path.contains("/login") ||
                path.contains("/user/refresh-token") ||
                path.contains("/essentials/user/refresh-token") ||
                path.contains("/register") ||
                path.contains("/public/") ||
                path.contains("/swagger") ||
                path.contains("/essentials/products/allproducts") ||
                path.contains("/v3/api-docs") ||
                path.contains("/actuator/health") ||
                path.contains("/registers");
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"status\":401, \"message\":\"" + message + "\"}");
        response.getWriter().flush();
    }
}
