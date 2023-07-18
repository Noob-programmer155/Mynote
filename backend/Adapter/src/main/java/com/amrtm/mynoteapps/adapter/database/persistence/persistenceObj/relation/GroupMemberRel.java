package com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation;

import com.amrtm.mynoteapps.entity.other.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("group_member")
public class GroupMemberRel {
    @Id
    @Column("id")
    Long id;
    @Column("group_note")
    UUID parent;
    @Column("member")
    UUID child;
    @Column("role")
    Role role;
    @Column("isDeleted")
    Integer isDeleted;
    @Column("isConfirmed")
    Integer isConfirmed;
    @Column("userFrom")
    UUID userFrom;

    public GroupMemberRel() {
    }

    public GroupMemberRel(Long id, UUID parent, UUID child, Role role, Integer isDeleted, Integer isConfirmed, UUID userFrom) {
        this.id = id;
        this.parent = parent;
        this.child = child;
        this.role = role;
        this.isDeleted = isDeleted;
        this.isConfirmed = isConfirmed;
        this.userFrom = userFrom;
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Integer isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Integer getIsConfirmed() {
        return isConfirmed;
    }

    public void setIsConfirmed(Integer isConfirmed) {
        this.isConfirmed = isConfirmed;
    }

    public UUID getUserFrom() {
        return userFrom;
    }

    public void setUserFrom(UUID userFrom) {
        this.userFrom = userFrom;
    }
}
