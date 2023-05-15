package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.theme.Theme;

public class ThemePersisConv implements PersistenceConverter<Theme, com.amrtm.mynoteapps.entity.theme.impl.Theme>{
    @Override
    public Theme toFirst(com.amrtm.mynoteapps.entity.theme.impl.Theme from) {
        return new Theme(
                from.getId(),
                from.getName(),
                from.getBackground_color(),
                from.getForeground_color(),
                from.getBackground_images(),
                from.getBorder_color(),
                from.getDanger_background(),
                from.getDanger_foreground(),
                from.getInfo_background(),
                from.getInfo_foreground(),
                from.getDefault_background(),
                from.getDefault_foreground(),
                from.getBackground(),
                from.getForeground(),
                from.getCreatedBy(),
                from.getCreatedDate()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.theme.impl.Theme toSecond(Theme from) {
        return new com.amrtm.mynoteapps.entity.theme.impl.Theme(
                from.getId(),
                from.getName(),
                from.getBackground_color(),
                from.getForeground_color(),
                from.getBackground_images(),
                from.getBorder_color(),
                from.getDanger_background(),
                from.getDanger_foreground(),
                from.getInfo_background(),
                from.getInfo_foreground(),
                from.getDefault_background(),
                from.getDefault_foreground(),
                from.getBackground(),
                from.getForeground(),
                from.getCreatedBy(),
                from.getCreatedDate()
        );
    }
}
