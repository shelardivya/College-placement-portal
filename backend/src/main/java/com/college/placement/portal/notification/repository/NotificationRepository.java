package com.college.placement.portal.notification.repository;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<NotificationEntity, Long> {

    // ===========================
    // Admin Notifications
    // ===========================

    List<NotificationEntity> findByReceiverTypeAndIsReadFalseOrderByCreatedAtDesc(
            String receiverType
    );

    long countByReceiverTypeAndIsReadFalse(
            String receiverType
    );

    // ===========================
    // Student Notifications
    // ===========================

    List<NotificationEntity> findByStudentAndIsReadFalseOrderByCreatedAtDesc(
            RegisterEntity student
    );

    long countByStudentAndIsReadFalse(
            RegisterEntity student
    );
    // ==========================================
// Mark All Read
// ==========================================

    List<NotificationEntity> findByReceiverTypeAndIsReadFalse(
            String receiverType
    );

    List<NotificationEntity> findByStudentAndIsReadFalse(
            RegisterEntity student
    );

}