package com.college.placement.portal.admin.controller;

import com.college.placement.portal.admin.dto.DraftResponseDto;
import com.college.placement.portal.admin.dto.DraftUpdateDto;
import com.college.placement.portal.admin.entity.AddJobEntity;
import com.college.placement.portal.admin.service.DraftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/admin")
public class DraftController {

    private final DraftService draftService;

    public DraftController(DraftService draftService) {
        this.draftService = draftService;
    }

    @GetMapping("/drafts")
    public ResponseEntity<DraftResponseDto> getAllDrafts() {

        return ResponseEntity.ok(
                draftService.getAllDrafts()
        );
    }
    @GetMapping("/draft/{id}")
    public ResponseEntity<AddJobEntity> getDraftById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                draftService.getDraftById(id)
        );
    }
    @PutMapping("/draft/{id}")
    public ResponseEntity<AddJobEntity> updateDraft(
            @PathVariable Long id,
            @RequestBody DraftUpdateDto dto
    ) {

        return ResponseEntity.ok(
                draftService.updateDraft(id, dto)
        );
    }
    @PutMapping("/draft/publish/{id}")
    public ResponseEntity<AddJobEntity> publishDraft(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                draftService.publishDraft(id)
        );
    }
}
