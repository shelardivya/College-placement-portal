package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AdminQueryResponseDto;
import com.college.placement.portal.admin.dto.ReplyQueryRequestDto;
import com.college.placement.portal.admin.entity.StudentQueryEntity;
import com.college.placement.portal.admin.repository.StudentQueryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminQueryService {

    private final StudentQueryRepository studentQueryRepository;

    public AdminQueryService(
            StudentQueryRepository studentQueryRepository
    ) {
        this.studentQueryRepository = studentQueryRepository;
    }

    // ==========================================
    // View All Queries
    // ==========================================

    public List<AdminQueryResponseDto> getAllQueries() {

        List<StudentQueryEntity> queries =
                studentQueryRepository.findAllByOrderByCreatedAtDesc();

        return convertToDtoList(queries);

    }

    // ==========================================
    // View Pending Queries
    // ==========================================

    public List<AdminQueryResponseDto> getPendingQueries() {

        List<StudentQueryEntity> queries =
                studentQueryRepository.findByStatusOrderByCreatedAtDesc("PENDING");

        return convertToDtoList(queries);

    }

    // ==========================================
    // View Resolved Queries
    // ==========================================

    public List<AdminQueryResponseDto> getResolvedQueries() {

        List<StudentQueryEntity> queries =
                studentQueryRepository.findByStatusOrderByCreatedAtDesc("RESOLVED");

        return convertToDtoList(queries);

    }

    // ==========================================
    // View Query By Id
    // ==========================================

    public AdminQueryResponseDto getQueryById(Long id) {

        StudentQueryEntity query =
                studentQueryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Query not found."));

        return convertToDto(query);

    }

    // ==========================================
    // Reply Query
    // ==========================================

    public String replyToQuery(
            Long id,
            ReplyQueryRequestDto request
    ) {

        StudentQueryEntity query =
                studentQueryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Query not found."));

        query.setAdminReply(request.getReply());

        query.setStatus("RESOLVED");

        query.setResolvedAt(LocalDateTime.now());

        studentQueryRepository.save(query);

        return "Reply submitted successfully.";

    }

    // ==========================================
    // Convert Entity -> DTO
    // ==========================================

    private List<AdminQueryResponseDto> convertToDtoList(
            List<StudentQueryEntity> queries
    ) {

        List<AdminQueryResponseDto> response =
                new ArrayList<>();

        for (StudentQueryEntity query : queries) {

            response.add(convertToDto(query));

        }

        return response;

    }

    // ==========================================
    // Convert Single Entity -> DTO
    // ==========================================

    private AdminQueryResponseDto convertToDto(
            StudentQueryEntity query
    ) {

        AdminQueryResponseDto dto =
                new AdminQueryResponseDto();

        dto.setId(query.getId());

        dto.setStudentId(query.getStudent().getId());

        dto.setStudentName(query.getStudent().getFullName());

        dto.setDepartment(query.getStudent().getDepartment());

        dto.setSubject(query.getSubject());

        dto.setDescription(query.getDescription());

        dto.setStatus(query.getStatus());

        dto.setAdminReply(query.getAdminReply());

        dto.setCreatedAt(query.getCreatedAt());

        dto.setResolvedAt(query.getResolvedAt());

        return dto;

    }

}