package com.college.placement.portal.auth.service;

import com.college.placement.portal.auth.dto.ForgetPasswordDto;
import com.college.placement.portal.auth.entity.ForgetPasswordEntity;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.ForgetPasswordRepository;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.auth.util.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ForgotPasswordService {

    @Autowired
    private RegisterRepository userRepository;

    @Autowired
    private ForgetPasswordRepository forgetPasswordRepository;

    @Autowired
    private EmailService emailService;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ======================================================
    // STEP 1 : SEND RESET LINK (NO JWT REQUIRED)
    // ======================================================
    public String sendResetLink(String email) {

        Optional<RegisterEntity> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return "Email does not exist";
        }

        // ==========================================
        // Expire Previous Reset Link
        // ==========================================

        Optional<ForgetPasswordEntity> oldRequest =
                forgetPasswordRepository.findTopByEmailOrderByRequestTimeDesc(email);

        if (oldRequest.isPresent()) {

            ForgetPasswordEntity old = oldRequest.get();

            old.setUsed(true);
            old.setStatus("COMPLETED");

            forgetPasswordRepository.save(old);
        }

        ForgetPasswordEntity entity = new ForgetPasswordEntity();
        String token = java.util.UUID.randomUUID().toString();

        entity.setToken(token);
        entity.setUsed(false);
        entity.setEmail(email);
        entity.setStatus("PENDING");
        entity.setRequestTime(LocalDateTime.now());
        entity.setExpiryTime(LocalDateTime.now().plusMinutes(15));

        forgetPasswordRepository.save(entity);

        String resetLink =
                "https://campus-hire.duckdns.org/reset-password?token=" + token;

        emailService.sendEmail(
                email,
                "Password Reset Request",
                "Click here to reset password: " + resetLink
        );

        return "Reset link sent successfully";
    }

    // ======================================================
    // STEP 2 : RESET PASSWORD
    // ======================================================
    public String resetPassword(ForgetPasswordDto dto) {

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            return "Password mismatch";
        }


        ForgetPasswordEntity request =
                forgetPasswordRepository
                        .findByToken(dto.getToken())
                        .orElse(null);

        if (request == null) {
            return "Invalid reset link";
        }

        if (Boolean.TRUE.equals(request.getUsed())) {
            return "Reset link already used";
        }

        if (request.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Reset link expired";
        }

        RegisterEntity user =
                userRepository.findByEmail(request.getEmail())
                        .orElse(null);

        if (user == null) {
            return "User not found";
        }

        user.setPassword(
                encoder.encode(dto.getNewPassword())
        );

        userRepository.save(user);

        request.setUsed(true);
        request.setStatus("COMPLETED");

        forgetPasswordRepository.save(request);

        return "Password updated successfully";
    }
}