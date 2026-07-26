package com.college.placement.portal.student.controller;

import com.college.placement.portal.student.Dto.JobDetailsDto;
import com.college.placement.portal.student.Dto.LatestJobDto;
import com.college.placement.portal.student.service.JobApplyService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import java.util.List;

@RestController
@RequestMapping("/api/student/jobs")
public class JobApplyController {

    private final JobApplyService service;

    public JobApplyController(JobApplyService service) {
        this.service = service;
    }

    @GetMapping("/latest")
    public List<LatestJobDto> getLatestJobs() {
        return service.getLatestJobs();
    }

    @GetMapping("/{id}")
    public JobDetailsDto getJobDetails(
            @PathVariable Long id
    ) {
        return service.getJobDetails(id);
    }

    //resume upload
    @PostMapping(
            value = "/{jobId}/apply",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> applyJob(
            @PathVariable Long jobId,
            @RequestPart("resume") MultipartFile resume
    ) throws Exception {

        return ResponseEntity.ok(service.applyJob(jobId, resume));
    }
}