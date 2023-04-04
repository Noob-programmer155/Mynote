package com.amrtm.mynoteapps.backend.converter.entity_converter;

import com.amrtm.mynoteapps.backend.converter.DataConverter;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class MemberConverter implements DataConverter<Member, MemberDTO> {

    @Override
    public MemberDTO convertTo(Member data) {
        return MemberDTO.builder()
                .id(data.getId())
                .username(data.getUsername())
                .avatar(data.getAvatar())
                .build();
    }

    @Override
    public Member deconvert(MemberDTO data) {
        if (data.getPassword() != null && !data.getPassword().isBlank())
            return Member.builder()
                    .id(data.getId())
                    .username(data.getUsername())
                    .avatar(data.getAvatar())
                    .password(SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().encode(data.getPassword()))
                    .build();
        else
            return Member.builder()
                    .id(data.getId())
                    .username(data.getUsername())
                    .avatar(data.getAvatar())
                    .build();
    }

    @Override
    public Member deconvert(MemberDTO data, Member entity) {
        if (data.getUsername() != null && !data.getUsername().isBlank()) entity.setUsername(data.getUsername());
        if (data.getPassword() != null && !data.getPassword().isBlank()) entity.setPassword(SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().encode(data.getPassword()));
        if (data.getAvatar() != null && !data.getAvatar().isBlank()) entity.setAvatar(data.getAvatar());
        return entity;
    }
}
