package com.amrtm.mynoteapps.entity.user.member;

import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.entity.user.UserDTOInterface;

public interface MemberDTOInterface extends UserDTOInterface {
    String getPassword();
    void setPassword(String password);
    ThemeDTO getTheme();
    void setTheme(ThemeDTO theme);
    Role getRole();
    void setRole(Role role);
}
