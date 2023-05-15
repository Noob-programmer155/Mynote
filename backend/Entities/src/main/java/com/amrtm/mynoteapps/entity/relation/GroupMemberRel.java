package com.amrtm.mynoteapps.entity.relation;

import com.amrtm.mynoteapps.entity.other.Role;

import java.util.UUID;

public class GroupMemberRel implements GroupMemberRelInterface<UUID> {
    Long id;
    UUID parent;
    UUID child;
    Role role;
    Integer isDeleted;
    Integer isConfirmed;

    public GroupMemberRel() {
    }

    public GroupMemberRel(Long id, UUID parent, UUID child, Role role, Integer isDeleted, Integer isConfirmed) {
        this.id = id;
        this.parent = parent;
        this.child = child;
        this.role = role;
        this.isDeleted = isDeleted;
        this.isConfirmed = isConfirmed;
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

    @Override
    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    @Override
    public Integer getIsDeleted() {
        return isDeleted;
    }

    @Override
    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    @Override
    public Integer getIsConfirmed() {
        return isConfirmed;
    }

    @Override
    public void setIsConfirmed(Integer isConfirmed) {
        this.isConfirmed = isConfirmed;
    }

    public static class builder {
        private Long id;
        private UUID parent;
        private UUID child;
        private Role role;
        private Integer isDeleted;
        private Integer isConfirmed;

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

        public builder role(Role role) {
            this.role = role;
            return this;
        }

        public builder isDeleted(Integer isDeleted) {
            this.isDeleted = isDeleted;
            return this;
        }

        public builder isConfirmed(Integer isConfirmed) {
            this.isConfirmed = isConfirmed;
            return this;
        }

        public GroupMemberRel build() {
            return new GroupMemberRel(id,parent,child,role,isDeleted,isConfirmed);
        }
    }
}
