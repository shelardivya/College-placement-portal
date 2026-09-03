package com.college.placement.portal.notification.service;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.jwt.RegisterJWT;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.notification.dto.NotificationResponseDto;
import com.college.placement.portal.notification.entity.NotificationEntity;
import com.college.placement.portal.notification.repository.NotificationRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final RegisterRepository registerRepository;
    private final RegisterJWT registerJWT;

    public NotificationService(
            NotificationRepository notificationRepository,
            RegisterRepository registerRepository,
            RegisterJWT registerJWT
    ) {
        this.notificationRepository = notificationRepository;
        this.registerRepository = registerRepository;
        this.registerJWT = registerJWT;
    }

    // ==========================================
    // Student Notifications
    // ==========================================

    public List<NotificationResponseDto> getStudentNotifications(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization").substring(7);

        String email =
                registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student Not Found."));

        List<NotificationEntity> notifications =
                notificationRepository
                        .findByStudentAndIsReadFalseOrderByCreatedAtDesc(student);

        List<NotificationResponseDto> response =
                new ArrayList<>();

        for (NotificationEntity notification : notifications) {

            NotificationResponseDto dto =
                    new NotificationResponseDto();

            dto.setId(notification.getId());
            dto.setTitle(notification.getTitle());
            dto.setMessage(notification.getMessage());
            dto.setIsRead(notification.getIsRead());
            dto.setCreatedDate(
                    notification.getCreatedAt().format(
                            java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")
                    )
            );

            dto.setCreatedTime(
                    notification.getCreatedAt().format(
                            java.time.format.DateTimeFormatter.ofPattern("hh:mm a")
                    )
            );

            response.add(dto);
        }

        return response;
    }

    // ==========================================
    // Admin Notifications
    // ==========================================

    public List<NotificationResponseDto> getAdminNotifications() {

        List<NotificationEntity> notifications =
                notificationRepository
                        .findByReceiverTypeAndIsReadFalseOrderByCreatedAtDesc("ADMIN");

        List<NotificationResponseDto> response =
                new ArrayList<>();

        for (NotificationEntity notification : notifications) {

            NotificationResponseDto dto =
                    new NotificationResponseDto();

            dto.setId(notification.getId());
            if (notification.getStudent() != null) {
                dto.setStudentName(notification.getStudent().getFullName());
            }
            dto.setTitle(notification.getTitle());
            dto.setMessage(notification.getMessage());
            dto.setIsRead(notification.getIsRead());
            dto.setCreatedDate(
                    notification.getCreatedAt().format(
                            java.time.format.DateTimeFormatter.ofPattern("dd/MM/yyyy")
                    )
            );

            dto.setCreatedTime(
                    notification.getCreatedAt().format(
                            java.time.format.DateTimeFormatter.ofPattern("hh:mm a")
                    )
            );

            response.add(dto);
        }

        return response;
    }
    public String markAllAdminNotificationsAsRead() {

        List<NotificationEntity> notifications =
                notificationRepository.findByReceiverTypeAndIsReadFalse("ADMIN");

        for (NotificationEntity notification : notifications) {

            notification.setIsRead(true);

        }

        notificationRepository.saveAll(notifications);

        return "All Admin Notifications Read Successfully.";

    }

    public String markAllStudentNotificationsAsRead(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization").substring(7);

        String email =
                registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student Not Found."));

        List<NotificationEntity> notifications =
                notificationRepository.findByStudentAndIsReadFalse(student);

        for (NotificationEntity notification : notifications) {

            notification.setIsRead(true);

        }

        notificationRepository.saveAll(notifications);

        return "All Student Notifications Read Successfully.";

    }

    // ==========================================
// Admin Unread Count
// ==========================================

    public long getAdminUnreadCount() {

        return notificationRepository.countByReceiverTypeAndIsReadFalse(
                "ADMIN"
        );

    }

    // ==========================================
// Student Unread Count
// ==========================================

    public long getStudentUnreadCount(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization").substring(7);

        String email =
                registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student Not Found."));

        return notificationRepository.countByStudentAndIsReadFalse(
                student
        );

    }
}