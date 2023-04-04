package com.amrtm.mynoteapps.backend.model.note.collab_note.impl;

import com.amrtm.mynoteapps.backend.model.note.collab_note.CollabNoteDTOInterface;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.util.Pair;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NoteCollabDTO implements CollabNoteDTOInterface {
    @JsonProperty
    UUID id;
    @JsonProperty
    String title;
    @JsonProperty
    Pair<String,String> severity;
    @JsonProperty
    SubtypeDTO subtype;
    @JsonProperty
    String description;
    @JsonProperty
    List<String> keynotes;
    Pair<String,UUID> createdBy;
    LocalDateTime createdDate;
    Pair<String,UUID> lastModifiedBy;
    LocalDateTime lastModifiedDate;
    MemberDTO member;
}
