package com.amrtm.mynoteapps.usecase.converter.entity_converter;

import com.amrtm.mynoteapps.entity.subtype.impl.Subtype;
import com.amrtm.mynoteapps.entity.other.bind.SubtypeColorBinding;
import com.amrtm.mynoteapps.entity.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.usecase.converter.DataConverter;

public class SubtypeConverter implements DataConverter<Subtype, SubtypeDTO> {

    @Override
    public SubtypeDTO convertTo(Subtype data) {
        return new SubtypeDTO.builder()
                .id(data.getId())
                .name(data.getName())
                .build();
    }

    public SubtypeDTO convertToWithColor(SubtypeColorBinding data) {
        return new SubtypeDTO.builder()
                .id(data.getId())
                .name(data.getName())
                .color(data.getColor())
                .build();
    }

    public SubtypeDTO convertToWithColor(Subtype data,String color) {
        return new SubtypeDTO.builder()
                .id(data.getId())
                .name(data.getName())
                .color(color)
                .build();
    }

    @Override
    public Subtype deconvert(SubtypeDTO data) {
        return new Subtype.builder()
                .id(data.getId())
                .name(data.getName())
                .build();
    }

    @Override
    public Subtype deconvert(SubtypeDTO data, Subtype entity) {
        if (data.getName() != null && !data.getName().isBlank()) entity.setName(data.getName());
        return entity;
    }
}
