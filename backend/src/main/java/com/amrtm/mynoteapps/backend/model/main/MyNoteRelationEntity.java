package com.amrtm.mynoteapps.backend.model.main;

import com.amrtm.mynoteapps.backend.model.GlobalEntity;

public interface MyNoteRelationEntity<ID> extends GlobalEntity {
    Long getId();
    void setId(Long id);
    ID getParent();
    void setParent(ID parent);
    ID getChild();
    void setChild(ID child);
}
