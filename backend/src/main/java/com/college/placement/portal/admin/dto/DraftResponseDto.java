package com.college.placement.portal.admin.dto;

import java.util.List;

public class DraftResponseDto {

    private long count;

    private List<DraftDto> drafts;

    public DraftResponseDto() {
    }

    public DraftResponseDto(long count,
                            List<DraftDto> drafts) {

        this.count = count;
        this.drafts = drafts;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    public List<DraftDto> getDrafts() {
        return drafts;
    }

    public void setDrafts(List<DraftDto> drafts) {
        this.drafts = drafts;
    }
}