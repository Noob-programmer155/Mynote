package com.amrtm.mynoteapps.usecase.converter.entity_converter;

import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.usecase.converter.DataConverter;


import java.util.Arrays;
import java.util.List;
import java.util.StringJoiner;
import java.util.UUID;

public class NotePrivateConverter implements DataConverter<NotePrivate, NotePrivateDTO> {
    private final String delimiter;

    public NotePrivateConverter(String delimiter) {
        this.delimiter = delimiter;
    }

    @Override
    public NotePrivateDTO convertTo(NotePrivate data) {
        return new NotePrivateDTO.builder()
                .id(data.getId())
                .title(data.getTitle())
                .category(data.getCategory())
                .severity(Pair.of(data.getSeverity().split(delimiter)[0],data.getSeverity().split(delimiter)[1]))
                .description(data.getDescription())
                .keynotes((data.getKeynotes() == null || data.getKeynotes().isBlank())? List.of() :Arrays.stream((data.getKeynotes()).split(delimiter)).toList())
                .createdBy(Pair.of((data.getCreatedBy()).split(delimiter)[0], UUID.fromString((data.getCreatedBy()).split(delimiter)[1])))
                .createdDate(data.getCreatedDate())
                .lastModifiedBy(Pair.of((data.getLastModifiedBy()).split(delimiter)[0], UUID.fromString((data.getLastModifiedBy()).split(delimiter)[1])))
                .lastModifiedDate(data.getLastModifiedDate())
                .member(new MemberDTO.builder().id(data.getMember()).build())
                .build();
    }

    @Override
    public NotePrivate deconvert(NotePrivateDTO data) {
        String keynotes = null;
        if (data.getKeynotes() != null && !data.getKeynotes().isEmpty()) {
            StringJoiner sj = new StringJoiner(delimiter);
            data.getKeynotes().forEach(sj::add);
            keynotes = sj.toString();
        }
        return new NotePrivate.builder()
                .id(data.getId())
                .title(data.getTitle())
                .description(data.getDescription())
                .category((data.getCategory() != null && !data.getCategory().isBlank())?data.getCategory():"uncategorized")
                .severity(data.getSeverity().getFirst()+delimiter+data.getSeverity().getSecond())
                .keynotes(keynotes)
                .member(data.getMember().getId())
                .build();
    }

    @Override
    public NotePrivate deconvert(NotePrivateDTO data, NotePrivate entity) {
        if (data.getTitle() != null && !data.getTitle().isBlank()) entity.setTitle(data.getTitle());
        if (data.getDescription() != null && !data.getDescription().isBlank()) entity.setDescription(data.getDescription());
        if (data.getCategory() != null && !data.getCategory().isBlank()) entity.setCategory(data.getCategory());
        if (data.getSeverity() != null) entity.setSeverity(data.getSeverity().getFirst()+delimiter+data.getSeverity().getSecond());
        if (data.getKeynotes() != null && !data.getKeynotes().isEmpty()) {
            StringJoiner sj = new StringJoiner(delimiter);
            data.getKeynotes().forEach(sj::add);
            entity.setKeynotes(sj.toString());
        }
        return entity;
    }
}
