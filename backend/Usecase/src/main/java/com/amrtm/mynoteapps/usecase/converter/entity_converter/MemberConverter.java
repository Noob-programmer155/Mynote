package com.amrtm.mynoteapps.usecase.converter.entity_converter;

import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.other.obj.MemberNotif;
import com.amrtm.mynoteapps.entity.model.user.member.impl.Member;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.usecase.converter.DataConverter;
import com.amrtm.mynoteapps.usecase.security.PasswordEncoder;

public class MemberConverter implements DataConverter<Member, MemberDTO> {
    private final PasswordEncoder passwordEncoder;

    public MemberConverter(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public MemberDTO convertTo(Member data) {
        return new MemberDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .build();
    }

    public MemberDTO convertToWithRole(Member data, Role role) {
        return new MemberDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .role(role)
                .build();
    }

    public MemberDTO convertToNotification(MemberNotif data,boolean notification) {
        return new MemberDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .notificationFrom(notification)
                .build();
    }

    @Override
    public Member deconvert(MemberDTO data) {
        if (data.getPassword() != null && !data.getPassword().isBlank())
            return new Member.builder()
                    .id(data.getId())
                    .username(data.getUsername())
                    .avatar(data.getAvatar())
                    .password(passwordEncoder.encode(data.getPassword()))
                    .build();
        else
            throw new IllegalArgumentException("password must added");
    }

    @Override
    public Member deconvert(MemberDTO data, Member entity) {
        if (data.getUsername() != null && !data.getUsername().isBlank()) entity.setUsername(data.getUsername());
        if (data.getPassword() != null && !data.getPassword().isBlank()) entity.setPassword(passwordEncoder.encode(data.getPassword()));
        if (data.getAvatar() != null && !data.getAvatar().isBlank()) entity.setAvatar(data.getAvatar());
        return entity;
    }
}
