package com.college.placement.portal.admin.dto;

public class TopSkillDto {

    private String skill;

    private long count;

    public TopSkillDto() {
    }

    public TopSkillDto(String skill, long count) {
        this.skill = skill;
        this.count = count;
    }

    public String getSkill() {
        return skill;
    }

    public void setSkill(String skill) {
        this.skill = skill;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}