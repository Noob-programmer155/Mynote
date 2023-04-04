package com.amrtm.mynoteapps.backend.converter.entity_converter;

import com.amrtm.mynoteapps.backend.converter.DataConverter;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNote;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class GroupConverter implements DataConverter<GroupNote, GroupNoteDTO> {
    @Override
    public GroupNoteDTO convertTo(GroupNote data) {
        return GroupNoteDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .build();
    }

    @Override
    public GroupNote deconvert(GroupNoteDTO data) {
        if (data.getPassword() != null && !data.getPassword().isBlank())
            return GroupNote.builder()
                    .id(data.getId())
                    .username(data.getUsername())
                    .avatar(data.getAvatar())
                    .password(SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().encode(data.getPassword()))
                    .build();
        else
            return GroupNote.builder()
                    .id(data.getId())
                    .username(data.getUsername())
                    .avatar(data.getAvatar())
                    .build();
    }

    @Override
    public GroupNote deconvert(GroupNoteDTO data, GroupNote entity) {
        if (data.getUsername() != null && !data.getUsername().isBlank()) entity.setUsername(data.getUsername());
        if (data.getPassword() != null && !data.getPassword().isBlank()) entity.setPassword(SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().encode(data.getPassword()));
        if (data.getAvatar() != null && !data.getAvatar().isBlank()) entity.setAvatar(data.getAvatar());
        return entity;
    }
}