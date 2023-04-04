package com.amrtm.mynoteapps.backend.model.subtype.impl;

import com.amrtm.mynoteapps.backend.model.subtype.SubtypeDTOInterface;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubtypeDTO implements SubtypeDTOInterface {
    @JsonProperty
    UUID id;
    @JsonProperty
    String name;
    @JsonProperty
    String color;
}
