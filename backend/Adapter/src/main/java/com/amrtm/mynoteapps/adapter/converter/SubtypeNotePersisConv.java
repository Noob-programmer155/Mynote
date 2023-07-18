package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.SubtypeNoteRel;

public class SubtypeNotePersisConv implements PersistenceConverter<SubtypeNoteRel, com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel>{
    @Override
    public SubtypeNoteRel toFirst(com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel from) {
        return new SubtypeNoteRel(
                from.getId(),
                from.getParent(),
                from.getChild()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel toSecond(SubtypeNoteRel from) {
        return new com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel(
                from.getId(),
                from.getParent(),
                from.getChild()
        );
    }
}
