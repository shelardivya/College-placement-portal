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
                forgetPasswordRepository
                        .findTopByEmailOrderByRequestTimeDesc(email);

        if (oldRequest.isPresent()) {

            ForgetPasswordEntity old = oldRequest.get();

            old.setUsed(true);
            old.setStatus("COMPLETED");

            forgetPasswordRepository.save(old);
        }

        // ==========================================
        // Generate New Reset Token
        // ==========================================

        ForgetPasswordEntity entity = new ForgetPasswordEntity();

        String token = java.util.UUID.randomUUID().toString();

        LocalDateTime now = LocalDateTime.now();

        entity.setToken(token);
        entity.setUsed(false);
        entity.setEmail(email);
        entity.setStatus("PENDING");
        entity.setRequestTime(now);
        entity.setExpiryTime(now.plusMinutes(15));

        forgetPasswordRepository.save(entity);

        // ==========================================
        // Reset Password URL
        // ==========================================

        String resetLink =
                "https://campus-hire.duckdns.org/reset-password?token=" + token;

        // ==========================================
        // Attractive Campus Hire HTML Email
        // ==========================================

        String emailBody = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">

            <title>Password Reset - Campus Hire</title>
        </head>

        <body style="
            margin:0;
            padding:0;
            background-color:#f4f8fc;
            font-family:Arial, Helvetica, sans-serif;
        ">

            <table width="100%" cellpadding="0" cellspacing="0"
                   style="background-color:#f4f8fc; padding:40px 15px;">

                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                               style="
                               max-width:600px;
                               width:100%;
                               background:#ffffff;
                               border-radius:14px;
                               overflow:hidden;
                               box-shadow:0 4px 18px rgba(0,0,0,0.08);
                               ">

                            <tr>
                                <td align="center"
                                    style="
                                    background:#0d6efd;
                                    padding:28px 20px;
                                    ">

                                    <div style="
                                        color:#ffffff;
                                        font-size:30px;
                                        font-weight:bold;
                                        letter-spacing:0.5px;
                                    ">
                                        Campus Hire
                                    </div>

                                    <div style="
                                        color:#dbeafe;
                                        font-size:15px;
                                        margin-top:7px;
                                    ">
                                        College Placement Portal
                                    </div>

                                </td>
                            </tr>

                            <tr>
                                <td style="padding:40px 38px;">

                                    <h1 style="
                                        margin:0 0 18px 0;
                                        color:#172b4d;
                                        font-size:25px;
                                        text-align:center;
                                    ">
                                        Reset Your Password
                                    </h1>

                                    <p style="
                                        color:#53657d;
                                        font-size:15px;
                                        line-height:1.7;
                                        text-align:center;
                                        margin:0 0 25px 0;
                                    ">
                                        We received a request to reset the
                                        password for your Campus Hire account.
                                    </p>

                                    <p style="
                                        color:#53657d;
                                        font-size:15px;
                                        line-height:1.7;
                                        text-align:center;
                                        margin:0 0 30px 0;
                                    ">
                                        Click the button below to create a
                                        new password.
                                    </p>

                                    <table width="100%" cellpadding="0"
                                           cellspacing="0">

                                        <tr>
                                            <td align="center">

                                                <a href="{{RESET_LINK}}"
                                                   style="
                                                   display:inline-block;
                                                   background:#0d6efd;
                                                   color:#ffffff;
                                                   text-decoration:none;
                                                   font-size:16px;
                                                   font-weight:bold;
                                                   padding:14px 34px;
                                                   border-radius:8px;
                                                   ">
                                                    RESET PASSWORD
                                                </a>

                                            </td>
                                        </tr>

                                    </table>

                                    <div style="
                                        margin-top:30px;
                                        background:#eff6ff;
                                        border-left:4px solid #0d6efd;
                                        padding:15px 18px;
                                        border-radius:6px;
                                    ">

                                        <p style="
                                            margin:0;
                                            color:#24527a;
                                            font-size:14px;
                                            line-height:1.6;
                                        ">
                                            <strong>Important:</strong>
                                            This password reset link is valid
                                            for only <strong>15 minutes</strong>.
                                            After that, the link will expire.
                                        </p>

                                    </div>

                                    <p style="
                                        color:#718096;
                                        font-size:13px;
                                        line-height:1.6;
                                        margin-top:28px;
                                        text-align:center;
                                    ">
                                        For your security, this reset link can
                                        be used only once.
                                    </p>

                                    <p style="
                                        color:#718096;
                                        font-size:13px;
                                        line-height:1.6;
                                        text-align:center;
                                    ">
                                        If you did not request a password reset,
                                        you can safely ignore this email.
                                    </p>

                                </td>
                            </tr>

                            <tr>
                                <td align="center"
                                    style="
                                    background:#f8fafc;
                                    padding:22px 20px;
                                    border-top:1px solid #e5e7eb;
                                    ">

                                    <p style="
                                        margin:0;
                                        color:#64748b;
                                        font-size:12px;
                                    ">
                                        © 2026 Campus Hire
                                    </p>

                                    <p style="
                                        margin:6px 0 0 0;
                                        color:#94a3b8;
                                        font-size:12px;
                                    ">
                                        College Placement Portal
                                    </p>

                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>

            </table>

        </body>
        </html>
        """;

        emailBody = emailBody.replace("{{RESET_LINK}}", resetLink);

        // ==========================================
        // Send HTML Email
        // ==========================================

        emailService.sendEmail(
                email,
                "Campus Hire - Reset Your Password",
                emailBody
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