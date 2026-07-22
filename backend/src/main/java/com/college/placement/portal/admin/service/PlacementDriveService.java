package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AddPlacementDriveRequestDto;
import com.college.placement.portal.admin.dto.PlacementDriveResponseDto;
import com.college.placement.portal.admin.entity.PlacementDriveEntity;
import com.college.placement.portal.admin.repository.PlacementDriveRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository placementDriveRepository;

    public PlacementDriveService(
            PlacementDriveRepository placementDriveRepository
    ) {
        this.placementDriveRepository = placementDriveRepository;
    }

    // ==========================================
    // Add Placement Drive
    // ==========================================

    public String addPlacementDrive(
            AddPlacementDriveRequestDto request
    ) {

        PlacementDriveEntity drive =
                new PlacementDriveEntity();

        drive.setCompanyName(
                request.getCompanyName()
        );

        drive.setJobRole(
                request.getJobRole()
        );

        drive.setLocation(
                request.getLocation()
        );

        drive.setDriveDate(
                request.getDriveDate()
        );

        drive.setDriveTime(
                request.getDriveTime()
        );

        drive.setStatus(
                request.getStatus()
        );

        placementDriveRepository.save(drive);

        return "Placement Drive Added Successfully.";

    }

    // ==========================================
// View All Placement Drives
// ==========================================

    public List<PlacementDriveResponseDto> getAllPlacementDrives() {

        List<PlacementDriveEntity> drives =
                placementDriveRepository.findAllByOrderByDriveDateAscDriveTimeAsc();

        List<PlacementDriveResponseDto> response =
                new ArrayList<>();

        for (PlacementDriveEntity drive : drives) {

            PlacementDriveResponseDto dto =
                    new PlacementDriveResponseDto();

            dto.setId(
                    drive.getId()
            );

            dto.setCompanyName(
                    drive.getCompanyName()
            );

            dto.setJobRole(
                    drive.getJobRole()
            );

            dto.setLocation(
                    drive.getLocation()
            );

            dto.setDriveDate(
                    drive.getDriveDate()
            );

            dto.setDriveTime(
                    drive.getDriveTime()
            );

            dto.setStatus(
                    drive.getStatus()
            );

            response.add(dto);

        }

        return response;

    }

    // ==========================================
// Get Placement Drive By Id
// ==========================================

    public PlacementDriveResponseDto getPlacementDriveById(Long id) {

        PlacementDriveEntity drive =
                placementDriveRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Drive Not Found."));

        PlacementDriveResponseDto dto =
                new PlacementDriveResponseDto();

        dto.setId(drive.getId());
        dto.setCompanyName(drive.getCompanyName());
        dto.setJobRole(drive.getJobRole());
        dto.setLocation(drive.getLocation());
        dto.setDriveDate(drive.getDriveDate());
        dto.setDriveTime(drive.getDriveTime());
        dto.setStatus(drive.getStatus());

        return dto;

    }
    // ==========================================
// Update Placement Drive
// ==========================================

    public String updatePlacementDrive(
            Long id,
            AddPlacementDriveRequestDto request
    ) {

        PlacementDriveEntity drive =
                placementDriveRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Drive Not Found."));

        drive.setCompanyName(
                request.getCompanyName()
        );

        drive.setJobRole(
                request.getJobRole()
        );

        drive.setLocation(
                request.getLocation()
        );

        drive.setDriveDate(
                request.getDriveDate()
        );

        drive.setDriveTime(
                request.getDriveTime()
        );

        drive.setStatus(
                request.getStatus()
        );

        placementDriveRepository.save(drive);

        return "Placement Drive Updated Successfully.";

    }

    // ==========================================
// Delete Placement Drive
// ==========================================

    public String deletePlacementDrive(Long id) {

        PlacementDriveEntity drive =
                placementDriveRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Drive Not Found."));

        placementDriveRepository.delete(drive);

        return "Placement Drive Deleted Successfully.";

    }
}