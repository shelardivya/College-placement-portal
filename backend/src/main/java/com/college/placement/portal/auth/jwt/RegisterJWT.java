package com.college.placement.portal.auth.jwt;

import com.college.placement.portal.auth.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class RegisterJWT {

    private static final String SECRET =
            "PLACEMENT_PORTAL_SECRET_KEY_1234567890123456";

    private final SecretKey key =
            Keys.hmacShaKeyFor(SECRET.getBytes());

    // ==========================
    // Generate Token
    // ==========================
    public String generateToken(String email,
                                Role role,
                                boolean rememberMe) {

        long expiry = rememberMe
                ? 7 * 24 * 60 * 60 * 1000L
                : 24 * 60 * 60 * 1000L;

        return Jwts.builder()

                .setSubject(email)

                .claim("role", role.name())

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis() + expiry)
                )

                .signWith(key, SignatureAlgorithm.HS256)

                .compact();
    }

    // ==========================
    // Extract Email
    // ==========================
    public String extractEmail(String token) {

        return getClaims(token).getSubject();
    }

    // ==========================
    // Extract Role
    // ==========================
    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    // ==========================
    // Validate Token
    // ==========================
    public boolean validateToken(String token, UserDetails userDetails) {

        try {

            Claims claims = getClaims(token);

            return !claims.getExpiration().before(new Date());

        } catch (Exception e) {

            return false;

        }
    }

    // ==========================
    // Common Claims
    // ==========================
    private Claims getClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(key)

                .build()

                .parseClaimsJws(token)

                .getBody();
    }

}