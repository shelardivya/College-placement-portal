package com.college.placement.portal.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AiScopeService {

    // =====================================================
    // STUDENT ACCESS
    // =====================================================

    public boolean isStudentQuestionAllowed(String question) {

        if (question == null || question.trim().isEmpty()) {
            return false;
        }

        String q = question.toLowerCase().trim();

        String[] studentAllowedKeywords = {

                // =====================================================
                // ACCOUNT / AUTHENTICATION
                // =====================================================

                "student registration",
                "student signup",
                "student sign up",
                "student login",

                // =====================================================
                // PROFILE
                // =====================================================

                "student profile",
                "my profile",
                "profile",
                "profile photo",
                "profile picture",
                "update profile",
                "edit profile",

                "skills",
                "cgpa",
                "course",
                "department",
                "branch",

                // =====================================================
                // STUDENT DASHBOARD
                // =====================================================

                "student dashboard",
                "my dashboard",

                // =====================================================
                // JOBS
                // =====================================================

                "available jobs",
                "jobs for students",
                "student jobs",
                "job listing",
                "job listings",
                "job posting",
                "job postings",
                "job details",
                "job eligibility",
                "eligible for job",
                "eligibility",
                "apply for job",
                "how to apply",

                // =====================================================
                // APPLICATIONS
                // =====================================================

                "job application",
                "job applications",
                "application status",
                "my applications",
                "application",

                // =====================================================
                // COMPANIES / RECRUITERS
                // =====================================================

                "company",
                "companies",
                "recruiter",
                "recruiters",

                // =====================================================
                // PLACEMENT RECORDS
                // =====================================================

                "placement",
                "placements",
                "placement record",
                "placement records",
                "placed student",
                "placed students",
                "top placed student",
                "top placed students",

                // =====================================================
                // PLACEMENT STORIES
                // =====================================================

                "placement story",
                "placement stories",
                "success story",
                "success stories",

                // =====================================================
                // PLACEMENT DRIVES
                // =====================================================

                "placement drive",
                "placement drives",
                "drive details",
                "drive eligibility",

                // =====================================================
                // PLACEMENT INFORMATION / STATISTICS
                // =====================================================

                "placement process",
                "placement analytics",
                "placement statistics",
                "placement preparation",

                "package",
                "packages",
                "salary",

                // =====================================================
                // NOTIFICATIONS
                // =====================================================

                "student notification",
                "my notifications",
                "notifications",

                // =====================================================
                // RESUME
                // =====================================================

                "resume",
                "cv",
                "resume upload",
                "resume update",

                // =====================================================
                // PREPARATION
                // =====================================================

                "placement preparation tips",
                "interview preparation",
                "technical interview",
                "hr interview",
                "aptitude preparation",

                // =====================================================
                // CAREER GUIDANCE
                // =====================================================

                "career guidance",
                "career preparation",
                "placement career",
                "job preparation"
        };

        for (String keyword : studentAllowedKeywords) {

            if (q.contains(keyword)) {
                return true;
            }
        }

        return false;
    }


    // =====================================================
    // ADMIN ACCESS
    // =====================================================

    public boolean isAdminQuestionAllowed(String question) {

        if (question == null || question.trim().isEmpty()) {
            return false;
        }

        /*
         * Admin can ask complete CampusHire portal questions.
         *
         * AiPortalScopeService already checks whether the
         * question belongs to the CampusHire portal.
         *
         * AiPrivacyService separately blocks sensitive data.
         */

        return true;
    }
}