package com.college.placement.portal.notification.util;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.notification.entity.NotificationEntity;
import com.college.placement.portal.notification.repository.NotificationRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class NotificationHelper {

    private final NotificationRepository notificationRepository;

    public NotificationHelper(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void createNotification(
            RegisterEntity receiver,
            String receiverType,
            String title,
            String message
    ) {

        NotificationEntity notification =
                new NotificationEntity();

        notification.setReceiverType(receiverType);

        notification.setStudent(receiver);

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setIsRead(false);

        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);

    }

}