package com.amrtm.mynoteapps.entity.user.group;

import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.user.UserDTOInterface;

public interface GroupNoteDTOInterface extends UserDTOInterface {
    Boolean getIsMember();
    void setIsMember(Boolean isMember);
    Role getRoleMember();
    void setRoleMember(Role roleMember);
}
