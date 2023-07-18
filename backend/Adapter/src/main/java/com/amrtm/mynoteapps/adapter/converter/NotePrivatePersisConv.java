package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.note.NotePrivate;

public class NotePrivatePersisConv implements PersistenceConverter<NotePrivate, com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivate>{
    @Override
    public NotePrivate toFirst(com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivate from) {
        return new NotePrivate(
                from.getId(),
                from.getTitle(),
                from.getSeverity(),
                from.getCategory(),
                from.getDescription(),
                from.getKeynotes(),
                from.getCreatedBy(),
                from.getCreatedDate(),
                from.getLastModifiedBy(),
                from.getLastModifiedDate(),
                from.getMember()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivate toSecond(NotePrivate from) {
        return new com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivate(
                from.getId(),
                from.getTitle(),
                from.getSeverity(),
                from.getCategory(),
                from.getDescription(),
                from.getKeynotes(),
                from.getCreatedBy(),
                from.getCreatedDate(),
                from.getLastModifiedBy(),
                from.getLastModifiedDate(),
                from.getMember()
        );
    }
}
