package com.amrtm.mynoteapps.backend.model.theme.impl;

import com.amrtm.mynoteapps.backend.model.theme.ThemeDTOInterface;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.util.Pair;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ThemeDTO implements ThemeDTOInterface {
    @JsonProperty
    UUID id;
    @JsonProperty
    String name;
    @JsonProperty
    String background_color;
    @JsonProperty
    String foreground_color;
    @JsonProperty
    String background_images;
    @JsonProperty
    String border_color;
    @JsonProperty
    String danger_background;
    @JsonProperty
    String danger_foreground;
    @JsonProperty
    String info_background;
    @JsonProperty
    String info_foreground;
    @JsonProperty
    String default_background;
    @JsonProperty
    String default_foreground;
    @JsonProperty
    String background;
    @JsonProperty
    String foreground;
    Pair<String,UUID> createdBy;
    LocalDateTime createdDate;
}
