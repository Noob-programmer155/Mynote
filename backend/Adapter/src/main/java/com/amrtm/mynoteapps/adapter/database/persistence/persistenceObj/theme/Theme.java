package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.theme;

import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("theme")
public class Theme {
    @Id
    @Column("id")
    UUID id;
    @Column("name")
    String name;
    @Column("background_color")
    String background_color;
    @Column("foreground_color")
    String foreground_color;
    @Column("background_images")
    String background_images;
    @Column("border_color")
    String border_color;
    @Column("danger_background")
    String danger_background;
    @Column("danger_foreground")
    String danger_foreground;
    @Column("info_background")
    String info_background;
    @Column("info_foreground")
    String info_foreground;
    @Column("default_background")
    String default_background;
    @Column("default_foreground")
    String default_foreground;
    @Column("note_background")
    String background;
    @Column("note_foreground")
    String foreground;
    @CreatedBy
    @Column("createdBy")
    String createdBy;
    @CreatedDate
    @Column("createdDate")
    LocalDateTime createdDate;

    public Theme() {
    }

    public Theme(UUID id, String name, String background_color, String foreground_color, String background_images, String border_color, String danger_background, String danger_foreground, String info_background, String info_foreground, String default_background, String default_foreground, String background, String foreground, String createdBy, LocalDateTime createdDate) {
        this.id = id;
        this.name = name;
        this.background_color = background_color;
        this.foreground_color = foreground_color;
        this.background_images = background_images;
        this.border_color = border_color;
        this.danger_background = danger_background;
        this.danger_foreground = danger_foreground;
        this.info_background = info_background;
        this.info_foreground = info_foreground;
        this.default_background = default_background;
        this.default_foreground = default_foreground;
        this.background = background;
        this.foreground = foreground;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBackground_color() {
        return background_color;
    }

    public void setBackground_color(String background_color) {
        this.background_color = background_color;
    }

    public String getForeground_color() {
        return foreground_color;
    }

    public void setForeground_color(String foreground_color) {
        this.foreground_color = foreground_color;
    }

    public String getBackground_images() {
        return background_images;
    }

    public void setBackground_images(String background_images) {
        this.background_images = background_images;
    }

    public String getBorder_color() {
        return border_color;
    }

    public void setBorder_color(String border_color) {
        this.border_color = border_color;
    }

    public String getDanger_background() {
        return danger_background;
    }

    public void setDanger_background(String danger_background) {
        this.danger_background = danger_background;
    }

    public String getDanger_foreground() {
        return danger_foreground;
    }

    public void setDanger_foreground(String danger_foreground) {
        this.danger_foreground = danger_foreground;
    }

    public String getInfo_background() {
        return info_background;
    }

    public void setInfo_background(String info_background) {
        this.info_background = info_background;
    }

    public String getInfo_foreground() {
        return info_foreground;
    }

    public void setInfo_foreground(String info_foreground) {
        this.info_foreground = info_foreground;
    }

    public String getDefault_background() {
        return default_background;
    }

    public void setDefault_background(String default_background) {
        this.default_background = default_background;
    }

    public String getDefault_foreground() {
        return default_foreground;
    }

    public void setDefault_foreground(String default_foreground) {
        this.default_foreground = default_foreground;
    }

    public String getBackground() {
        return background;
    }

    public void setBackground(String background) {
        this.background = background;
    }

    public String getForeground() {
        return foreground;
    }

    public void setForeground(String foreground) {
        this.foreground = foreground;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
