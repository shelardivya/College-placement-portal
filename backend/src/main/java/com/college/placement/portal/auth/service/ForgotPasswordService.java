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
<html lang="en">

<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>Campus_Hire - Reset Password</title>

  <style>
    @media only screen and (max-width: 600px) {

      .email-card {
        width: 100% ;
        border-radius: 0 ;
      }

      .header {
        height: 80px ;
      }

      .header-left {
        padding-left: 20px ;
      }

      .brand-name {
        font-size: 23px ;
      }

      .brand-cap {
        width: 55px ;
        height: 42px ;
      }

      .header-right {
        padding-right: 15px ;
      }

      .plane {
        width: 50px ;
        height: 40px ;
      }

      .main-body {
        padding: 25px 20px 25px ;
      }

      .security-area {
        width: 140px ;
        height: 115px ;
      }

      .email-title {
        font-size: 26px ;
      }

      .content-text {
        font-size: 16px ;
        line-height: 1.6 ;
      }

      .reset-button {
        width: 100% ;
        max-width: 320px ;
        padding: 16px 0 ;
        font-size: 19px ;
      }

      .notice-text {
        font-size: 15px ;
      }

      .footer {
        padding: 18px 15px ;
        font-size: 14px ;
      }

    }
  </style>

</head>


<body
  style="
    margin: 0;
    padding: 20px;
    background-color: #f4f6fb;
    font-family: Arial, Helvetica, sans-serif;
  "
>

  <!-- MAIN CARD -->

  <div
    class="email-card"
    style="
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 18px;
      box-shadow: 0 10px 30px rgba(15,23,42,0.12);
    "
  >


    <!-- HEADER -->

    <div
      class="header"
      style="
        height: 90px;
        background: linear-gradient(
          90deg,
          #173d8c,
          #203f91,
          #334db4
        );
        position: relative;
        overflow: hidden;
      "
    >

      <table
        role="presentation"
        width="100%"
        height="90"
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
        <tr>

          <!-- BRAND -->

          <td
            class="header-left"
            style="
              padding-left: 45px;
              vertical-align: middle;
            "
          >

            <svg
              class="brand-cap"
              width="65"
              height="50"
              viewBox="0 0 76 58"
              xmlns="http://www.w3.org/2000/svg"
              style="
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
              "
            >
              <polygon
                points="38,4 72,20 38,36 4,20"
                fill="#ffffff"
              />

              <polygon
                points="16,27 38,37 60,27 60,42 38,52 16,42"
                fill="#ffffff"
              />

              <line
                x1="10"
                y1="20"
                x2="10"
                y2="43"
                stroke="#ffffff"
                stroke-width="3"
              />

              <circle
                cx="10"
                cy="46"
                r="3"
                fill="#ffffff"
              />
            </svg>


            <span
              class="brand-name"
              style="
                color: #ffffff;
                font-size: 28px;
                font-weight: 700;
                vertical-align: middle;
              "
            >
              Campus_Hire
            </span>

          </td>


          <!-- DECORATION -->

          <td
            class="header-right"
            align="right"
            style="
              padding-right: 30px;
              vertical-align: middle;
            "
          >

            <span
              style="
                color: #ffffff;
                font-size: 16px;
                margin-right: 15px;
              "
            >
              ✦
            </span>


            <svg
              class="plane"
              width="65"
              height="50"
              viewBox="0 0 80 60"
              xmlns="http://www.w3.org/2000/svg"
              style="vertical-align: middle;"
            >
              <polygon
                points="4,12 76,2 48,54 35,31"
                fill="#dce7ff"
              />

              <polygon
                points="35,31 76,2 23,26"
                fill="#ffffff"
              />

              <polygon
                points="35,31 48,54 44,29"
                fill="#aebff2"
              />
            </svg>

          </td>

        </tr>
      </table>

    </div>


    <!-- MAIN BODY -->

    <div
      class="main-body"
      style="
        padding: 30px 70px 25px;
        background: linear-gradient(
          180deg,
          #f7f9ff,
          #ffffff 35%
        );
      "
    >


      <!-- SECURITY ICON -->

      <div
        class="security-area"
        style="
          width: 160px;
          height: 125px;
          margin: 0 auto 5px;
          text-align: center;
          font-size: 90px;
          line-height: 125px;
        "
      >
        🔒
      </div>


      <!-- TITLE -->

      <h1
        class="email-title"
        style="
          margin: 0;
          text-align: center;
          color: #1b2946;
          font-size: 30px;
          line-height: 1.3;
        "
      >
        Reset Your Password
      </h1>


      <!-- UNDERLINE -->

      <div
        style="
          width: 55px;
          height: 3px;
          margin: 16px auto 28px;
          background-color: #2457c6;
          border-radius: 5px;
        "
      ></div>


      <!-- CONTENT -->

      <p
        class="content-text"
        style="
          margin: 0 0 14px;
          color: #273449;
          font-size: 18px;
          line-height: 1.6;
        "
      >
        Hi there,
      </p>


      <p
        class="content-text"
        style="
          margin: 0;
          color: #273449;
          font-size: 18px;
          line-height: 1.7;
        "
      >
        We received a request to reset your password for your
        <strong style="color: #2452aa;">
          Campus_Hire
        </strong>
        account.

        <br>

        Click the button below to create a new password.
      </p>


      <!-- BUTTON -->

      <div
        style="
          text-align: center;
          margin: 24px 0 18px;
        "
      >

        <a
          href="{{RESET_LINK}}"
          class="reset-button"
          style="
            display: inline-block;
            width: 270px;
            padding: 17px 0;
            background: linear-gradient(
              135deg,
              #2d62dc,
              #153eab
            );
            border-radius: 8px;
            color: #ffffff;
            text-decoration: none;
            text-align: center;
            font-size: 21px;
            font-weight: 700;
          "
        >
          Reset Password
        </a>

      </div>


      <!-- EXPIRY -->

      <p
        class="content-text"
        style="
          margin: 0 0 20px;
          text-align: center;
          color: #475467;
          font-size: 17px;
        "
      >
        ⏱ This link will expire in
        <strong style="color: #214ba6;">
          15 minutes.
        </strong>
      </p>


      <!-- DIVIDER -->

      <div
        style="
          height: 1px;
          background-color: #d9dfe9;
          margin: 18px 0;
        "
      ></div>


      <!-- NOTICE -->

      <table
        role="presentation"
        width="100%"
        cellpadding="0"
        cellspacing="0"
        border="0"
      >
        <tr>

          <td
            style="
              width: 45px;
              vertical-align: middle;
            "
          >

            <div
              style="
                width: 34px;
                height: 34px;
                line-height: 34px;
                text-align: center;
                border-radius: 50%;
                background-color: #e7efff;
                color: #2457c6;
                font-weight: 700;
              "
            >
              i
            </div>

          </td>


          <td
            class="notice-text"
            style="
              color: #374357;
              font-size: 17px;
              line-height: 1.5;
            "
          >
            If you didn’t request a password reset,
            you can ignore this email.
          </td>

        </tr>
      </table>


      <!-- SIGNATURE -->

      <div style="margin-top: 20px;">

        <p
          class="content-text"
          style="
            margin: 0 0 5px;
            color: #374357;
            font-size: 17px;
          "
        >
          Thanks,
        </p>

        <p
          class="content-text"
          style="
            margin: 0;
            color: #374357;
            font-size: 17px;
          "
        >
          The
          <strong style="color: #2452aa;">
            Campus_Hire
          </strong>
          Team
        </p>

      </div>

    </div>


    <!-- FOOTER -->

    <div
      class="footer"
      style="
        padding: 20px;
        text-align: center;
        background-color: #eef2f8;
        color: #566174;
        font-size: 15px;
      "
    >
      © 2026 Campus_Hire. All rights reserved.
    </div>

  </div>

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