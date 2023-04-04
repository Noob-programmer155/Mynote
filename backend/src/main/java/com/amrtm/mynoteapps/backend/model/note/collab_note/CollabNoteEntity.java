package com.amrtm.mynoteapps.backend.model.note.collab_note;

import com.amrtm.mynoteapps.backend.model.note.NoteEntity;

import java.util.UUID;

public interface CollabNoteEntity extends NoteEntity {
    String getSeverity();
    void setSeverity(String severity);
    String getKeynotes();
    void setKeynotes(String keynotes);
    UUID getSubtype();
    void setSubtype(UUID subtype);
}
