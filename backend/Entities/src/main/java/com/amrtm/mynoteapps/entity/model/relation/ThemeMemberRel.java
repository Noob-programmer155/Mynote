package com.amrtm.mynoteapps.entity.model.relation;

import java.util.UUID;

public class ThemeMemberRel implements ThemeMemberRelInterface<UUID> {
    Long id;
    UUID parent;
    UUID child;
    Integer isActive;

    public ThemeMemberRel() {
    }

    public ThemeMemberRel(Long id, UUID parent, UUID child, Integer isActive) {
        this.id = id;
        this.parent = parent;
        this.child = child;
        this.isActive = isActive;
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

    @Override
    public Integer getIsActive() {
        return isActive;
    }

    @Override
    public void setIsActive(Integer isActive) {
        this.isActive = isActive;
    }

    public static class builder {
        private Long id;
        private UUID parent;
        private UUID child;
        private Integer isActive;

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

        public builder isActive(Integer isActive) {
            this.isActive = isActive;
            return this;
        }

        public ThemeMemberRel build() {
            return new ThemeMemberRel(id,parent,child,isActive);
        }
    }
}
