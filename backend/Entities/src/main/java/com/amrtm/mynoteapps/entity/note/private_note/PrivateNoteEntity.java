package com.amrtm.mynoteapps.entity.note.private_note;

import com.amrtm.mynoteapps.entity.note.NoteEntity;

public interface PrivateNoteEntity extends NoteEntity {
    String getSeverity();
    void setSeverity(String severity);
    String getCategory();
    void setCategory(String category);
    String getKeynotes();
    void setKeynotes(String keynotes);
}
