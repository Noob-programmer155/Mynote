package com.amrtm.mynoteapps.entity.theme.impl;

import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.theme.ThemeDTOInterface;

import java.time.LocalDateTime;
import java.util.UUID;

public class ThemeDTO implements ThemeDTOInterface {
    UUID id;
    String name;
    String background_color;
    String foreground_color;
    String background_images;
    String border_color;
    String danger_background;
    String danger_foreground;
    String info_background;
    String info_foreground;
    String default_background;
    String default_foreground;
    String background;
    String foreground;
    Boolean isMyTheme;
    Pair<String,UUID> createdBy;
    LocalDateTime createdDate;

    public ThemeDTO() {
    }

    public ThemeDTO(UUID id, String name, String background_color, String foreground_color, String background_images, String border_color, String danger_background, String danger_foreground, String info_background, String info_foreground, String default_background, String default_foreground, String background, String foreground, Boolean isMyTheme, Pair<String, UUID> createdBy, LocalDateTime createdDate) {
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
        this.isMyTheme = isMyTheme;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String getBackground_color() {
        return background_color;
    }

    @Override
    public void setBackground_color(String background_color) {
        this.background_color = background_color;
    }

    public String getForeground_color() {
        return foreground_color;
    }

    public void setForeground_color(String foreground_color) {
        this.foreground_color = foreground_color;
    }

    @Override
    public String getBackground_images() {
        return background_images;
    }

    @Override
    public void setBackground_images(String background_images) {
        this.background_images = background_images;
    }

    @Override
    public String getBorder_color() {
        return border_color;
    }

    @Override
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

    @Override
    public String getBackground() {
        return background;
    }

    @Override
    public void setBackground(String background) {
        this.background = background;
    }

    @Override
    public String getForeground() {
        return foreground;
    }

    @Override
    public void setForeground(String foreground) {
        this.foreground = foreground;
    }

    public Boolean getIsMyTheme() {
        return isMyTheme;
    }

    public void setIsMyTheme(Boolean myTheme) {
        isMyTheme = myTheme;
    }

    @Override
    public Pair<String, UUID> getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Pair<String, UUID> createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    @Override
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public static class builder {
        private UUID id;
        private String name;
        private String backgroundColor;
        private String foregroundColor;
        private String backgroundImages;
        private String borderColor;
        private String dangerBackground;
        private String dangerForeground;
        private String infoBackground;
        private String infoForeground;
        private String defaultBackground;
        private String defaultForeground;
        private String background;
        private String foreground;
        private Boolean isMyTheme;
        private Pair<String, UUID> createdBy;
        private LocalDateTime createdDate;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder name(String name) {
            this.name = name;
            return this;
        }

        public builder background_color(String backgroundColor) {
            this.backgroundColor = backgroundColor;
            return this;
        }

        public builder foreground_color(String foregroundColor) {
            this.foregroundColor = foregroundColor;
            return this;
        }

        public builder background_images(String backgroundImages) {
            this.backgroundImages = backgroundImages;
            return this;
        }

        public builder border_color(String borderColor) {
            this.borderColor = borderColor;
            return this;
        }

        public builder danger_background(String dangerBackground) {
            this.dangerBackground = dangerBackground;
            return this;
        }

        public builder danger_foreground(String dangerForeground) {
            this.dangerForeground = dangerForeground;
            return this;
        }

        public builder info_background(String infoBackground) {
            this.infoBackground = infoBackground;
            return this;
        }

        public builder info_foreground(String infoForeground) {
            this.infoForeground = infoForeground;
            return this;
        }

        public builder default_background(String defaultBackground) {
            this.defaultBackground = defaultBackground;
            return this;
        }

        public builder default_foreground(String defaultForeground) {
            this.defaultForeground = defaultForeground;
            return this;
        }

        public builder background(String background) {
            this.background = background;
            return this;
        }

        public builder foreground(String foreground) {
            this.foreground = foreground;
            return this;
        }

        public builder isMyTheme(Boolean isMyTheme) {
            this.isMyTheme = isMyTheme;
            return this;
        }

        public builder createdBy(Pair<String, UUID> createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public builder createdDate(LocalDateTime createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        public ThemeDTO build() {
            return new ThemeDTO(id,name,backgroundColor,foregroundColor,backgroundImages,borderColor,dangerBackground,dangerForeground,infoBackground,infoForeground,defaultBackground,defaultForeground,background,foreground,isMyTheme,createdBy,createdDate);
        }
    }
}
