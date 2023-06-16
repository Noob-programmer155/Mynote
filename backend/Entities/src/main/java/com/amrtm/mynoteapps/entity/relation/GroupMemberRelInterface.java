package com.amrtm.mynoteapps.entity.relation;

import com.amrtm.mynoteapps.entity.main.MyNoteRelationEntity;
import com.amrtm.mynoteapps.entity.other.Role;

import java.util.UUID;

public interface GroupMemberRelInterface<ID> extends MyNoteRelationEntity<ID> {
    Role getRole();
    void setRole(Role role);
    Integer getIsDeleted();
    void setIsDeleted(Integer isDeleted);
    Integer getIsConfirmed();
    void setIsConfirmed(Integer isConfirmed);
    public UUID getUserFrom();
    public void setUserFrom(UUID userFrom);
}
