package com.college.placement.portal.admin.controller;
import com.college.placement.portal.admin.dto.AddJobRequestDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.service.AddJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/job")
public class AddJobController {

    private final AddJobService service;

    public AddJobController(AddJobService service) {
        this.service = service;
    }


    @PostMapping("/add")
    public ResponseEntity<AddJobEntity> addJob(
            @RequestBody AddJobRequestDto dto
    ) {
        return ResponseEntity.ok(service.addJob(dto));
    }

}