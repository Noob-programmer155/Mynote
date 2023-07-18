package com.amrtm.mynoteapps.entity.model.relation;

import com.amrtm.mynoteapps.entity.main.MyNoteRelationEntity;

public interface ThemeMemberRelInterface<ID> extends MyNoteRelationEntity<ID> {
    Integer getIsActive();
    void setIsActive(Integer isActive);
}
