package com.amrtm.mynoteapps.entity.model.subtype;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;

public interface SubtypeEntity extends MyNoteEntity {
    String getName();
    void setName(String name);
}
