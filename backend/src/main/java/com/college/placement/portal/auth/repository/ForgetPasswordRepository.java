package com.college.placement.portal.auth.repository;

import com.college.placement.portal.auth.entity.ForgetPasswordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ForgetPasswordRepository extends JpaRepository<ForgetPasswordEntity, Long> {

    Optional<ForgetPasswordEntity>
    findTopByEmailOrderByRequestTimeDesc(String email);
}