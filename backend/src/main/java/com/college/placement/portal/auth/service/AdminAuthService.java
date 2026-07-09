package com.college.placement.portal.auth.service;

import com.college.placement.portal.auth.dto.AdminFirstLoginRequest;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.jwt.RegisterJWT;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AdminAuthService {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RegisterJWT registerJWT;   // ✅ ADD THIS

    public Map<String, String> adminLogin(AdminFirstLoginRequest request) {

        RegisterEntity admin = registerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        if (admin.getRole() == null || admin.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Not an admin account");
        }
        // 🔴 FIRST TIME LOGIN
        if (admin.getPassword() == null) {

            if (!request.getPassword().equals(request.getConfirmPassword())) {
                throw new IllegalArgumentException("Password and Confirm Password do not match");
            }
            admin.setRole(Role.ADMIN);
            admin.setPassword(passwordEncoder.encode(request.getPassword()));
            registerRepository.save(admin);

            String token = registerJWT.generateToken(
                    admin.getEmail(),
                    admin.getRole(),
                    request.isRememberMe()
            );

            return Map.of(
                    "message", "Admin password set successfully",
                    "token", token
            );
        }

        // 🔵 NORMAL LOGIN
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = registerJWT.generateToken(
                admin.getEmail(),
                admin.getRole(),
                request.isRememberMe()
        );

        return Map.of(
                "message", "Admin login successful",
                "token", token
        );
    }
}