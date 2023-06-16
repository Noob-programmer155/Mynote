package com.amrtm.mynoteapps.usecase.converter.entity_converter;

import com.amrtm.mynoteapps.entity.other.obj.GroupNotif;
import com.amrtm.mynoteapps.entity.user.group.impl.GroupNote;
import com.amrtm.mynoteapps.entity.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.usecase.converter.DataConverter;

public class GroupConverter implements DataConverter<GroupNote, GroupNoteDTO> {
    @Override
    public GroupNoteDTO convertTo(GroupNote data) {
        return new GroupNoteDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .build();
    }

    public GroupNoteDTO convertToNotification(GroupNotif data,boolean notification) {
        return new GroupNoteDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .notificationFrom(notification)
                .build();
    }

    @Override
    public GroupNote deconvert(GroupNoteDTO data) {
        return new GroupNote.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .build();
    }

    @Override
    public GroupNote deconvert(GroupNoteDTO data, GroupNote entity) {
        if (data.getUsername() != null && !data.getUsername().isBlank()) entity.setUsername(data.getUsername());
        if (data.getAvatar() != null && !data.getAvatar().isBlank()) entity.setAvatar(data.getAvatar());
        return entity;
    }
}