package com.college.placement.portal.admin.service;

import com.college.placement.portal.admin.dto.PlacementDriveSpecificStudentDto;
import com.college.placement.portal.auth.repository.RegisterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlacementDriveSpecificStudentService {

    private final RegisterRepository registerRepository;

    public PlacementDriveSpecificStudentService(
            RegisterRepository registerRepository
    ) {
        this.registerRepository = registerRepository;
    }

    // ==========================================
    // Get All Registered Students
    // ==========================================

    public List<PlacementDriveSpecificStudentDto> getAllStudents() {

        return registerRepository.getPlacementDriveSpecificStudents();

    }

}