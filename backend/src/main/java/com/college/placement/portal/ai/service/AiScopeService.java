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

        // =====================================================
        // CAMPUSHIRE PORTAL
        // =====================================================

        if (containsAny(q,
                "campus hire",
                "campushire",
                "placement portal",
                "college placement portal",
                "this portal"
        )) {
            return true;
        }

        // =====================================================
        // ACCOUNT / AUTHENTICATION
        // =====================================================

        if (containsAny(q,
                "registration",
                "register",
                "signup",
                "sign up",
                "login",
                "log in"
        )) {
            return true;
        }

        // =====================================================
        // PROFILE
        // =====================================================

        if (containsAny(q,
                "profile",
                "profile photo",
                "profile picture",
                "update profile",
                "edit profile",
                "my skills",
                "skills",
                "cgpa",
                "course",
                "department",
                "branch"
        )) {
            return true;
        }

        // =====================================================
        // STUDENT DASHBOARD
        // =====================================================

        if (containsAny(q,
                "dashboard",
                "my dashboard"
        )) {
            return true;
        }

        // =====================================================
        // JOBS
        // =====================================================

        if (containsAny(q,
                "job",
                "jobs",
                "job opening",
                "job openings",
                "opening",
                "openings",
                "vacancy",
                "vacancies",
                "hiring",
                "hiring companies",
                "position",
                "positions",
                "job opportunity",
                "job opportunities",
                "career opportunity",
                "career opportunities"
        )) {
            return true;
        }

        // =====================================================
        // JOB ELIGIBILITY / APPLY
        // =====================================================

        if (containsAny(q,
                "eligible",
                "eligibility",
                "can i apply",
                "apply",
                "application",
                "applications",
                "how to apply",
                "apply for",
                "qualify"
        )) {
            return true;
        }

        // =====================================================
        // COMPANIES / RECRUITERS
        // =====================================================

        if (containsAny(q,
                "company",
                "companies",
                "recruiter",
                "recruiters",
                "employer",
                "employers"
        )) {
            return true;
        }

        // =====================================================
        // PLACEMENT
        // =====================================================

        if (containsAny(q,
                "placement",
                "placements",
                "placed",
                "placement record",
                "placement records",
                "placement process",
                "placement statistics",
                "placement analytics",
                "placement preparation",
                "top placed student",
                "top placed students",
                "highest placed student",
                "highest placed students",
                "best placed student",
                "best placed students"
        )) {
            return true;
        }

        // =====================================================
        // PLACEMENT DRIVES
        // =====================================================

        if (containsAny(q,
                "placement drive",
                "placement drives",
                "drive",
                "drives",
                "drive details",
                "drive eligibility"
        )) {
            return true;
        }

        // =====================================================
        // PLACEMENT STORIES
        // =====================================================

        if (containsAny(q,
                "placement story",
                "placement stories",
                "success story",
                "success stories"
        )) {
            return true;
        }

        // =====================================================
        // PACKAGE / SALARY
        // =====================================================

        if (containsAny(q,
                "package",
                "packages",
                "salary",
                "ctc",
                "compensation"
        )) {
            return true;
        }

        // =====================================================
        // NOTIFICATIONS
        // =====================================================

        if (containsAny(q,
                "notification",
                "notifications",
                "my notifications"
        )) {
            return true;
        }

        // =====================================================
        // RESUME / CV
        // =====================================================

        if (containsAny(q,
                "resume",
                "cv",
                "resume upload",
                "upload resume",
                "update resume",
                "resume update"
        )) {
            return true;
        }

        // =====================================================
        // PLACEMENT PREPARATION
        // =====================================================

        if (containsAny(q,
                "interview",
                "technical interview",
                "hr interview",
                "aptitude",
                "aptitude preparation",
                "interview preparation",
                "placement preparation",
                "prepare for placement",
                "prepare for interview"
        )) {
            return true;
        }

        // =====================================================
        // CAREER
        // =====================================================

        if (containsAny(q,
                "career",
                "career guidance",
                "career preparation",
                "job preparation"
        )) {
            return true;
        }

        // =====================================================
        // NOTHING MATCHED
        // =====================================================

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
         * AiPortalScopeService checks whether the question
         * belongs to CampusHire.
         *
         * AiPrivacyService handles sensitive information.
         *
         * Therefore admin can ask any non-sensitive
         * CampusHire-related question.
         */

        return true;
    }


    // =====================================================
    // HELPER METHOD
    // =====================================================

    private boolean containsAny(String question, String... keywords) {

        for (String keyword : keywords) {

            if (question.contains(keyword)) {
                return true;
            }
        }

        return false;
    }
}