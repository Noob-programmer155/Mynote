package com.amrtm.mynoteapps.backend.service.other;

import lombok.*;

public interface IdAndName<ID> {
    ID getId();
    void setId(ID id);
    String getName();
    void setName(String name);
}
