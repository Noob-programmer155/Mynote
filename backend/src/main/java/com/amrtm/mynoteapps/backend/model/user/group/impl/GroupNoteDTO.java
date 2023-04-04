package com.amrtm.mynoteapps.backend.model.user.group.impl;

import com.amrtm.mynoteapps.backend.model.user.group.GroupNoteDTOInterface;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupNoteDTO implements GroupNoteDTOInterface {
    @JsonProperty
    UUID id;
    @JsonProperty
    String username;
    @JsonProperty
    String password;
    @JsonProperty
    String avatar;
    Boolean isMember;
}
