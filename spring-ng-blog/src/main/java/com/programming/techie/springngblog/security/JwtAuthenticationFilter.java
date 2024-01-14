package com.programming.techie.springngblog.security;

import com.programming.techie.springngblog.service.CognitoUserDetailsService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.SignatureException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private CognitoUserDetailsService cognitoUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            System.out.println("Token:"+jwtToken);

            try {
                if (jwtProvider.validateCognitoToken(jwtToken)) {
                    username = jwtProvider.extractUsernameFromCognitoToken(jwtToken);
                    System.out.println("username:" + username);
                }
            } catch (ExpiredJwtException e) {
                // Handle expired token exception
                System.out.println("Token expired: " + e.getMessage());
            } catch (SignatureException e) {
                // Handle invalid signature exception
                System.out.println("Invalid token signature: " + e.getMessage());
            } catch (Exception e) {
                // Handle other token validation exceptions or invalid tokens
                System.out.println("Token validation failed: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = cognitoUserDetailsService.loadUserByUsername(username);

            // Validate the token and set up the security context
            if (jwtProvider.validateCognitoToken(jwtToken)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
