package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.note.NoteCollab;

public class NoteCollabPersisConv implements PersistenceConverter<NoteCollab, com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab>{
    @Override
    public NoteCollab toFirst(com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab from) {
        return new NoteCollab(
                from.getId(),
                from.getTitle(),
                from.getSeverity(),
                from.getDescription(),
                from.getKeynotes(),
                from.getCreatedBy(),
                from.getCreatedDate(),
                from.getLastModifiedBy(),
                from.getLastModifiedDate(),
                from.getSubtype(),
                from.getMember()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab toSecond(NoteCollab from) {
        return new com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab(
                from.getId(),
                from.getTitle(),
                from.getSeverity(),
                from.getDescription(),
                from.getKeynotes(),
                from.getCreatedBy(),
                from.getCreatedDate(),
                from.getLastModifiedBy(),
                from.getLastModifiedDate(),
                from.getSubtype(),
                from.getMember()
        );
    }
}
