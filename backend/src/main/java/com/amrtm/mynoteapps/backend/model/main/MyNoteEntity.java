package com.amrtm.mynoteapps.backend.model.main;

import com.amrtm.mynoteapps.backend.model.GlobalEntity;

import java.util.UUID;

public interface MyNoteEntity extends GlobalEntity {
    UUID getId();
    void setId(UUID id);
}
