package com.amrtm.mynoteapps.entity.main;

import com.amrtm.mynoteapps.entity.GlobalEntity;

public interface MyNoteRelationEntity<ID> extends GlobalEntity {
    Long getId();
    void setId(Long id);
    ID getParent();
    void setParent(ID parent);
    ID getChild();
    void setChild(ID child);
}
