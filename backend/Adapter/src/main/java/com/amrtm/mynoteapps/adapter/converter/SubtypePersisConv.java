package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.subtype.Subtype;

public class SubtypePersisConv implements PersistenceConverter<Subtype, com.amrtm.mynoteapps.entity.model.subtype.impl.Subtype>{
    @Override
    public Subtype toFirst(com.amrtm.mynoteapps.entity.model.subtype.impl.Subtype from) {
        return new Subtype(from.getId(), from.getName(), null);
    }

    @Override
    public com.amrtm.mynoteapps.entity.model.subtype.impl.Subtype toSecond(Subtype from) {
        return new com.amrtm.mynoteapps.entity.model.subtype.impl.Subtype(from.getId(),from.getName());
    }
}
