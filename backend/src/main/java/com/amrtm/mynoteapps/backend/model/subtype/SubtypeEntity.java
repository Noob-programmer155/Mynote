package com.amrtm.mynoteapps.backend.model.subtype;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;

public interface SubtypeEntity extends MyNoteEntity {
    String getName();
    void setName(String name);
}