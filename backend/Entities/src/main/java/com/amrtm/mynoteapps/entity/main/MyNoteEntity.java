package com.amrtm.mynoteapps.entity.main;

import com.amrtm.mynoteapps.entity.GlobalEntity;

import java.util.UUID;

public interface MyNoteEntity extends GlobalEntity {
    UUID getId();
    void setId(UUID id);
}
