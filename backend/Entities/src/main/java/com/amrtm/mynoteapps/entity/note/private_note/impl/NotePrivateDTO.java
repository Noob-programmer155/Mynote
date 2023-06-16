package com.amrtm.mynoteapps.entity.note.private_note.impl;

import com.amrtm.mynoteapps.entity.note.private_note.PrivateNoteDTOInterface;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class NotePrivateDTO implements PrivateNoteDTOInterface {
    UUID id;
    String title;
    String category;
    Pair<String,String> severity;
    String description;
    List<String> keynotes;
    Pair<String,UUID> createdBy;
    LocalDateTime createdDate;
    Pair<String,UUID> lastModifiedBy;
    LocalDateTime lastModifiedDate;

    public NotePrivateDTO() {}

    public NotePrivateDTO(UUID id, String title, String category, Pair<String, String> severity, String description, List<String> keynotes, Pair<String, UUID> createdBy, LocalDateTime createdDate, Pair<String, UUID> lastModifiedBy, LocalDateTime lastModifiedDate) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.severity = severity;
        this.description = description;
        this.keynotes = keynotes;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getCategory() {
        return category;
    }

    @Override
    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public Pair<String, String> getSeverity() {
        return severity;
    }

    public void setSeverity(Pair<String, String> severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public List<String> getKeynotes() {
        return keynotes;
    }

    @Override
    public void setKeynotes(List<String> keynotes) {
        this.keynotes = keynotes;
    }

    public Pair<String, UUID> getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Pair<String, UUID> createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Pair<String, UUID> getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(Pair<String, UUID> lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public static class builder {
        UUID id;
        String title;
        String category;
        Pair<String,String> severity;
        String description;
        List<String> keynotes;
        Pair<String,UUID> createdBy;
        LocalDateTime createdDate;
        Pair<String,UUID> lastModifiedBy;
        LocalDateTime lastModifiedDate;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder title(String title) {
            this.title = title;
            return this;
        }

        public builder category(String category) {
            this.category = category;
            return this;
        }

        public builder severity(Pair<String, String> severity) {
            this.severity = severity;
            return this;
        }

        public builder description(String description) {
            this.description = description;
            return this;
        }

        public builder keynotes(List<String> keynotes) {
            this.keynotes = keynotes;
            return this;
        }

        public builder createdBy(Pair<String, UUID> createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public builder createdDate(LocalDateTime createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        public builder lastModifiedBy(Pair<String, UUID> lastModifiedBy) {
            this.lastModifiedBy = lastModifiedBy;
            return this;
        }

        public builder lastModifiedDate(LocalDateTime lastModifiedDate) {
            this.lastModifiedDate = lastModifiedDate;
            return this;
        }

        public NotePrivateDTO build() {
            return new NotePrivateDTO(id,title,category,severity,description,keynotes,createdBy,createdDate,lastModifiedBy,lastModifiedDate);
        }
    }
}
