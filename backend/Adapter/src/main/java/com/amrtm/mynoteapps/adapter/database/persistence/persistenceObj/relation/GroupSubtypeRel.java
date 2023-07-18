package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("group_subtype")
public class GroupSubtypeRel {
    @Id
    @Column("id")
    Long id;
    @Column("group_note")
    UUID parent;
    @Column("subtype")
    UUID child;
    @Column("index")
    Integer index;
    @Column("color")
    String color;

    public GroupSubtypeRel() {
    }

    public GroupSubtypeRel(Long id, UUID parent, UUID child, Integer index, String color) {
        this.id = id;
        this.parent = parent;
        this.child = child;
        this.index = index;
        this.color = color;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UUID getParent() {
        return parent;
    }

    public void setParent(UUID parent) {
        this.parent = parent;
    }

    public UUID getChild() {
        return child;
    }

    public void setChild(UUID child) {
        this.child = child;
    }

    public Integer getIndex() {
        return index;
    }

    public void setIndex(Integer index) {
        this.index = index;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
