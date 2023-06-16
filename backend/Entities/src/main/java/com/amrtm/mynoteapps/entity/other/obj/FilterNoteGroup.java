package com.amrtm.mynoteapps.entity.other.obj;

import java.util.List;
import java.util.UUID;

public class FilterNoteGroup {
    private UUID group;
    private String member;
    private List<UUID> subtypes;
    private List<String> severities;
    private Integer page;
    private Integer size;

    public FilterNoteGroup() {
    }

    public FilterNoteGroup(UUID group, String member, List<UUID> subtypes, List<String> severities, Integer page, Integer size) {
        this.group = group;
        this.member = member;
        this.subtypes = subtypes;
        this.severities = severities;
        this.page = page;
        this.size = size;
    }

    public UUID getGroup() {
        return group;
    }

    public void setGroup(UUID group) {
        this.group = group;
    }

    public String getMember() {
        return member;
    }

    public void setMember(String member) {
        this.member = member;
    }

    public List<UUID> getSubtypes() {
        return subtypes;
    }

    public void setSubtypes(List<UUID> subtypes) {
        this.subtypes = subtypes;
    }

    public List<String> getSeverities() {
        return severities;
    }

    public void setSeverities(List<String> severities) {
        this.severities = severities;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
