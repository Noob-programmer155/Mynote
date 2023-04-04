package com.amrtm.mynoteapps.backend.converter.entity_converter;

import com.amrtm.mynoteapps.backend.converter.DataConverter;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.backend.model.subtype.impl.Subtype;
import org.springframework.stereotype.Component;

@Component
public class SubtypeConverter implements DataConverter<Subtype, SubtypeDTO> {

    @Override
    public SubtypeDTO convertTo(Subtype data) {
        return SubtypeDTO.builder()
                .id(data.getId())
                .name(data.getName())
                .color(data.getColor())
                .build();
    }

    @Override
    public Subtype deconvert(SubtypeDTO data) {
        return Subtype.builder()
                .id(data.getId())
                .name(data.getName())
                .color(data.getColor())
                .build();
    }

    @Override
    public Subtype deconvert(SubtypeDTO data, Subtype entity) {
        if (data.getName() != null && !data.getName().isBlank()) entity.setName(data.getName());
        if (data.getColor() != null && !data.getColor().isBlank()) entity.setColor(data.getColor());
        return entity;
    }
}
