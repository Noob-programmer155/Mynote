package com.amrtm.mynoteapps.entity.model.relation;

import com.amrtm.mynoteapps.entity.main.MyNoteRelationEntity;
public interface GroupSubtypeRelInterface<ID> extends MyNoteRelationEntity<ID> {
    Integer getIndex();
    void setIndex(Integer index);
    String getColor();
    void setColor(String color);
}
