package com.amrtm.mynoteapps.backend.model.relation;

import com.amrtm.mynoteapps.backend.model.main.MyNoteRelationEntity;

public interface ThemeMemberRelInterface<ID> extends MyNoteRelationEntity<ID> {
    Integer getIsActive();
    void setIsActive(Integer isActive);
}
