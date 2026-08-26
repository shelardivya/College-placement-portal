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
        // ATTRACTIVE CAMPUS HIRE HTML EMAIL
        // ==========================================

        String emailBody = """
                <!DOCTYPE html>
                <html>

                <head>

                    <meta charset="UTF-8">

                    <meta name="viewport"
                          content="width=device-width, initial-scale=1.0">

                    <title>Campus Hire - Password Reset</title>

                </head>


                <body style="
                    margin:0;
                    padding:0;
                    background-color:#f4f8fc;
                    font-family:Arial, Helvetica, sans-serif;
                ">


                <!-- MAIN BACKGROUND -->

                <table width="100%"
                       cellpadding="0"
                       cellspacing="0"
                       border="0"
                       style="
                           background-color:#f4f8fc;
                           padding:40px 15px;
                       ">

                    <tr>

                        <td align="center">


                            <!-- MAIN CARD -->

                            <table width="600"
                                   cellpadding="0"
                                   cellspacing="0"
                                   border="0"
                                   style="
                                       max-width:600px;
                                       width:100%%;
                                       background-color:#ffffff;
                                       border-radius:14px;
                                       overflow:hidden;
                                       box-shadow:0 4px 18px rgba(0,0,0,0.08);
                                   ">


                                <!-- ========================= -->
                                <!-- HEADER -->
                                <!-- ========================= -->

                                <tr>

                                    <td align="center"
                                        style="
                                            background-color:#0d6efd;
                                            padding:30px 20px;
                                        ">


                                        <!-- Graduation Icon -->

                                        <div style="
                                            color:#ffffff;
                                            font-size:28px;
                                            margin-bottom:8px;
                                        ">

                                            🎓

                                        </div>


                                        <!-- Campus Hire -->

                                        <div style="
                                            color:#ffffff;
                                            font-size:30px;
                                            font-weight:bold;
                                            letter-spacing:0.5px;
                                        ">

                                            Campus Hire

                                        </div>


                                        <!-- College Placement Portal -->

                                        <div style="
                                            color:#dbeafe;
                                            font-size:15px;
                                            margin-top:8px;
                                        ">

                                            College Placement Portal

                                        </div>


                                    </td>

                                </tr>


                                <!-- ========================= -->
                                <!-- CONTENT -->
                                <!-- ========================= -->

                                <tr>

                                    <td style="
                                        padding:40px 35px;
                                    ">


                                        <!-- Main Heading -->

                                        <h1 style="
                                            margin:0 0 20px 0;
                                            color:#172b4d;
                                            font-size:26px;
                                            text-align:center;
                                        ">

                                            Reset Your Password

                                        </h1>


                                        <!-- Secure Badge -->

                                        <div style="
                                            text-align:center;
                                            margin-bottom:25px;
                                        ">

                                            <span style="
                                                display:inline-block;
                                                background-color:#eff6ff;
                                                color:#0d6efd;
                                                border:1px solid #bfdbfe;
                                                padding:7px 14px;
                                                border-radius:20px;
                                                font-size:12px;
                                                font-weight:bold;
                                            ">

                                                🔒 SECURE PASSWORD RESET

                                            </span>

                                        </div>


                                        <!-- Main Message -->

                                        <p style="
                                            margin:0 0 18px 0;
                                            color:#53657d;
                                            font-size:15px;
                                            line-height:1.7;
                                            text-align:center;
                                        ">

                                            We received a request to reset
                                            the password for your Campus Hire
                                            account.

                                        </p>


                                        <p style="
                                            margin:0 0 25px 0;
                                            color:#53657d;
                                            font-size:15px;
                                            line-height:1.7;
                                            text-align:center;
                                        ">

                                            Click the button below to create
                                            a new password.

                                        </p>


                                        <!-- ========================= -->
                                        <!-- ACCOUNT INFORMATION -->
                                        <!-- ========================= -->

                                        <div style="
                                            background-color:#f8fafc;
                                            border:1px solid #e5e7eb;
                                            border-radius:8px;
                                            padding:13px 16px;
                                            margin-bottom:25px;
                                            text-align:center;
                                        ">

                                            <span style="
                                                color:#64748b;
                                                font-size:13px;
                                            ">

                                                Password reset requested for
                                                your

                                                <strong style="
                                                    color:#172b4d;
                                                ">

                                                    Campus Hire account

                                                </strong>

                                            </span>

                                        </div>


                                        <!-- ========================= -->
                                        <!-- RESET BUTTON -->
                                        <!-- ========================= -->

                                        <table width="100%%"
                                               cellpadding="0"
                                               cellspacing="0"
                                               border="0">

                                            <tr>

                                                <td align="center">


                                                    <a href="{{RESET_LINK}}"
                                                       style="
                                                           display:inline-block;
                                                           background-color:#0d6efd;
                                                           color:#ffffff;
                                                           text-decoration:none;
                                                           font-size:16px;
                                                           font-weight:bold;
                                                           padding:15px 35px;
                                                           border-radius:8px;
                                                           letter-spacing:0.3px;
                                                       ">

                                                        🔐 RESET PASSWORD →

                                                    </a>


                                                </td>

                                            </tr>

                                        </table>


                                        <!-- ========================= -->
                                        <!-- TIMER INFORMATION -->
                                        <!-- ========================= -->

                                        <div style="
                                            text-align:center;
                                            margin-top:28px;
                                            margin-bottom:12px;
                                        ">

                                            <span style="
                                                color:#0d6efd;
                                                font-size:13px;
                                                font-weight:bold;
                                            ">

                                                ⏱️ Your reset link is active
                                                for 15 minutes

                                            </span>

                                        </div>


                                        <!-- ========================= -->
                                        <!-- EXPIRY BOX -->
                                        <!-- ========================= -->

                                        <div style="
                                            margin-top:15px;
                                            background-color:#eff6ff;
                                            border-left:4px solid #0d6efd;
                                            padding:16px 18px;
                                            border-radius:6px;
                                        ">


                                            <p style="
                                                margin:0;
                                                color:#24527a;
                                                font-size:14px;
                                                line-height:1.6;
                                            ">

                                                <strong>
                                                    Important:
                                                </strong>

                                                This password reset link is
                                                valid for only

                                                <strong>
                                                    15 minutes
                                                </strong>.

                                                After that, the link will
                                                expire.

                                            </p>


                                        </div>


                                        <!-- ========================= -->
                                        <!-- SECURITY MESSAGE -->
                                        <!-- ========================= -->

                                        <p style="
                                            margin-top:28px;
                                            margin-bottom:10px;
                                            color:#718096;
                                            font-size:13px;
                                            line-height:1.6;
                                            text-align:center;
                                        ">

                                            For your security, this reset
                                            link can be used only once.

                                        </p>


                                        <p style="
                                            margin:0;
                                            color:#718096;
                                            font-size:13px;
                                            line-height:1.6;
                                            text-align:center;
                                        ">

                                            If you did not request a password
                                            reset, you can safely ignore this
                                            email.

                                        </p>


                                        <!-- ========================= -->
                                        <!-- SECURITY NOTICE -->
                                        <!-- ========================= -->

                                        <div style="
                                            margin-top:30px;
                                            padding:20px;
                                            background-color:#f8fafc;
                                            border-radius:10px;
                                            border:1px solid #e5e7eb;
                                        ">


                                            <div style="
                                                text-align:center;
                                                color:#172b4d;
                                                font-size:15px;
                                                font-weight:bold;
                                                margin-bottom:12px;
                                            ">

                                                🛡️ Security Notice

                                            </div>


                                            <p style="
                                                margin:5px 0;
                                                color:#64748b;
                                                font-size:12px;
                                                line-height:1.6;
                                            ">

                                                ✓ This reset link is unique
                                                to your account.

                                            </p>


                                            <p style="
                                                margin:5px 0;
                                                color:#64748b;
                                                font-size:12px;
                                                line-height:1.6;
                                            ">

                                                ✓ The link can be used only
                                                once.

                                            </p>


                                            <p style="
                                                margin:5px 0;
                                                color:#64748b;
                                                font-size:12px;
                                                line-height:1.6;
                                            ">

                                                ✓ The link automatically
                                                expires after 15 minutes.

                                            </p>


                                        </div>


                                    </td>

                                </tr>


                                <!-- ========================= -->
                                <!-- FOOTER -->
                                <!-- ========================= -->

                                <tr>

                                    <td align="center"
                                        style="
                                            background-color:#f8fafc;
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


                                        <!-- Added Tagline -->

                                        <p style="
                                            margin:10px 0 0 0;
                                            color:#0d6efd;
                                            font-size:12px;
                                            font-weight:bold;
                                        ">

                                            Connecting Students with
                                            Opportunities

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


        // ======================================================
        // INSERT RESET LINK INTO HTML
        // ======================================================

        emailBody =
                emailBody.replace(
                        "{{RESET_LINK}}",
                        resetLink
                );


        // ======================================================
        // SEND EMAIL
        // ======================================================

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


        if (request.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

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