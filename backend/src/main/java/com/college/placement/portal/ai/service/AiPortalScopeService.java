package com.college.placement.portal.ai.service;

import org.springframework.stereotype.Service;

@Service
public class AiPortalScopeService {

    /**
     * Checks whether the question is related to
     * CampusHire / College Placement Portal.
     *
     * This service only performs portal-level filtering.
     * Role-based access is handled separately by AiScopeService.
     *
     * The matching is intentionally broad so that users can
     * ask the same portal-related question using different
     * sentence structures or word sequences.
     */
    public boolean isPortalQuestion(String question) {

        if (question == null || question.trim().isEmpty()) {
            return false;
        }

        String q = question.toLowerCase().trim();

        // =====================================================
        // CAMPUSHIRE / PORTAL
        // =====================================================

        if (containsAny(q,
                "campushire",
                "campus hire",
                "campus-hire",
                "placement portal",
                "college placement portal",
                "college placement",
                "placement system",
                "placement management",
                "placement platform",
                "this portal",
                "this placement portal",
                "portal"
        )) {
            return true;
        }

        // =====================================================
        // ACCOUNT / AUTHENTICATION
        // =====================================================

        if (containsAny(q,
                "student login",
                "student registration",
                "student signup",
                "student sign up",
                "student register",
                "admin login",
                "admin registration",
                "admin signup",
                "login",
                "log in",
                "logout",
                "log out",
                "registration",
                "register",
                "signup",
                "sign up",
                "account",
                "password reset",
                "forgot password"
        )) {
            return true;
        }

        // =====================================================
        // STUDENT / PROFILE
        // =====================================================

        if (containsAny(q,
                "student profile",
                "student information",
                "student details",
                "student dashboard",
                "my profile",
                "my dashboard",
                "my details",
                "profile",
                "profile photo",
                "profile picture",
                "update profile",
                "edit profile",
                "cgpa",
                "course",
                "department",
                "branch",
                "skills",
                "academic details",
                "academic information",
                "resume",
                "cv"
        )) {
            return true;
        }

        // =====================================================
        // DASHBOARD
        // =====================================================

        if (containsAny(q,
                "dashboard",
                "my dashboard",
                "student dashboard",
                "admin dashboard"
        )) {
            return true;
        }

        // =====================================================
        // JOBS / JOB OPENINGS
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
                "hiring company",
                "position",
                "positions",
                "job opportunity",
                "job opportunities",
                "career opportunity",
                "career opportunities",
                "available jobs",
                "available job",
                "job listing",
                "job listings",
                "job posting",
                "job postings",
                "job details",
                "job description",
                "job role",
                "job roles",
                "job requirement",
                "job requirements"
        )) {
            return true;
        }

        // =====================================================
        // JOB ELIGIBILITY / APPLY
        // =====================================================

        if (containsAny(q,
                "eligible",
                "eligibility",
                "eligibility criteria",
                "eligible for job",
                "eligible jobs",
                "can i apply",
                "can i apply for",
                "apply",
                "apply for",
                "apply for job",
                "how to apply",
                "application",
                "applications",
                "job application",
                "job applications",
                "application status",
                "my application",
                "my applications",
                "qualify",
                "qualification",
                "requirements for job",
                "job requirements"
        )) {
            return true;
        }

        // =====================================================
        // COMPANY / RECRUITER / EMPLOYER
        // =====================================================

        if (containsAny(q,
                "company",
                "companies",
                "company details",
                "company information",
                "recruiter",
                "recruiters",
                "recruitment",
                "recruitment process",
                "employer",
                "employers",
                "hiring company",
                "hiring companies"
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
                "place",
                "placement record",
                "placement records",
                "placement process",
                "placement information",
                "placement details",
                "placement statistics",
                "placement analytics",
                "placement preparation",
                "placement result",
                "placement results",
                "placement status"
        )) {
            return true;
        }

        // =====================================================
        // TOP / HIGHEST / BEST PLACED STUDENTS
        // =====================================================

        if (containsAny(q,
                "top placed",
                "top placement",
                "top placements",
                "top placed student",
                "top placed students",
                "highest placed",
                "highest placement",
                "highest placements",
                "highest placed student",
                "highest placed students",
                "best placed",
                "best placement",
                "best placements",
                "best placed student",
                "best placed students",
                "top student",
                "top students",
                "placed student",
                "placed students"
        )) {
            return true;
        }

        // =====================================================
        // PACKAGE / SALARY / CTC
        // =====================================================

        if (containsAny(q,
                "package",
                "packages",
                "salary",
                "salaries",
                "ctc",
                "compensation",
                "highest package",
                "maximum package",
                "max package",
                "best package",
                "highest salary",
                "maximum salary",
                "max salary",
                "best salary",
                "highest ctc",
                "maximum ctc"
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
                "drive information",
                "drive eligibility",
                "upcoming drive",
                "upcoming drives",
                "placement event",
                "placement events"
        )) {
            return true;
        }

        // =====================================================
        // PLACEMENT STORIES / SUCCESS STORIES
        // =====================================================

        if (containsAny(q,
                "placement story",
                "placement stories",
                "success story",
                "success stories",
                "placement success",
                "successfully placed",
                "successful placement"
        )) {
            return true;
        }

        // =====================================================
        // NOTIFICATIONS
        // =====================================================

        if (containsAny(q,
                "notification",
                "notifications",
                "student notification",
                "student notifications",
                "my notification",
                "my notifications",
                "placement notification",
                "job notification",
                "job notifications"
        )) {
            return true;
        }

        // =====================================================
        // RESUME / CV
        // =====================================================

        if (containsAny(q,
                "resume",
                "resumes",
                "cv",
                "curriculum vitae",
                "resume upload",
                "upload resume",
                "update resume",
                "resume update",
                "resume management",
                "my resume"
        )) {
            return true;
        }

        // =====================================================
        // INTERVIEW / PLACEMENT PREPARATION
        // =====================================================

        if (containsAny(q,
                "interview",
                "interviews",
                "technical interview",
                "technical interviews",
                "hr interview",
                "hr interviews",
                "aptitude",
                "aptitude test",
                "aptitude preparation",
                "interview preparation",
                "placement preparation",
                "prepare for placement",
                "prepare for interview",
                "interview tips",
                "placement tips"
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
                "career opportunity",
                "career opportunities",
                "job preparation",
                "career development"
        )) {
            return true;
        }

        // =====================================================
        // PORTAL FEATURES / WORKFLOW
        // =====================================================

        if (containsAny(q,
                "portal workflow",
                "portal api",
                "portal feature",
                "portal features",
                "portal information",
                "portal functionality",
                "portal process",
                "how does the portal work",
                "how portal works",
                "what does the portal do",
                "features of portal",
                "features of campushire",
                "campushire features"
        )) {
            return true;
        }

        // NEW TOPICS (resume tips, eligibility, date, drive format,
        // query lifecycle, forgot password, ai assistant meta)
        // =====================================================

        if (containsAny(q,
                "eligibility criteria",
                "eligibility",
                "resume tips",
                "resume tip",
                "good resume",
                "how to write resume",
                "resume format",
                "today's date",
                "todays date",
                "current date",
                "what is the date",
                "date today",
                "drive date",
                "drive time",
                "drive venue",
                "venue",
                "target student",
                "draft job",
                "publish draft",
                "publish job",
                "discard query",
                "resolve query",
                "query section",
                "my query",
                "my queries",
                "submit query",
                "forgot password",
                "reset password",
                "change password",
                "ai assistant",
                "ai chatbot",
                "how to talk to ai",
                "chatbot help",
                "chat with ai",
                "highest cgpa",
                "lowest cgpa",
                "average cgpa",
                "minimum cgpa",
                "highest package",
                "lowest package",
                "average package",
                "minimum package",
                "small package",
                "top company",
                "most placements"
        )) {
            return true;
        }

        // =====================================================
        // NOTHING MATCHED
        // =====================================================

        return false;
    }


    /**
     * Message returned when the question is outside
     * the CampusHire placement portal scope.
     */
    public String getOutsidePortalMessage() {

        return "Sorry, I can only answer questions related to the CampusHire College Placement Portal.";
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