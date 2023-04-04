package com.amrtm.mynoteapps.backend.model.user.member;

import com.amrtm.mynoteapps.backend.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.backend.model.user.UserDTOInterface;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;

import java.util.List;

public interface MemberDTOInterface extends UserDTOInterface {
    ThemeDTO getTheme();
    void setTheme(ThemeDTO theme);
}
