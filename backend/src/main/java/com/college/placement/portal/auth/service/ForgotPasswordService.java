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

        ForgetPasswordEntity entity = new ForgetPasswordEntity();
        entity.setEmail(email);
        entity.setStatus("PENDING");
        entity.setRequestTime(LocalDateTime.now());
        entity.setExpiryTime(LocalDateTime.now().plusMinutes(15));

        forgetPasswordRepository.save(entity);

        String resetLink =
                "https://campus-hire.duckdns.org/reset-password?email="  + email;

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

        Optional<RegisterEntity> userOpt =
                userRepository.findByEmail(dto.getEmail());

        if (userOpt.isEmpty()) {
            return "User not found";
        }

        Optional<ForgetPasswordEntity> fp =
                forgetPasswordRepository
                        .findTopByEmailOrderByRequestTimeDesc(dto.getEmail());

        if (fp.isEmpty()) {
            return "No reset request found";
        }

        ForgetPasswordEntity request = fp.get();

        if (request.getExpiryTime().isBefore(LocalDateTime.now())) {
            return "Reset link expired";
        }

        if ("COMPLETED".equals(request.getStatus())) {
            return "Reset link already used";
        }

        RegisterEntity user = userOpt.get();
        user.setPassword(encoder.encode(dto.getNewPassword()));
        userRepository.save(user);

        request.setStatus("COMPLETED");
        forgetPasswordRepository.save(request);

        return "Password updated successfully";
    }
}