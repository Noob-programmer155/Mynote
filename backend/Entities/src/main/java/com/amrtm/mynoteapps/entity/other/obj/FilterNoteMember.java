package com.amrtm.mynoteapps.entity.other.obj;

import java.util.List;

public class FilterNoteMember {
    private List<String> categories;
    private List<String> severities;
    private Integer page;
    private Integer size;

    public FilterNoteMember() {
    }

    public FilterNoteMember(List<String> categories, List<String> severities, Integer page, Integer size) {
        this.categories = categories;
        this.severities = severities;
        this.page = page;
        this.size = size;
    }

    public List<String> getCategories() {
        return categories;
    }

    public void setCategories(List<String> categories) {
        this.categories = categories;
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
