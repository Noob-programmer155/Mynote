package com.amrtm.mynoteapps.entity.note.private_note.impl;

import com.amrtm.mynoteapps.entity.note.private_note.PrivateNoteEntity;
import org.springframework.data.annotation.*;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("note")
public class NotePrivate implements PrivateNoteEntity {
    @Id
    @Column("id")
    UUID id;
    @Column("title")
    String title;
    @Column("severity")
    String severity;
    @Column("category")
    String category;
    @Column("description")
    String description;
    @Column("keynotes")
    String keynotes;
    @CreatedBy
    @Column("createdBy")
    String createdBy;
    @CreatedDate
    @Column("createdDate")
    LocalDateTime createdDate;
    @LastModifiedBy
    @Column("lastModifiedBy")
    String lastModifiedBy;
    @LastModifiedDate
    @Column("lastModifiedDate")
    LocalDateTime lastModifiedDate;
    @Column("member")
    UUID member;
    public NotePrivate() {}

    public NotePrivate(UUID id, String title, String severity, String category, String description, String keynotes, String createdBy, LocalDateTime createdDate, String lastModifiedBy, LocalDateTime lastModifiedDate, UUID member) {
        this.id = id;
        this.title = title;
        this.severity = severity;
        this.category = category;
        this.description = description;
        this.keynotes = keynotes;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
        this.member = member;
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
    public String getSeverity() {
        return severity;
    }

    @Override
    public void setSeverity(String severity) {
        this.severity = severity;
    }

    @Override
    public String getCategory() {
        return category;
    }

    @Override
    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(String lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public UUID getMember() {
        return member;
    }

    public void setMember(UUID member) {
        this.member = member;
    }

    public static class builder {
        UUID id;
        String title;
        String severity;
        String category;
        String description;
        String keynotes;
        String createdBy;
        LocalDateTime createdDate;
        String lastModifiedBy;
        LocalDateTime lastModifiedDate;
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

        public builder category(String category) {
            this.category = category;
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

        public builder member(UUID member) {
            this.member = member;
            return this;
        }

        public NotePrivate build() {
            return new NotePrivate(id,title,severity,category,description,keynotes,createdBy,createdDate,lastModifiedBy,lastModifiedDate,member);
        }
    }
}
