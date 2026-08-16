package com.college.placement.portal.profile.service;

import com.college.placement.portal.auth.entity.RegisterEntity;
import com.college.placement.portal.auth.repository.RegisterRepository;
import com.college.placement.portal.profile.dto.AdminProfileUpdateDto;
import com.college.placement.portal.profile.dto.AdminProfileViewDto;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.UUID;

@Service
public class AdminProfileService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final RegisterRepository registerRepository;

    public AdminProfileService(RegisterRepository registerRepository) {
        this.registerRepository = registerRepository;
    }

    // ==========================
    // View Profile
    // ==========================

    public AdminProfileViewDto getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity admin = registerRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("Admin not found."));

        AdminProfileViewDto dto = new AdminProfileViewDto();

        dto.setFullName(admin.getFullName());
        dto.setEmail(admin.getEmail());
        dto.setMobile(admin.getMobile());
        dto.setRole(admin.getRole().name());
        dto.setProfilePhotoPath(admin.getProfilePhotoPath());

        return dto;
    }

    // ==========================
    // Update Profile
    // ==========================

    public String updateProfile(AdminProfileUpdateDto dto) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String currentEmail = authentication.getName();

        RegisterEntity admin = registerRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new IllegalArgumentException("Admin not found."));

        if (!admin.getEmail().equals(dto.getEmail())
                && registerRepository.existsByEmail(dto.getEmail())) {

            throw new IllegalArgumentException("Email already registered.");
        }

        if (!admin.getMobile().equals(dto.getMobile())
                && registerRepository.existsByMobile(dto.getMobile())) {

            throw new IllegalArgumentException("Mobile number already registered.");
        }

        admin.setFullName(dto.getFullName());
        admin.setEmail(dto.getEmail());
        admin.setMobile(dto.getMobile());

        registerRepository.save(admin);

        return "Profile updated successfully.";
    }
    public String uploadProfilePhoto(MultipartFile photo) throws Exception {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity admin =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException("Admin not found."));

        if (photo == null || photo.isEmpty()) {
            throw new IllegalArgumentException("Profile photo is required.");
        }

        if (photo.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException(
                    "Maximum file size is 5 MB."
            );
        }

        String originalFileName = photo.getOriginalFilename();

        if (originalFileName == null) {
            throw new IllegalArgumentException("Invalid file.");
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

        // Delete old admin photo
        if (admin.getProfilePhotoPath() != null) {

            File oldPhoto =
                    new File(
                            System.getProperty("user.dir"),
                            admin.getProfilePhotoPath()
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

        admin.setProfilePhotoPath(relativePath);

        registerRepository.save(admin);

        return relativePath;
    }

    public String deleteProfilePhoto() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        RegisterEntity admin =
                registerRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Admin not found."
                                ));

        if (admin.getProfilePhotoPath() == null) {
            throw new IllegalArgumentException(
                    "Profile photo not found."
            );
        }

        File photo =
                new File(
                        System.getProperty("user.dir"),
                        admin.getProfilePhotoPath()
                );

        if (photo.exists()) {
            photo.delete();
        }

        admin.setProfilePhotoPath(null);

        registerRepository.save(admin);

        return "Admin profile photo deleted successfully.";
    }
}