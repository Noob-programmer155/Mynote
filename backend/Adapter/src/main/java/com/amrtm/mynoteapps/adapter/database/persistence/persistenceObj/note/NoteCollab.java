package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.note;

import org.springframework.data.annotation.*;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Table("note")
public class NoteCollab {
    @Id
    @Column("id")
    UUID id;
    @Column("title")
    String title;
    @Column("severity")
    String severity;
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
    @Column("subtype")
    UUID subtype;
    @Column("member")
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

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getKeynotes() {
        return keynotes;
    }

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

    public UUID getSubtype() {
        return subtype;
    }

    public void setSubtype(UUID subtype) {
        this.subtype = subtype;
    }

    public UUID getMember() {
        return member;
    }

    public void setMember(UUID member) {
        this.member = member;
    }
}
