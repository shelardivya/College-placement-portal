package com.college.placement.portal.auth.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "forget_password")
@Data
public class ForgetPasswordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String status; // PENDING, COMPLETED

    private LocalDateTime requestTime;

    private LocalDateTime expiryTime;
}