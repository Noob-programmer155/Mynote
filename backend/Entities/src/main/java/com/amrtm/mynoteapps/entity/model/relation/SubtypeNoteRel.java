package com.amrtm.mynoteapps.entity.model.relation;

import java.util.UUID;

public class SubtypeNoteRel implements SubtypeNoteRelInterface<UUID>{
    Long id;
    Long parent;
    UUID child;

    public SubtypeNoteRel() {
    }

    public SubtypeNoteRel(Long id, Long parent, UUID child) {
        this.id = id;
        this.parent = parent;
        this.child = child;
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
    public Long getParent() {
        return parent;
    }

    @Override
    public void setParent(Long parent) {
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

    public static class builder {
        private Long id;
        private Long parent;
        private UUID child;

        public builder id(Long id) {
            this.id = id;
            return this;
        }

        public builder parent(Long parent) {
            this.parent = parent;
            return this;
        }

        public builder child(UUID child) {
            this.child = child;
            return this;
        }

        public SubtypeNoteRel build() {
            return new SubtypeNoteRel(id,parent,child);
        }
    }
}
