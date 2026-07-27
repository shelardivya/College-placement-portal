package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AddTopPlacedStudentRequestDto;
import com.college.placement.portal.admin.dto.TopPlacedStudentResponseDto;
import com.college.placement.portal.admin.entity.TopPlacedStudentEntity;
import com.college.placement.portal.admin.repository.TopPlacedStudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TopPlacedStudentService {

    private final TopPlacedStudentRepository topPlacedStudentRepository;

    public TopPlacedStudentService(
            TopPlacedStudentRepository topPlacedStudentRepository
    ) {
        this.topPlacedStudentRepository = topPlacedStudentRepository;
    }

    // ==========================================
    // Add Top Placed Student
    // ==========================================

    public String addTopPlacedStudent(
            AddTopPlacedStudentRequestDto request
    ) {

        TopPlacedStudentEntity student =
                new TopPlacedStudentEntity();

        student.setStudentName(
                request.getStudentName()
        );

        student.setCompanyName(
                request.getCompanyName()
        );

        student.setPackageLpa(
                request.getPackageLpa()
        );

        student.setCgpa(
                request.getCgpa()
        );

        student.setSkills(
                request.getSkills()
        );

        topPlacedStudentRepository.save(student);

        return "Top Placed Student Added Successfully.";

    }

    // ==========================================
    // View All Top Placed Students
    // ==========================================

    public List<TopPlacedStudentResponseDto> getAllTopPlacedStudents() {

        List<TopPlacedStudentEntity> students =
                topPlacedStudentRepository
                        .findAllByOrderByPackageLpaDesc();

        List<TopPlacedStudentResponseDto> response =
                new ArrayList<>();

        for (TopPlacedStudentEntity student : students) {

            TopPlacedStudentResponseDto dto =
                    new TopPlacedStudentResponseDto();

            dto.setId(student.getId());
            dto.setStudentName(student.getStudentName());
            dto.setCompanyName(student.getCompanyName());
            dto.setPackageLpa(student.getPackageLpa());
            dto.setCgpa(student.getCgpa());
            dto.setSkills(student.getSkills());

            response.add(dto);

        }

        return response;

    }

    // ==========================================
    // Get Top Placed Student By Id
    // ==========================================

    public TopPlacedStudentResponseDto getTopPlacedStudentById(
            Long id
    ) {

        TopPlacedStudentEntity student =
                topPlacedStudentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Top Placed Student Not Found."));

        TopPlacedStudentResponseDto dto =
                new TopPlacedStudentResponseDto();

        dto.setId(student.getId());
        dto.setStudentName(student.getStudentName());
        dto.setCompanyName(student.getCompanyName());
        dto.setPackageLpa(student.getPackageLpa());
        dto.setCgpa(student.getCgpa());
        dto.setSkills(student.getSkills());

        return dto;

    }

    // ==========================================
    // Update Top Placed Student
    // ==========================================

    public String updateTopPlacedStudent(
            Long id,
            AddTopPlacedStudentRequestDto request
    ) {

        TopPlacedStudentEntity student =
                topPlacedStudentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Top Placed Student Not Found."));

        student.setStudentName(request.getStudentName());
        student.setCompanyName(request.getCompanyName());
        student.setPackageLpa(request.getPackageLpa());
        student.setCgpa(request.getCgpa());
        student.setSkills(request.getSkills());

        topPlacedStudentRepository.save(student);

        return "Top Placed Student Updated Successfully.";

    }

    // ==========================================
    // Delete Top Placed Student
    // ==========================================

    public String deleteTopPlacedStudent(
            Long id
    ) {

        TopPlacedStudentEntity student =
                topPlacedStudentRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Top Placed Student Not Found."));

        topPlacedStudentRepository.delete(student);

        return "Top Placed Student Deleted Successfully.";

    }

}