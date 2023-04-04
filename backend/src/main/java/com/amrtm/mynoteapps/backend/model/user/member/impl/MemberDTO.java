package com.amrtm.mynoteapps.backend.model.user.member.impl;

import com.amrtm.mynoteapps.backend.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.backend.model.user.UserDTOInterface;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.model.user.member.MemberDTOInterface;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDTO implements MemberDTOInterface {
    @JsonProperty
    UUID id;
    @JsonProperty
    String username;
    @JsonProperty
    String password;
    @JsonProperty
    String avatar;
    ThemeDTO theme;
}
