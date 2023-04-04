package com.amrtm.mynoteapps.backend.model.theme.impl;

import com.amrtm.mynoteapps.backend.model.theme.ThemeEntity;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table("theme")
public class Theme implements ThemeEntity {
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
}
