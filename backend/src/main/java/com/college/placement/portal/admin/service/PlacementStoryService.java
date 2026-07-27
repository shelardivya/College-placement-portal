package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.CreatePlacementStoryRequestDto;
import com.college.placement.portal.admin.dto.PlacementStoryResponseDto;
import com.college.placement.portal.admin.entity.PlacementStoryEntity;
import com.college.placement.portal.admin.repository.PlacementStoryRepository;
import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class PlacementStoryService {

    private final PlacementStoryRepository placementStoryRepository;
    private final RegisterRepository registerRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public PlacementStoryService(
            PlacementStoryRepository placementStoryRepository,
            RegisterRepository registerRepository
    ) {
        this.placementStoryRepository = placementStoryRepository;
        this.registerRepository = registerRepository;
    }

    // ==========================================
    // Publish Placement Story
    // ==========================================

    public String publishStory(CreatePlacementStoryRequestDto request)
            throws IOException {

        RegisterEntity student =
                registerRepository.findByFullName(
                        request.getStudentName()
                ).orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        PlacementStoryEntity story =
                new PlacementStoryEntity();

        story.setStudent(student);

        story.setCompanyName(
                request.getCompanyName()
        );

        story.setJobRole(
                request.getJobRole()
        );

        story.setPackageLpa(
                request.getPackageLpa()
        );

        story.setSuccessStory(
                request.getSuccessStory()
        );

        // ==========================
        // Upload Image
        // ==========================

        MultipartFile photo = request.getPhoto();

        if (photo != null && !photo.isEmpty()) {

            String originalFileName =
                    photo.getOriginalFilename();

            String extension = "";

            if (originalFileName != null &&
                    originalFileName.contains(".")) {

                extension =
                        originalFileName.substring(
                                originalFileName.lastIndexOf(".")
                        );

            }

            String fileName =
                    UUID.randomUUID() + extension;

            Path uploadPath =
                    Paths.get(uploadDir, "placement-story");

// ==========================================
// Create Folder If Not Exists
// ==========================================

            try {

                if (!Files.exists(uploadPath)) {

                    Files.createDirectories(uploadPath);

                }

            } catch (IOException e) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to create upload folder. Check server permission."
                );

            }

// ==========================================
// Check Folder Exists
// ==========================================

            if (!Files.exists(uploadPath)) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Upload folder does not exist."
                );

            }

// ==========================================
// Check Folder Permission
// ==========================================

            if (!Files.isWritable(uploadPath)) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Permission denied. Upload folder is not writable."
                );

            }

            Path filePath =
                    uploadPath.resolve(fileName);

// ==========================================
// Upload File
// ==========================================

            try {

                Files.copy(
                        photo.getInputStream(),
                        filePath
                );

            } catch (IOException e) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to upload file."
                );

            }

            story.setPhotoPath(
                    "uploads/placement-story/" + fileName
            );

        }

        placementStoryRepository.save(story);

        return "Placement Story Published Successfully.";

    }
    // ==========================================
    // View All Placement Stories
    // ==========================================

    public java.util.List<PlacementStoryResponseDto> getAllStories() {

        java.util.List<PlacementStoryEntity> stories =
                placementStoryRepository.findAllByOrderByCreatedAtDesc();

        java.util.List<PlacementStoryResponseDto> response =
                new java.util.ArrayList<>();

        for (PlacementStoryEntity story : stories) {

            response.add(convertToDto(story));

        }

        return response;

    }

    // ==========================================
    // View Placement Story By Id
    // ==========================================

    public PlacementStoryResponseDto getStoryById(Long id) {

        PlacementStoryEntity story =
                placementStoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Story not found."));

        return convertToDto(story);

    }

    // ==========================================
    // Convert Entity -> DTO
    // ==========================================

    private PlacementStoryResponseDto convertToDto(
            PlacementStoryEntity story
    ) {

        PlacementStoryResponseDto dto =
                new PlacementStoryResponseDto();

        dto.setId(
                story.getId()
        );

        dto.setStudentId(
                story.getStudent().getId()
        );

        dto.setStudentName(
                story.getStudent().getFullName()
        );

        dto.setCompanyName(
                story.getCompanyName()
        );

        dto.setJobRole(
                story.getJobRole()
        );

        dto.setPackageLpa(
                story.getPackageLpa()
        );

        dto.setSuccessStory(
                story.getSuccessStory()
        );

        dto.setPhotoPath(
                story.getPhotoPath()
        );

        dto.setCreatedAt(
                story.getCreatedAt()
        );

        return dto;

    }
    // ==========================================
    // Update Placement Story
    // ==========================================

    public String updateStory(
            Long id,
            CreatePlacementStoryRequestDto request
    ) throws IOException {

        PlacementStoryEntity story =
                placementStoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Story not found."));

        RegisterEntity student =
                registerRepository.findByFullName(
                        request.getStudentName()
                ).orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        story.setStudent(student);

        story.setCompanyName(
                request.getCompanyName()
        );

        story.setJobRole(
                request.getJobRole()
        );

        story.setPackageLpa(
                request.getPackageLpa()
        );

        story.setSuccessStory(
                request.getSuccessStory()
        );

        MultipartFile photo = request.getPhoto();

        if (photo != null && !photo.isEmpty()) {

            // Delete Old Photo

            if (story.getPhotoPath() != null) {

                File oldFile =
                        new File(story.getPhotoPath());

                if (oldFile.exists()) {
                    oldFile.delete();
                }

            }

            String originalFileName =
                    photo.getOriginalFilename();

            String extension = "";

            if (originalFileName != null &&
                    originalFileName.contains(".")) {

                extension =
                        originalFileName.substring(
                                originalFileName.lastIndexOf(".")
                        );

            }

            String fileName =
                    UUID.randomUUID() + extension;

            Path uploadPath =
                    Paths.get(uploadDir, "placement-story");

// ==========================================
// Create Folder If Not Exists
// ==========================================

            try {

                if (!Files.exists(uploadPath)) {

                    Files.createDirectories(uploadPath);

                }

            } catch (IOException e) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to create upload folder. Check server permission."
                );

            }

// ==========================================
// Check Folder Exists
// ==========================================

            if (!Files.exists(uploadPath)) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Upload folder does not exist."
                );

            }

// ==========================================
// Check Folder Permission
// ==========================================

            if (!Files.isWritable(uploadPath)) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Permission denied. Upload folder is not writable."
                );

            }

            Path filePath =
                    uploadPath.resolve(fileName);

// ==========================================
// Upload File
// ==========================================

            try {

                Files.copy(
                        photo.getInputStream(),
                        filePath
                );

            } catch (IOException e) {

                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Unable to upload file."
                );

            }

            story.setPhotoPath(
                    "uploads/placement-story/" + fileName
            );
        }

        placementStoryRepository.save(story);

        return "Placement Story Updated Successfully.";

    }

    // ==========================================
    // Delete Placement Story
    // ==========================================

    public String deleteStory(Long id) {

        PlacementStoryEntity story =
                placementStoryRepository.findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Placement Story not found."));

        if (story.getPhotoPath() != null) {

            File photo =
                    new File(story.getPhotoPath());

            if (photo.exists()) {
                photo.delete();
            }

        }

        placementStoryRepository.delete(story);

        return "Placement Story Deleted Successfully.";

    }

}
