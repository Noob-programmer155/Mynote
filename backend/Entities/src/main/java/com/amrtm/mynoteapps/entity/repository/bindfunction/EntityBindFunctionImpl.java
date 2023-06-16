package com.amrtm.mynoteapps.entity.repository.bindfunction;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.utils.Tuple2;
import com.amrtm.mynoteapps.entity.other.utils.Tuple3;
import com.amrtm.mynoteapps.entity.subtype.impl.Subtype;
import com.amrtm.mynoteapps.entity.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.entity.theme.impl.Theme;
import com.amrtm.mynoteapps.entity.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

public class EntityBindFunctionImpl implements EntityBindFunction {
    private final String delimiter;

    public EntityBindFunctionImpl(String delimiter) {
        this.delimiter = delimiter;
    }

    public MemberDTO MEMBER_DTO_BINDING (Tuple2<Member, Theme> item) {
        return new MemberDTO.builder()
            .id(item.getT1().getId())
            .username(item.getT1().getUsername())
            .avatar(item.getT1().getAvatar())
            .theme((item.getT2().getId() != null)? new ThemeDTO.builder()
                    .id(item.getT2().getId())
                    .name(item.getT2().getName())
                    .background_images(item.getT2().getBackground_images())
                    .border_color(item.getT2().getBorder_color())
                    .background_color(item.getT2().getBackground_color())
                    .foreground_color(item.getT2().getForeground_color())
                    .default_background(item.getT2().getDefault_background())
                    .default_foreground(item.getT2().getDefault_foreground())
                    .info_background(item.getT2().getInfo_background())
                    .info_foreground(item.getT2().getInfo_foreground())
                    .danger_background(item.getT2().getDanger_background())
                    .danger_foreground(item.getT2().getDanger_foreground())
                    .background(item.getT2().getBackground())
                    .foreground(item.getT2().getForeground())
                    .createdBy(Pair.of(item.getT2().getCreatedBy().split(delimiter)[0],UUID.fromString(item.getT2().getCreatedBy().split(delimiter)[1])))
                    .createdDate(item.getT2().getCreatedDate())
                    .isMyTheme(true)
                    .build():null
            ).build();
    }

    public NoteCollabDTO NOTE_COLLAB_DTO_BINDING(Tuple3<NoteCollab, Subtype, Member> item) {
        return new NoteCollabDTO.builder()
            .id(item.getT1().getId())
            .title(item.getT1().getTitle())
            .description(item.getT1().getDescription())
            .severity(Pair.of(item.getT1().getSeverity().split(delimiter)[0],item.getT1().getSeverity().split(delimiter)[1]))
            .keynotes((item.getT1().getKeynotes() != null && !item.getT1().getKeynotes().isBlank())?Arrays.stream((item.getT1().getKeynotes()).split(delimiter)).toList():List.of())
            .createdBy(Pair.of((item.getT1().getCreatedBy()).split(delimiter)[0],UUID.fromString((item.getT1().getCreatedBy()).split(delimiter)[1])))
            .createdDate(item.getT1().getCreatedDate())
            .lastModifiedBy(Pair.of((item.getT1().getLastModifiedBy()).split(delimiter)[0],UUID.fromString((item.getT1().getLastModifiedBy()).split(delimiter)[1])))
            .lastModifiedDate(item.getT1().getLastModifiedDate())
            .member(new MemberDTO.builder()
                    .id(item.getT3().getId())
                    .username(item.getT3().getUsername())
                    .avatar(item.getT3().getAvatar()).build()
            )
            .subtype(new SubtypeDTO.builder()
                    .id(item.getT2().getId())
                    .name(item.getT2().getName())
                    .build()
            ).build();
    }

    public NotePrivateDTO NOTE_PRIVATE_DTO_BINDING(NotePrivate item) {
        return new NotePrivateDTO.builder()
            .id(item.getId())
            .title(item.getTitle())
            .category(item.getCategory())
            .severity(Pair.of(item.getSeverity().split(delimiter)[0],item.getSeverity().split(delimiter)[1]))
            .description(item.getDescription())
            .keynotes((item.getKeynotes() != null && !item.getKeynotes().isBlank())?Arrays.stream((item.getKeynotes()).split(delimiter)).toList():null)
            .createdBy(Pair.of((item.getCreatedBy()).split(delimiter)[0],UUID.fromString((item.getCreatedBy()).split(delimiter)[1])))
            .createdDate(item.getCreatedDate())
            .lastModifiedBy(Pair.of((item.getLastModifiedBy()).split(delimiter)[0],UUID.fromString((item.getLastModifiedBy()).split(delimiter)[1])))
            .lastModifiedDate(item.getLastModifiedDate())
            .build();
    }
}
