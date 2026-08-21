package com.college.placement.portal.landingpage.dto;

public class PlacementTrendDto {

    private String month;
    private long placementCount;

    public PlacementTrendDto() {
    }

    public PlacementTrendDto(String month, long placementCount) {
        this.month = month;
        this.placementCount = placementCount;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public long getPlacementCount() {
        return placementCount;
    }

    public void setPlacementCount(long placementCount) {
        this.placementCount = placementCount;
    }
}