package com.amrtm.mynoteapps.entity.relation;

import com.amrtm.mynoteapps.entity.main.MyNoteRelationEntity;
import com.amrtm.mynoteapps.entity.other.Role;

public interface GroupMemberRelInterface<ID> extends MyNoteRelationEntity<ID> {
    Role getRole();
    void setRole(Role role);
    Integer getIsDeleted();
    void setIsDeleted(Integer isDeleted);
    Integer getIsConfirmed();
    void setIsConfirmed(Integer isConfirmed);
}
