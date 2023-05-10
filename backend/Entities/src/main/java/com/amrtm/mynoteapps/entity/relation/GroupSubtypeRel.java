package com.amrtm.mynoteapps.entity.relation;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("group_subtype")
public class GroupSubtypeRel implements GroupSubtypeRelInterface<UUID> {
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

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public UUID getParent() {
        return parent;
    }

    @Override
    public void setParent(UUID parent) {
        this.parent = parent;
    }

    @Override
    public UUID getChild() {
        return child;
    }

    @Override
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

    public static class builder {
        private Long id;
        private UUID parent;
        private UUID child;
        private Integer index;
        private String color;

        public builder id(Long id) {
            this.id = id;
            return this;
        }

        public builder parent(UUID parent) {
            this.parent = parent;
            return this;
        }

        public builder child(UUID child) {
            this.child = child;
            return this;
        }

        public builder index(Integer index) {
            this.index = index;
            return this;
        }

        public builder color(String color) {
            this.color = color;
            return this;
        }

        public GroupSubtypeRel build() {
            return new GroupSubtypeRel(id,parent,child,index,color);
        }
    }
}
