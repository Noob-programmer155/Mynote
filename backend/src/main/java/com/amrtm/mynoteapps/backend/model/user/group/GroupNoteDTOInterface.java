package com.amrtm.mynoteapps.backend.model.user.group;

import com.amrtm.mynoteapps.backend.model.user.UserDTOInterface;

public interface GroupNoteDTOInterface extends UserDTOInterface {
    Boolean getIsMember();
    void setIsMember(Boolean isMember);
}
