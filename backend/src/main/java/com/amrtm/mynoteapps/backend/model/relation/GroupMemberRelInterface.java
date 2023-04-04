package com.amrtm.mynoteapps.backend.model.relation;

import com.amrtm.mynoteapps.backend.model.main.MyNoteRelationEntity;
import com.amrtm.mynoteapps.backend.model.other.Role;

public interface GroupMemberRelInterface<ID> extends MyNoteRelationEntity<ID> {
    Role getRole();
    void setRole(Role role);
    Integer getIsDeleted();
    void setIsDeleted(Integer isDeleted);
    Integer getIsConfirmed();
    void setIsConfirmed(Integer isConfirmed);
}
