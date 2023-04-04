package com.amrtm.mynoteapps.backend.model.note;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;

import java.time.LocalDateTime;
import java.util.UUID;

public interface NoteEntity extends MyNoteEntity {
    String getTitle();
    void setTitle(String name);
    String getDescription();
    void setDescription(String description);
    String getCreatedBy();
    void setCreatedBy(String createdBy);
    LocalDateTime getCreatedDate();
    void setCreatedDate(LocalDateTime createdDate);
    String getLastModifiedBy();
    void setLastModifiedBy(String lastModifiedBy);
    LocalDateTime getLastModifiedDate();
    void setLastModifiedDate(LocalDateTime lastModifiedDate);
    UUID getMember();
    void setMember(UUID member);
}
