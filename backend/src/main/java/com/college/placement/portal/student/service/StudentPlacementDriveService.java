package com.college.placement.portal.student.service;

import com.college.placement.portal.admin.entity.PlacementDriveEntity;
import com.college.placement.portal.admin.repository.PlacementDriveRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.jwt.RegisterJWT;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.student.Dto.StudentPlacementDriveResponseDto;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudentPlacementDriveService {

    private final PlacementDriveRepository placementDriveRepository;
    private final RegisterRepository registerRepository;
    private final RegisterJWT registerJWT;

    public StudentPlacementDriveService(
            PlacementDriveRepository placementDriveRepository,
            RegisterRepository registerRepository,
            RegisterJWT registerJWT
    ) {
        this.placementDriveRepository = placementDriveRepository;
        this.registerRepository = registerRepository;
        this.registerJWT = registerJWT;
    }

    // ==========================================
    // View All Placement Drives
    // ==========================================

    public List<StudentPlacementDriveResponseDto> getAllPlacementDrives(
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization").substring(7);

        String email =
                registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        List<PlacementDriveEntity> drives =
                placementDriveRepository.findAllByOrderByDriveDateAscDriveTimeAsc();

        List<StudentPlacementDriveResponseDto> response =
                new ArrayList<>();

        for (PlacementDriveEntity drive : drives) {

            // Only ACTIVE drives
            if (!"ACTIVE".equalsIgnoreCase(drive.getStatus())) {
                continue;
            }

            // Skip expired drives
            if (drive.getDriveDate().isBefore(LocalDate.now())) {
                continue;
            }

            // Target Student Logic

            if ("ALL".equalsIgnoreCase(drive.getTargetStudent())) {

                response.add(convertToDto(drive));

            } else if ("SPECIFIC".equalsIgnoreCase(drive.getTargetStudent())) {

                if (student.getFullName().equalsIgnoreCase(
                        drive.getSpecificStudentName()
                )) {

                    response.add(convertToDto(drive));

                }

            }

        }

        return response;

    }

    // ==========================================
    // View Placement Drive By Id
    // ==========================================

    public StudentPlacementDriveResponseDto getPlacementDriveById(
            Long id,
            HttpServletRequest request
    ) {

        String token =
                request.getHeader("Authorization").substring(7);

        String email =
                registerJWT.extractEmail(token);

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        PlacementDriveEntity drive =
                placementDriveRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Drive Not Found."));

        if (!"ACTIVE".equalsIgnoreCase(drive.getStatus())) {
            throw new IllegalArgumentException("Placement Drive Not Available.");
        }

        if (drive.getDriveDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("Placement Drive Expired.");
        }

        if ("SPECIFIC".equalsIgnoreCase(drive.getTargetStudent())) {

            if (!student.getFullName().equalsIgnoreCase(
                    drive.getSpecificStudentName()
            )) {

                throw new IllegalArgumentException(
                        "You are not eligible to view this placement drive."
                );

            }

        }

        return convertToDto(drive);

    }

    // ==========================================
    // Convert Entity -> DTO
    // ==========================================

    private StudentPlacementDriveResponseDto convertToDto(
            PlacementDriveEntity drive
    ) {

        StudentPlacementDriveResponseDto dto =
                new StudentPlacementDriveResponseDto();

        dto.setId(drive.getId());
        dto.setCompanyName(drive.getCompanyName());
        dto.setJobRole(drive.getJobRole());
        dto.setLocation(drive.getLocation());
        dto.setVenue(drive.getVenue());
        dto.setDriveDate(drive.getDriveDate());
        dto.setDriveTime(drive.getDriveTime());
        dto.setStatus(drive.getStatus());

        return dto;

    }

}