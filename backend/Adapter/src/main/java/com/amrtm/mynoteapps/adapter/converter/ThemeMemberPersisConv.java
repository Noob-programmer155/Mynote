package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.ThemeMemberRel;

public class ThemeMemberPersisConv implements PersistenceConverter<ThemeMemberRel, com.amrtm.mynoteapps.entity.relation.ThemeMemberRel>{
    @Override
    public ThemeMemberRel toFirst(com.amrtm.mynoteapps.entity.relation.ThemeMemberRel from) {
        return new ThemeMemberRel(
                from.getId(),
                from.getParent(),
                from.getChild(),
                from.getIsActive()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.relation.ThemeMemberRel toSecond(ThemeMemberRel from) {
        return new com.amrtm.mynoteapps.entity.relation.ThemeMemberRel(
                from.getId(),
                from.getParent(),
                from.getChild(),
                from.getIsActive()
        );
    }
}
