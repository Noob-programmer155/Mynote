package com.amrtm.mynoteapps.entity.model.note.collab_note.impl;

import com.amrtm.mynoteapps.entity.model.note.collab_note.CollabNoteEntity;

import java.time.LocalDateTime;
import java.util.UUID;

public class NoteCollab implements CollabNoteEntity {
    UUID id;
    String title;
    String severity;
    String description;
    String keynotes;
    String createdBy;
    LocalDateTime createdDate;
    String lastModifiedBy;
    LocalDateTime lastModifiedDate;
    UUID subtype;
    UUID member;

    public NoteCollab() {
    }

    public NoteCollab(UUID id, String title, String severity, String description, String keynotes, String createdBy, LocalDateTime createdDate, String lastModifiedBy, LocalDateTime lastModifiedDate, UUID subtype, UUID member) {
        this.id = id;
        this.title = title;
        this.severity = severity;
        this.description = description;
        this.keynotes = keynotes;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
        this.subtype = subtype;
        this.member = member;
    }

    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public void setId(UUID id) {
        this.id = id;
    }

    @Override
    public String getTitle() {
        return title;
    }

    @Override
    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public String getSeverity() {
        return severity;
    }

    @Override
    public void setSeverity(String severity) {
        this.severity = severity;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String getKeynotes() {
        return keynotes;
    }

    @Override
    public void setKeynotes(String keynotes) {
        this.keynotes = keynotes;
    }

    @Override
    public String getCreatedBy() {
        return createdBy;
    }

    @Override
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    @Override
    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    @Override
    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    @Override
    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    @Override
    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    @Override
    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    @Override
    public UUID getSubtype() {
        return subtype;
    }

    @Override
    public void setSubtype(UUID subtype) {
        this.subtype = subtype;
    }

    @Override
    public UUID getMember() {
        return member;
    }

    @Override
    public void setMember(UUID member) {
        this.member = member;
    }

    public static class builder {
        UUID id;
        String title;
        String severity;
        String description;
        String keynotes;
        String createdBy;
        LocalDateTime createdDate;
        String lastModifiedBy;
        LocalDateTime lastModifiedDate;
        UUID subtype;
        UUID member;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder title(String title) {
            this.title = title;
            return this;
        }

        public builder severity(String severity) {
            this.severity = severity;
            return this;
        }

        public builder description(String description) {
            this.description = description;
            return this;
        }

        public builder keynotes(String keynotes) {
            this.keynotes = keynotes;
            return this;
        }

        public builder createdBy(String createdBy) {
            this.createdBy = createdBy;
            return this;
        }

        public builder createdDate(LocalDateTime createdDate) {
            this.createdDate = createdDate;
            return this;
        }

        public builder lastModifiedBy(String lastModifiedBy) {
            this.lastModifiedBy = lastModifiedBy;
            return this;
        }

        public builder lastModifiedDate(LocalDateTime lastModifiedDate) {
            this.lastModifiedDate = lastModifiedDate;
            return this;
        }

        public builder subtype(UUID subtype) {
            this.subtype = subtype;
            return this;
        }

        public builder member(UUID member) {
            this.member = member;
            return this;
        }

        public NoteCollab build() {
            return new NoteCollab(id,title,severity,description,keynotes,createdBy,createdDate,lastModifiedBy,lastModifiedDate,subtype,member);
        }
    }
}
