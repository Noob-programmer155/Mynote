package com.amrtm.mynoteapps.entity.model.note;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;

import com.amrtm.mynoteapps.entity.other.utils.Pair;

import java.time.LocalDateTime;
import java.util.UUID;

public interface NoteDTOInterface extends MyNoteEntity {
    String getTitle();
    void setTitle(String name);
    String getDescription();
    void setDescription(String description);
    Pair<String,UUID> getCreatedBy();
    void setCreatedBy(Pair<String,UUID> createdBy);
    LocalDateTime getCreatedDate();
    void setCreatedDate(LocalDateTime createdDate);
    Pair<String,UUID> getLastModifiedBy();
    void setLastModifiedBy(Pair<String,UUID> lastModifiedBy);
    LocalDateTime getLastModifiedDate();
    void setLastModifiedDate(LocalDateTime lastModifiedDate);
}
