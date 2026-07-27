package com.college.placement.portal.student.service;

import com.college.placement.portal.admin.entity.StudentQueryEntity;
import com.college.placement.portal.admin.repository.StudentQueryRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.jwt.RegisterJWT;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.notification.util.NotificationHelper;
import com.college.placement.portal.student.Dto.StudentQueryResponseDto;
import com.college.placement.portal.student.Dto.SubmitQueryRequestDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentQueryService {

    private final StudentQueryRepository studentQueryRepository;
    private final RegisterRepository registerRepository;
    private final RegisterJWT registerJWT;
    private final NotificationHelper notificationHelper;

    public StudentQueryService(
            StudentQueryRepository studentQueryRepository,
            RegisterRepository registerRepository,
            RegisterJWT registerJWT,
            NotificationHelper notificationHelper
    ) {
        this.studentQueryRepository = studentQueryRepository;
        this.registerRepository = registerRepository;
        this.registerJWT = registerJWT;
        this.notificationHelper = notificationHelper;
    }

    // ==========================================
    // Submit Query
    // ==========================================

    public String submitQuery(
            SubmitQueryRequestDto request,
            HttpServletRequest httpRequest
    ) {

        String header = httpRequest.getHeader("Authorization");

        String token = header.substring(7);

        String email = registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        StudentQueryEntity query =
                new StudentQueryEntity();

        query.setStudent(student);
        query.setSubject(request.getSubject());
        query.setDescription(request.getDescription());

        query.setStatus("PENDING");
        query.setCreatedAt(LocalDateTime.now());

        studentQueryRepository.save(query);
        notificationHelper.createNotification(
                null,
                "ADMIN",
                "New Student Query",
                student.getFullName()
                        + " submitted a new query.\nSubject : "
                        + request.getSubject()
        );

        return "Query Submitted Successfully.";

    }

    // ==========================================
    // View My Queries
    // ==========================================

    public List<StudentQueryResponseDto> getMyQueries(
            HttpServletRequest httpRequest
    ) {

        String header = httpRequest.getHeader("Authorization");

        String token = header.substring(7);

        String email = registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        List<StudentQueryEntity> queries =
                studentQueryRepository
                        .findByStudentIdOrderByCreatedAtDesc(
                                student.getId()
                        );

        List<StudentQueryResponseDto> response =
                new ArrayList<>();

        for (StudentQueryEntity query : queries) {

            StudentQueryResponseDto dto =
                    new StudentQueryResponseDto();

            dto.setId(query.getId());
            dto.setSubject(query.getSubject());
            dto.setDescription(query.getDescription());
            dto.setAdminReply(query.getAdminReply());
            dto.setStatus(query.getStatus());
            dto.setCreatedAt(query.getCreatedAt());
            dto.setResolvedAt(query.getResolvedAt());

            response.add(dto);

        }

        return response;

    }

    // ==========================================
    // View Single Query
    // ==========================================

    public StudentQueryResponseDto getQueryById(
            Long id,
            HttpServletRequest httpRequest
    ) {

        String header = httpRequest.getHeader("Authorization");

        String token = header.substring(7);

        String email = registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        StudentQueryEntity query =
                studentQueryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Query not found."));

        if (!query.getStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Unauthorized access.");
        }

        StudentQueryResponseDto dto =
                new StudentQueryResponseDto();

        dto.setId(query.getId());
        dto.setSubject(query.getSubject());
        dto.setDescription(query.getDescription());
        dto.setAdminReply(query.getAdminReply());
        dto.setStatus(query.getStatus());
        dto.setCreatedAt(query.getCreatedAt());
        dto.setResolvedAt(query.getResolvedAt());

        return dto;

    }

    // ==========================================
// Student Resolve Query
// ==========================================

    public String resolveQuery(
            Long id,
            HttpServletRequest httpRequest
    ) {

        String header = httpRequest.getHeader("Authorization");

        String token = header.substring(7);

        String email = registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        StudentQueryEntity query =
                studentQueryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Query not found."));

        // Security Check
        if (!query.getStudent().getId().equals(student.getId())) {
            throw new IllegalArgumentException("Unauthorized access.");
        }

        query.setStatus("RESOLVED");

        query.setResolvedAt(LocalDateTime.now());

        studentQueryRepository.save(query);
        // ==========================================
// Notify Admin
// ==========================================

        notificationHelper.createNotification(
                null,
                "ADMIN",
                "Query Resolved",
                student.getFullName()
                        + " marked query \""
                        + query.getSubject()
                        + "\" as resolved."
        );

        return "Query marked as resolved.";

    }

}