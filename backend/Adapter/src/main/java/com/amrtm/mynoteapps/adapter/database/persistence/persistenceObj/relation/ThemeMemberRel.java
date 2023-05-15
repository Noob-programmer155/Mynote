package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("theme_member")
public class ThemeMemberRel {
    @Id
    @Column("id")
    Long id;
    @Column("theme")
    UUID parent;
    @Column("member")
    UUID child;
    @Column("isActive")
    Integer isActive;

    public ThemeMemberRel() {
    }

    public ThemeMemberRel(Long id, UUID parent, UUID child, Integer isActive) {
        this.id = id;
        this.parent = parent;
        this.child = child;
        this.isActive = isActive;
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

    public Integer getIsActive() {
        return isActive;
    }

    public void setIsActive(Integer isActive) {
        this.isActive = isActive;
    }
}
