package com.college.placement.portal.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AiPrivacyService {

    /**
     * Returns true if the requested information is considered private
     * and must NOT be exposed through AI.
     */
    public boolean isPrivateQuestion(String question) {

        if (question == null || question.trim().isEmpty()) {
            return true;
        }

        String q = question.toLowerCase().trim();

        String[] privateKeywords = {

                // Authentication / security
                "password",
                "passcode",
                "otp",
                "one time password",
                "token",
                "jwt",
                "secret key",
                "api key",

                // Personal contact information
                "phone number",
                "mobile number",
                "contact number",
                "email address",
                "personal email",

                // Personal identity information
                "date of birth",
                "dob",
                "address",
                "home address",

                // Account/security information
                "login credentials",
                "credentials",
                "private information",
                "sensitive information",

                // Private student data
                "student password",
                "student mobile",
                "student phone",
                "student personal email",
                "student address",
                "student dob",

                // Private admin data
                "admin password",
                "admin credentials",
                "admin mobile",
                "admin phone",
                "admin personal email",

                // Database/security internals
                "database password",
                "db password",
                "database credentials"
        };

        for (String keyword : privateKeywords) {

            if (q.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Standard response when AI must not expose private information.
     */
    public String getPrivateInformationMessage() {

        return "Sorry, I cannot provide private or sensitive information.";
    }
}