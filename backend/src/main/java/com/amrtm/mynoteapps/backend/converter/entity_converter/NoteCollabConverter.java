package com.amrtm.mynoteapps.backend.converter.entity_converter;

import com.amrtm.mynoteapps.backend.converter.DataConverter;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;

@Component
public class NoteCollabConverter implements DataConverter<NoteCollab, NoteCollabDTO> {
    @Value("${application.array.delimiter}")
    private String delimiter;
    @Override
    public NoteCollabDTO convertTo(NoteCollab data) {
        return NoteCollabDTO.builder()
                .id(data.getId())
                .title(data.getTitle())
                .description(data.getDescription())
                .severity(Pair.of(data.getSeverity().split(delimiter)[0],data.getSeverity().split(delimiter)[1]))
                .keynotes((data.getKeynotes() == null || data.getKeynotes().isBlank())? List.of() :Arrays.stream((data.getKeynotes()).split(delimiter)).toList())
                .subtype((data.getSubtype() == null)?null:SubtypeDTO.builder().id(data.getSubtype()).build())
                .createdBy(Pair.of((data.getCreatedBy()).split(delimiter)[0], UUID.fromString((data.getCreatedBy()).split(delimiter)[1])))
                .createdDate(data.getCreatedDate())
                .lastModifiedBy(Pair.of((data.getLastModifiedBy()).split(delimiter)[0], UUID.fromString((data.getLastModifiedBy()).split(delimiter)[1])))
                .lastModifiedDate(data.getLastModifiedDate())
                .member(MemberDTO.builder().id(data.getMember()).build())
                .build();
    }

    @Override
    public NoteCollab deconvert(NoteCollabDTO data) {
        String keynotes = null;
        if (data.getKeynotes() != null && !data.getKeynotes().isEmpty()) {
            StringJoiner sj = new StringJoiner(delimiter);
            data.getKeynotes().forEach(sj::add);
            keynotes = sj.toString();
        }
        return NoteCollab.builder()
                .id(data.getId())
                .title(data.getTitle())
                .description(data.getDescription())
                .severity(data.getSeverity().getFirst()+delimiter+data.getSeverity().getSecond())
                .keynotes(keynotes)
                .subtype((data.getSubtype() != null)?data.getSubtype().getId():null)
                .member(data.getMember().getId())
                .build();
    }

    @Override
    public NoteCollab deconvert(NoteCollabDTO data, NoteCollab entity) {
        if (data.getTitle() != null && !data.getTitle().isBlank()) entity.setTitle(data.getTitle());
        if (data.getDescription() != null && !data.getDescription().isBlank()) entity.setDescription(data.getDescription());
        if (data.getSeverity() != null) entity.setSeverity(data.getSeverity().getFirst()+delimiter+data.getSeverity().getSecond());
        if (data.getKeynotes() != null && !data.getKeynotes().isEmpty()) {
            StringJoiner sj = new StringJoiner(delimiter);
            data.getKeynotes().forEach(sj::add);
            entity.setKeynotes(sj.toString());
        }
        if (data.getSubtype() != null) entity.setSubtype(data.getSubtype().getId());
        return entity;
    }
}
