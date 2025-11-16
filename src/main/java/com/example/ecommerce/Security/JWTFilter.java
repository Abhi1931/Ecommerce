package com.example.ecommerce.Security;

import com.example.ecommerce.Service.Implementations.JWTservice;
import com.example.ecommerce.Service.Implementations.MyUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

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

        // Skip JWT validation for public endpoints
        if (isPublicEndpoint(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String authToken = null;
        String authUser = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            authToken = authHeader.substring(7);
            try {
                // First check if token is valid before extracting username
                if (jwtservice.isTokenValid(authToken)) {
                    authUser = jwtservice.extractUsername(authToken);
                } else {
                    logger.warn("Invalid or expired token");
                    handleInvalidToken(response);
                    return;
                }
            } catch (Exception e) {
                logger.warn("Error processing token: " + e.getMessage());
                handleInvalidToken(response);
                return;
            }
        } else {
            logger.warn("No valid Authorization header found");
            handleInvalidToken(response);
            return;
        }

        if (authUser != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = userDetailsService.loadUserByUsername(authUser);
                if (jwtservice.validateToken(authToken, userDetails)) {
                    List<String> roles = jwtservice.extractRoles(authToken);
                    List<SimpleGrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new) // they are already prefixed with ROLE_
                            .toList();
                    UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                            userDetails, null, authorities);
                    token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(token);
                } else {
                    logger.warn("Token validation failed for user: " + authUser);
                    handleInvalidToken(response);
                    return;
                }
            } catch (Exception e) {
                logger.warn("Error loading user details: " + e.getMessage());
                handleInvalidToken(response);
                return;
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

    private void handleInvalidToken(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"error\": \"Invalid or expired token\", \"message\": \"Please login again\"}");
    }
}