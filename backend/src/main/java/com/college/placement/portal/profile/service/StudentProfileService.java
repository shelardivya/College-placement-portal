package com.college.placement.portal.profile.service;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.profile.dto.StudentProfileUpdateDto;
import com.college.placement.portal.profile.dto.StudentProfileViewDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;


@Service
public class StudentProfileService {
    @Value("${file.upload-dir}")
    private String uploadDir;
    private final RegisterRepository registerRepository;

    public StudentProfileService(RegisterRepository registerRepository) {
        this.registerRepository = registerRepository;

    }

    // ===========================
    // View Profile
    // ===========================

    public StudentProfileViewDto getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        StudentProfileViewDto dto = new StudentProfileViewDto();

        dto.setFullName(student.getFullName());
        dto.setEmail(student.getEmail());
        dto.setMobile(student.getMobile());
        dto.setRole(student.getRole().name());

        dto.setCourse(student.getCourse());
        dto.setDepartment(student.getDepartment());
        dto.setCurrentYear(student.getCurrentYear());
        dto.setCgpa(student.getCgpa());

        dto.setSkills(student.getSkills());
        dto.setLinkedinUrl(student.getLinkedinUrl());
        dto.setGithubUrl(student.getGithubUrl());
        dto.setProfilePhotoPath(student.getProfilePhotoPath());

        return dto;
    }

    // ===========================
    // Update Profile
    // ===========================

    public String updateProfile(StudentProfileUpdateDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found."));

        if (!student.getEmail().equals(dto.getEmail())
                && registerRepository.existsByEmail(dto.getEmail())) {

            throw new IllegalArgumentException("Email already registered.");
        }

        if (!student.getMobile().equals(dto.getMobile())
                && registerRepository.existsByMobile(dto.getMobile())) {

            throw new IllegalArgumentException("Mobile number already registered.");
        }

        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setMobile(dto.getMobile());

        student.setCourse(dto.getCourse());
        student.setDepartment(dto.getDepartment());
        student.setCurrentYear(dto.getCurrentYear());
        student.setCgpa(dto.getCgpa());

        student.setSkills(dto.getSkills());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setGithubUrl(dto.getGithubUrl());

        registerRepository.save(student);

        return "Profile updated successfully.";
    }
    public String uploadProfilePhoto(MultipartFile photo) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        if (photo == null || photo.isEmpty()) {
            throw new IllegalArgumentException("Profile photo is required.");
        }

        if (photo.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Maximum file size is 5 MB."
            );
        }

        String originalFileName =
                photo.getOriginalFilename();

        if (originalFileName == null) {
            throw new IllegalArgumentException(
                    "Invalid file."
            );
        }

        String lowerFileName =
                originalFileName.toLowerCase();

        if (!(lowerFileName.endsWith(".jpg")
                || lowerFileName.endsWith(".jpeg")
                || lowerFileName.endsWith(".png"))) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG and PNG files are allowed."
            );
        }

        String uploadPath =
                System.getProperty("user.dir")
                        + File.separator
                        + uploadDir
                        + File.separator
                        + "profile";

        File folder = new File(uploadPath);

        if (!folder.exists() && !folder.mkdirs()) {
            throw new IllegalStateException(
                    "Unable to create profile upload folder."
            );
        }

        // Delete old photo
        if (student.getProfilePhotoPath() != null) {

            File oldPhoto =
                    new File(
                            System.getProperty("user.dir"),
                            student.getProfilePhotoPath()
                    );

            if (oldPhoto.exists()) {
                oldPhoto.delete();
            }
        }

        String extension =
                lowerFileName.endsWith(".jpeg")
                        ? ".jpeg"
                        : lowerFileName.endsWith(".png")
                        ? ".png"
                        : ".jpg";

        String fileName =
                UUID.randomUUID() + extension;

        File destination =
                new File(folder, fileName);

        photo.transferTo(destination);

        String relativePath =
                uploadDir
                        + "/profile/"
                        + fileName;

        student.setProfilePhotoPath(relativePath);

        registerRepository.save(student);

        return relativePath;
    }
    public String deleteProfilePhoto() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity student =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Student not found."));

        if (student.getProfilePhotoPath() == null) {
            throw new IllegalArgumentException(
                    "Profile photo not found."
            );
        }

        File photo =
                new File(
                        System.getProperty("user.dir"),
                        student.getProfilePhotoPath()
                );

        if (photo.exists()) {
            photo.delete();
        }

        student.setProfilePhotoPath(null);

        registerRepository.save(student);

        return "Profile photo deleted successfully.";
    }

}