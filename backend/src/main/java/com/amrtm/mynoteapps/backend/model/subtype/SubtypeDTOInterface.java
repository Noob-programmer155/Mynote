package com.amrtm.mynoteapps.backend.model.subtype;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;

public interface SubtypeDTOInterface extends MyNoteEntity {
    String getName();
    void setName(String name);
}
