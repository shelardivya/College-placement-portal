package com.college.placement.portal.admin.dto;

public class CgpaPlacementDto {

    private String range;

    private long count;

    public CgpaPlacementDto() {
    }

    public CgpaPlacementDto(String range, long count) {
        this.range = range;
        this.count = count;
    }

    public String getRange() {
        return range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}