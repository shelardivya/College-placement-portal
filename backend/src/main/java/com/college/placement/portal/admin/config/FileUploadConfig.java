package com.college.placement.portal.admin.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class FileUploadConfig {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {

        // Root Upload Folder
        File uploadDirectory = new File(uploadDir);

        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        // Resume Folder
        File resumeDirectory = new File(uploadDir + "/resumes");

        if (!resumeDirectory.exists()) {
            resumeDirectory.mkdirs();
        }

        // Placement Story Folder
        File storyDirectory = new File(uploadDir + "/placement-story");

        if (!storyDirectory.exists()) {
            storyDirectory.mkdirs();
        }

    }

}