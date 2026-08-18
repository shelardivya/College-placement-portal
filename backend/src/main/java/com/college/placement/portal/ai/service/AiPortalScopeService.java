package com.college.placement.portal.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AiPortalScopeService {

    /**
     * Checks whether the question is related to the
     * CampusHire / College Placement Portal.
     *
     * This service only performs portal-level filtering.
     * Role-based access is handled separately by AiScopeService.
     */
    public boolean isPortalQuestion(String question) {

        if (question == null || question.trim().isEmpty()) {
            return false;
        }

        String q = question.toLowerCase().trim();

        String[] portalKeywords = {

                // =====================================================
                // CAMPUSHIRE / PORTAL
                // =====================================================

                "campushire",
                "campus hire",
                "placement portal",
                "college placement portal",
                "college placement",
                "placement system",
                "placement management",

                // =====================================================
                // AUTHENTICATION / ACCOUNT
                // =====================================================

                "student login",
                "student registration",
                "student signup",
                "student sign up",
                "admin login",
                "login",
                "registration",

                // =====================================================
                // STUDENT / PROFILE
                // =====================================================

                "student profile",
                "student dashboard",
                "my profile",
                "my dashboard",
                "profile",
                "cgpa",
                "course",
                "department",
                "branch",
                "skills",
                "resume",
                "cv",

                // =====================================================
                // JOBS
                // =====================================================

                "job",
                "jobs",
                "job posting",
                "job postings",
                "job listing",
                "job listings",
                "job details",
                "job eligibility",
                "eligibility",
                "eligible",
                "apply for job",
                "job application",
                "job applications",
                "application status",
                "applications",

                // =====================================================
                // COMPANY / RECRUITER
                // =====================================================

                "company",
                "companies",
                "recruiter",
                "recruiters",

                // =====================================================
                // PLACEMENT
                // =====================================================

                "placement",
                "placements",
                "placement record",
                "placement records",
                "placement drive",
                "placement drives",
                "placement story",
                "placement stories",
                "placement process",
                "placement preparation",
                "placement analytics",
                "placement statistics",
                "package",
                "packages",
                "salary",

                // =====================================================
                // NOTIFICATIONS
                // =====================================================

                "notification",
                "notifications",

                // =====================================================
                // RECRUITMENT
                // =====================================================

                "recruitment",
                "recruitment workflow",

                // =====================================================
                // PORTAL WORKFLOW
                // =====================================================

                "portal workflow",
                "portal api",
                "portal feature",
                "portal features",
                "portal information"
        };

        for (String keyword : portalKeywords) {

            if (q.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Message returned when the question is outside
     * the CampusHire placement portal scope.
     */
    public String getOutsidePortalMessage() {

        return "Sorry, I can only answer questions related to the CampusHire College Placement Portal.";
    }
}