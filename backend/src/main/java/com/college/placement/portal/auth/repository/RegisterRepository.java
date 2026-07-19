package com.college.placement.portal.auth.repository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisterRepository extends JpaRepository<RegisterEntity, Long> {

    Optional<RegisterEntity> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);
    Optional<RegisterEntity> findById(Long id);
}
