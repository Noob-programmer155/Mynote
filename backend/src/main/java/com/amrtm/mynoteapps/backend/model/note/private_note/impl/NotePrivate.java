package com.amrtm.mynoteapps.backend.model.note.private_note.impl;

import com.amrtm.mynoteapps.backend.model.note.private_note.PrivateNoteEntity;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
}
