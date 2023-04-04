package com.amrtm.mynoteapps.backend.repository.bindfunction;

import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.backend.model.subtype.impl.Subtype;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.backend.model.theme.impl.Theme;
import com.amrtm.mynoteapps.backend.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuple3;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class EntityBindFunctionImpl implements EntityBindFunction{
    @Value("${application.array.delimiter}")
    private String delimiter;
    public MemberDTO MEMBER_DTO_BINDING (Tuple2<Member, Theme> item) {
        return MemberDTO.builder()
            .id(item.getT1().getId())
            .username(item.getT1().getUsername())
            .avatar(item.getT1().getAvatar())
            .theme((item.getT2().getId() != null)?ThemeDTO.builder()
                    .id(item.getT2().getId())
                    .name(item.getT2().getName())
                    .background_images(item.getT2().getBackground_images())
                    .border_color(item.getT2().getBorder_color())
                    .background_color(item.getT2().getBackground_color())
                    .background(item.getT2().getBackground())
                    .foreground(item.getT2().getForeground())
                    .build():null
            ).build();
    }

    public NoteCollabDTO NOTE_COLLAB_DTO_BINDING(Tuple3<NoteCollab, Subtype, Member> item) {
        return NoteCollabDTO.builder()
            .id(item.getT1().getId())
            .title(item.getT1().getTitle())
            .description(item.getT1().getDescription())
            .severity(Pair.of(item.getT1().getSeverity().split(delimiter)[0],item.getT1().getSeverity().split(delimiter)[1]))
            .keynotes((item.getT1().getKeynotes() != null && !item.getT1().getKeynotes().isBlank())?Arrays.stream((item.getT1().getKeynotes()).split(delimiter)).toList():List.of())
            .createdBy(Pair.of((item.getT1().getCreatedBy()).split(delimiter)[0],UUID.fromString((item.getT1().getCreatedBy()).split(delimiter)[1])))
            .createdDate(item.getT1().getCreatedDate())
            .lastModifiedBy(Pair.of((item.getT1().getLastModifiedBy()).split(delimiter)[0],UUID.fromString((item.getT1().getLastModifiedBy()).split(delimiter)[1])))
            .lastModifiedDate(item.getT1().getLastModifiedDate())
            .member(MemberDTO.builder()
                    .id(item.getT3().getId())
                    .username(item.getT3().getUsername())
                    .avatar(item.getT3().getAvatar()).build()
            )
            .subtype(SubtypeDTO.builder()
                    .id(item.getT2().getId())
                    .name(item.getT2().getName())
                    .color(item.getT2().getColor())
                    .build()
            ).build();
    }

    public NotePrivateDTO NOTE_PRIVATE_DTO_BINDING(Tuple2<NotePrivate, Member> item) {
        return NotePrivateDTO.builder()
            .id(item.getT1().getId())
            .title(item.getT1().getTitle())
            .category(item.getT1().getCategory())
            .severity(Pair.of(item.getT1().getSeverity().split(delimiter)[0],item.getT1().getSeverity().split(delimiter)[1]))
            .description(item.getT1().getDescription())
            .keynotes((item.getT1().getKeynotes() != null && !item.getT1().getKeynotes().isBlank())?Arrays.stream((item.getT1().getKeynotes()).split(delimiter)).toList():null)
            .createdBy(Pair.of((item.getT1().getCreatedBy()).split(delimiter)[0],UUID.fromString((item.getT1().getCreatedBy()).split(delimiter)[1])))
            .createdDate(item.getT1().getCreatedDate())
            .lastModifiedBy(Pair.of((item.getT1().getLastModifiedBy()).split(delimiter)[0],UUID.fromString((item.getT1().getLastModifiedBy()).split(delimiter)[1])))
            .lastModifiedDate(item.getT1().getLastModifiedDate())
            .member(MemberDTO.builder()
                    .id(item.getT2().getId())
                    .username(item.getT2().getUsername())
                    .avatar(item.getT2().getAvatar()).build()
            ).build();
    }
}
