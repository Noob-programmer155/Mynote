package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("subtype_note_group")
public class SubtypeNoteRel {
    @Id
    @Column("id")
    Long id;
    @Column("subtype_group")
    Long parent;
    @Column("note")
    UUID child;

    public SubtypeNoteRel() {
    }

    public SubtypeNoteRel(Long id, Long parent, UUID child) {
        this.id = id;
        this.parent = parent;
        this.child = child;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }

    public UUID getChild() {
        return child;
    }

    public void setChild(UUID child) {
        this.child = child;
    }
}
