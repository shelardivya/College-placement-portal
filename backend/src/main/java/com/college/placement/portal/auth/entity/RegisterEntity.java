package com.college.placement.portal.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "register")
@Getter
@Setter
public class RegisterEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== BASIC DETAILS =====

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String mobile;

    @Column(nullable = false)
    private LocalDate dob;

    // ===== ACADEMIC DETAILS =====

    @Column(nullable = false)
    private String department;

    @Column(nullable = false)
    private String course;

    @Column(name = "current_year")
    private String currentYear;

    @Column
    private Double cgpa;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @Column(name = "github_url")
    private String githubUrl;

    // ===== AUTH DETAILS =====

    @Column(nullable = true)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;   // ADMIN / STUDENT

}