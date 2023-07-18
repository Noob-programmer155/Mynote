package com.amrtm.mynoteapps.entity.model.relation;

import com.amrtm.mynoteapps.entity.main.MyNoteRelationEntity;

public interface SubtypeNoteRelInterface<ID> {
    Long getId();
    void setId(Long id);
    Long getParent();
    void setParent(Long parent);
    ID getChild();
    void setChild(ID child);
}
