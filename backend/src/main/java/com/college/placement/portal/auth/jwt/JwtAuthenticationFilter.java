package com.college.placement.portal.auth.jwt;

import com.college.placement.portal.auth.security.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private RegisterJWT registerJWT;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Token nahi hai
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {

            String email = registerJWT.extractEmail(token);

            // DEBUG
            System.out.println("JWT Email : " + email);

            if (email != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails =
                        customUserDetailsService.loadUserByUsername(email);

                // DEBUG
                System.out.println("Authorities : " + userDetails.getAuthorities());

                if (registerJWT.validateToken(token, userDetails)) {

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );

                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    SecurityContextHolder.getContext()
                            .setAuthentication(authentication);

                    // DEBUG
                    System.out.println("Authentication Successful");

                } else {

                    // DEBUG
                    System.out.println("JWT Validation Failed");

                }
            }

        } catch (Exception e) {

            // DEBUG
            System.out.println("JWT Exception : " + e.getMessage());
            e.printStackTrace();

            SecurityContextHolder.clearContext();

        }

        filterChain.doFilter(request, response);
    }
}