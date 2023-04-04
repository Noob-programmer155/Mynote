package com.amrtm.mynoteapps.backend.model.note.private_note.impl;

import com.amrtm.mynoteapps.backend.model.note.private_note.PrivateNoteDTOInterface;
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
public class NotePrivateDTO implements PrivateNoteDTOInterface {
    @JsonProperty
    UUID id;
    @JsonProperty
    String title;
    @JsonProperty
    String category;
    @JsonProperty
    Pair<String,String> severity;
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
