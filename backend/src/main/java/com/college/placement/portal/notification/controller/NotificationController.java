package com.college.placement.portal.notification.controller;

import com.college.placement.portal.notification.dto.NotificationResponseDto;
import com.college.placement.portal.notification.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService
    ) {
        this.notificationService = notificationService;
    }

    // ==========================================
    // Student Notifications
    // ==========================================

    @GetMapping("/student")
    public ResponseEntity<List<NotificationResponseDto>>
    getStudentNotifications(
            HttpServletRequest request
    ) {

        return ResponseEntity.ok(
                notificationService.getStudentNotifications(request)
        );

    }

    // ==========================================
    // Admin Notifications
    // ==========================================

    @GetMapping("/admin")
    public ResponseEntity<List<NotificationResponseDto>>
    getAdminNotifications() {

        return ResponseEntity.ok(
                notificationService.getAdminNotifications()
        );

    }
    @PutMapping("/admin/read-all")
    public ResponseEntity<String> markAllAdminNotificationsAsRead() {

        return ResponseEntity.ok(
                notificationService.markAllAdminNotificationsAsRead()
        );

    }

    @PutMapping("/student/read-all")
    public ResponseEntity<String> markAllStudentNotificationsAsRead(
            HttpServletRequest request
    ) {

        return ResponseEntity.ok(
                notificationService.markAllStudentNotificationsAsRead(request)
        );

    }

    @GetMapping("/admin/unread-count")
    public ResponseEntity<Long> getAdminUnreadCount() {

        return ResponseEntity.ok(
                notificationService.getAdminUnreadCount()
        );

    }

    @GetMapping("/student/unread-count")
    public ResponseEntity<Long> getStudentUnreadCount(
            HttpServletRequest request
    ) {

        return ResponseEntity.ok(
                notificationService.getStudentUnreadCount(request)
        );

    }

}