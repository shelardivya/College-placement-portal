package com.college.placement.portal.notification.repository;

import com.college.placement.portal.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<NotificationEntity, Long> {

    // ==========================================
    // All Notifications
    // ==========================================

    List<NotificationEntity>
    findByReceiverIdAndReceiverRoleOrderByCreatedAtDesc(
            Long receiverId,
            String receiverRole
    );

    // ==========================================
    // Unread Notifications
    // ==========================================

    List<NotificationEntity>
    findByReceiverIdAndReceiverRoleAndIsReadFalseOrderByCreatedAtDesc(
            Long receiverId,
            String receiverRole
    );

    // ==========================================
    // Unread Count
    // ==========================================

    Long countByReceiverIdAndReceiverRoleAndIsReadFalse(
            Long receiverId,
            String receiverRole
    );

}