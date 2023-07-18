package com.amrtm.mynoteapps.entity.model.user.member;

import com.amrtm.mynoteapps.entity.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.model.user.UserDTOInterface;

public interface MemberDTOInterface extends UserDTOInterface {
    String getPassword();
    void setPassword(String password);
    ThemeDTO getTheme();
    void setTheme(ThemeDTO theme);
    Role getRole();
    void setRole(Role role);
    boolean isNotificationFrom();
    void setNotificationFrom(boolean notificationFrom);
}
