package com.amrtm.mynoteapps.entity.user.group;

import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.user.UserDTOInterface;

import java.util.UUID;

public interface GroupNoteDTOInterface extends UserDTOInterface {
    Boolean getIsMember();
    void setIsMember(Boolean isMember);
    Role getRoleMember();
    void setRoleMember(Role roleMember);
    boolean isNotificationFrom();
    void setNotificationFrom(boolean notificationFrom);
}
