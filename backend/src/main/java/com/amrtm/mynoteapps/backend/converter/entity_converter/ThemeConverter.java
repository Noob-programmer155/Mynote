package com.amrtm.mynoteapps.backend.converter.entity_converter;

import com.amrtm.mynoteapps.backend.converter.DataConverter;
import com.amrtm.mynoteapps.backend.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.backend.model.theme.impl.Theme;
import com.amrtm.mynoteapps.backend.service.file.ThemeStorage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ThemeConverter implements DataConverter<Theme, ThemeDTO> {
    @Value("${application.array.delimiter}")
    private String delimiter;
    @Autowired ThemeStorage themeStorage;

    @Override
    public ThemeDTO convertTo(Theme data) {
        return ThemeDTO.builder()
                .id(data.getId())
                .name(data.getName())
                .background_color(data.getBackground_color())
                .foreground_color(data.getForeground_color())
                .background_images(data.getBackground_images())
                .border_color(data.getBorder_color())
                .danger_background(data.getDanger_background())
                .danger_foreground(data.getDanger_foreground())
                .info_background(data.getInfo_background())
                .info_foreground(data.getInfo_foreground())
                .default_background(data.getDefault_background())
                .default_foreground(data.getDefault_foreground())
                .background(data.getBackground())
                .foreground(data.getForeground())
                .createdBy(Pair.of((data.getCreatedBy()).split(delimiter)[0], UUID.fromString((data.getCreatedBy()).split(delimiter)[1])))
                .createdDate(data.getCreatedDate())
                .build();
    }

    @Override
    public Theme deconvert(ThemeDTO data) {
        return Theme.builder()
                .id(data.getId())
                .name(data.getName())
                .background_color(data.getBackground_color())
                .foreground_color(data.getForeground_color())
                .background_images(data.getBackground_images())
                .border_color(data.getBorder_color())
                .danger_background(data.getDanger_background())
                .danger_foreground(data.getDanger_foreground())
                .info_background(data.getInfo_background())
                .info_foreground(data.getInfo_foreground())
                .default_background(data.getDefault_background())
                .default_foreground(data.getDefault_foreground())
                .background(data.getBackground())
                .foreground(data.getForeground())
                .build();
    }

    @Override
    public Theme deconvert(ThemeDTO data, Theme entity) {
        if (data.getName() != null && !data.getName().isBlank()) entity.setName(data.getName());
        if (data.getBackground_color() != null && !data.getBackground_color().isBlank()) entity.setBackground_color(data.getBackground_color());
        if (data.getForeground_color() != null && !data.getForeground_color().isBlank()) entity.setForeground_color(data.getForeground_color());
        if (data.getBackground_images() != null && !data.getBackground_images().isBlank()) entity.setBackground_images(data.getBackground_images());
        if (data.getBorder_color() != null && !data.getBorder_color().isBlank()) entity.setBorder_color(data.getBorder_color());
        if (data.getDanger_background() != null && !data.getDanger_background().isBlank()) entity.setDanger_background(data.getDanger_background());
        if (data.getDanger_foreground() != null && !data.getDanger_foreground().isBlank()) entity.setDanger_foreground(data.getDanger_foreground());
        if (data.getInfo_background() != null && !data.getInfo_background().isBlank()) entity.setInfo_background(data.getInfo_background());
        if (data.getInfo_foreground() != null && !data.getInfo_foreground().isBlank()) entity.setInfo_foreground(data.getInfo_foreground());
        if (data.getDefault_background() != null && !data.getDefault_background().isBlank()) entity.setDefault_background(data.getDefault_background());
        if (data.getDefault_foreground() != null && !data.getDefault_foreground().isBlank()) entity.setDefault_foreground(data.getDefault_foreground());
        if (data.getBackground() != null && !data.getBackground().isBlank()) entity.setBackground(data.getBackground());
        if (data.getForeground() != null && !data.getForeground().isBlank()) entity.setForeground(data.getForeground());
        return entity;
    }
}
