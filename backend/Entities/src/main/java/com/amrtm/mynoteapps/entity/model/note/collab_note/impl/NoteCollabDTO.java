package com.amrtm.mynoteapps.entity.model.note.collab_note.impl;

import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.entity.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.entity.model.note.collab_note.CollabNoteDTOInterface;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class NoteCollabDTO implements CollabNoteDTOInterface {
    UUID id;
    String title;
    Pair<String,String> severity;
    SubtypeDTO subtype;
    String description;
    List<String> keynotes;
    Pair<String,UUID> createdBy;
    LocalDateTime createdDate;
    Pair<String,UUID> lastModifiedBy;
    LocalDateTime lastModifiedDate;
    MemberDTO member;

    public NoteCollabDTO() {
    }

    public NoteCollabDTO(UUID id, String title, Pair<String, String> severity, SubtypeDTO subtype, String description, List<String> keynotes, Pair<String, UUID> createdBy, LocalDateTime createdDate, Pair<String, UUID> lastModifiedBy, LocalDateTime lastModifiedDate, MemberDTO member) {
        this.id = id;
        this.title = title;
        this.severity = severity;
        this.subtype = subtype;
        this.description = description;
        this.keynotes = keynotes;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.lastModifiedBy = lastModifiedBy;
        this.lastModifiedDate = lastModifiedDate;
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
    public Pair<String, String> getSeverity() {
        return severity;
    }

    @Override
    public void setSeverity(Pair<String, String> severity) {
        this.severity = severity;
    }

    @Override
    public SubtypeDTO getSubtype() {
        return subtype;
    }

    @Override
    public void setSubtype(SubtypeDTO subtype) {
        this.subtype = subtype;
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
    public List<String> getKeynotes() {
        return keynotes;
    }

    @Override
    public void setKeynotes(List<String> keynotes) {
        this.keynotes = keynotes;
    }

    @Override
    public Pair<String, UUID> getCreatedBy() {
        return createdBy;
    }

    @Override
    public void setCreatedBy(Pair<String, UUID> createdBy) {
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
    public Pair<String, UUID> getLastModifiedBy() {
        return lastModifiedBy;
    }

    @Override
    public void setLastModifiedBy(Pair<String, UUID> lastModifiedBy) {
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
    public MemberDTO getMember() {
        return member;
    }

    @Override
    public void setMember(MemberDTO member) {
        this.member = member;
    }

    public static class builder {
        UUID id;
        String title;
        Pair<String,String> severity;
        SubtypeDTO subtype;
        String description;
        List<String> keynotes;
        Pair<String,UUID> createdBy;
        LocalDateTime createdDate;
        Pair<String,UUID> lastModifiedBy;
        LocalDateTime lastModifiedDate;
        MemberDTO member;

        public builder id(UUID id) {
            this.id = id;
            return this;
        }

        public builder title(String title) {
            this.title = title;
            return this;
        }

        public builder severity(Pair<String, String> severity) {
            this.severity = severity;
            return this;
        }

        public builder subtype(SubtypeDTO subtype) {
            this.subtype = subtype;
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

        public builder member(MemberDTO member) {
            this.member = member;
            return this;
        }

        public NoteCollabDTO build() {
            return new NoteCollabDTO(id,title,severity,subtype,description,keynotes,createdBy,createdDate,lastModifiedBy,lastModifiedDate,member);
        }
    }
}
