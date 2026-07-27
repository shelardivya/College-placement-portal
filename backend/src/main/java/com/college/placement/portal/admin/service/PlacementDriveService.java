package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.AddPlacementDriveRequestDto;
import com.college.placement.portal.admin.dto.PlacementDriveResponseDto;
import com.college.placement.portal.admin.entity.PlacementDriveEntity;
import com.college.placement.portal.admin.repository.PlacementDriveRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.entity.Role;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.notification.util.NotificationHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository placementDriveRepository;
    private final RegisterRepository registerRepository;
    private final NotificationHelper notificationHelper;

    public PlacementDriveService(
            PlacementDriveRepository placementDriveRepository,
            RegisterRepository registerRepository,
            NotificationHelper notificationHelper
    ) {
        this.placementDriveRepository = placementDriveRepository;
        this.registerRepository = registerRepository;
        this.notificationHelper = notificationHelper;
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

        DateTimeFormatter dateFormatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy", java.util.Locale.ENGLISH);

        DateTimeFormatter timeFormatter =
                DateTimeFormatter.ofPattern("hh:mm a", java.util.Locale.ENGLISH);

        drive.setDriveDate(
                LocalDate.parse(request.getDriveDate(), dateFormatter)
        );

        drive.setDriveTime(
                LocalTime.parse(
                        request.getDriveTime().trim().toUpperCase(),
                        timeFormatter
                )
        );

        drive.setStatus(
                request.getStatus()
        );
        drive.setVenue(
                request.getVenue()
        );

        drive.setTargetStudent(
                request.getTargetStudent()
        );

        drive.setSpecificStudentName(
                request.getSpecificStudentName()
        );
        placementDriveRepository.save(drive);
        // ==========================================
// Placement Drive Notification
// ==========================================

        if ("ALL".equalsIgnoreCase(drive.getTargetStudent())) {

            List<RegisterEntity> students =
                    registerRepository.findAllByRole(Role.STUDENT);

            for (RegisterEntity student : students) {

                notificationHelper.createNotification(
                        student,
                        "STUDENT",
                        "New Placement Drive",
                        drive.getCompanyName()
                                + " Placement Drive has been scheduled.\n"
                                + "Role : " + drive.getJobRole()
                                + "\nDate : "
                                + drive.getDriveDate().format(
                                DateTimeFormatter.ofPattern(
                                        "dd MMM yyyy",
                                        Locale.ENGLISH
                                )
                        )
                );

            }

        }
        else if ("SPECIFIC".equalsIgnoreCase(drive.getTargetStudent())) {

            RegisterEntity student =
                    registerRepository.findByFullName(
                            drive.getSpecificStudentName()
                    ).orElseThrow(() ->
                            new IllegalArgumentException("Student not found.")
                    );

            notificationHelper.createNotification(
                    student,
                    "STUDENT",
                    "Placement Drive Invitation",
                    "You have been invited for "
                            + drive.getCompanyName()
                            + " Placement Drive.\n"
                            + "Role : "
                            + drive.getJobRole()
                            + "\nDate : "
                            + drive.getDriveDate().format(
                            DateTimeFormatter.ofPattern(
                                    "dd MMM yyyy",
                                    Locale.ENGLISH
                            )
                    )
            );

        }

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
                    drive.getDriveDate().format(
                            DateTimeFormatter.ofPattern(
                                    "dd MMM yyyy",
                                    java.util.Locale.ENGLISH
                            )
                    )
            );

            dto.setDriveTime(
                    drive.getDriveTime().format(
                            DateTimeFormatter.ofPattern(
                                    "hh:mm a",
                                    java.util.Locale.ENGLISH
                            )
                    )
            );

            dto.setStatus(
                    drive.getStatus()
            );
            dto.setTargetStudent(drive.getTargetStudent());

            dto.setSpecificStudentName(drive.getSpecificStudentName());
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
        dto.setDriveDate(
                drive.getDriveDate().format(
                        DateTimeFormatter.ofPattern(
                                "dd MMM yyyy",
                                java.util.Locale.ENGLISH
                        )
                )
        );

        dto.setDriveTime(
                drive.getDriveTime().format(
                        DateTimeFormatter.ofPattern(
                                "hh:mm a",
                                java.util.Locale.ENGLISH
                        )
                )
        );
        dto.setStatus(drive.getStatus());
        dto.setTargetStudent(drive.getTargetStudent());
        dto.setSpecificStudentName(drive.getSpecificStudentName());
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

        DateTimeFormatter dateFormatter =
                DateTimeFormatter.ofPattern("dd MMM yyyy", java.util.Locale.ENGLISH);

        DateTimeFormatter timeFormatter =
                DateTimeFormatter.ofPattern("hh:mm a", java.util.Locale.ENGLISH);

        drive.setDriveDate(
                LocalDate.parse(
                        request.getDriveDate().trim(),
                        dateFormatter
                )
        );

        drive.setDriveTime(
                LocalTime.parse(
                        request.getDriveTime().trim().toUpperCase(),
                        timeFormatter
                )
        );

        drive.setStatus(
                request.getStatus()
        );
        drive.setTargetStudent(request.getTargetStudent());

        drive.setSpecificStudentName(request.getSpecificStudentName());

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