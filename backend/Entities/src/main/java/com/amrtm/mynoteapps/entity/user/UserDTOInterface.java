package com.amrtm.mynoteapps.entity.user;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;

public interface UserDTOInterface extends MyNoteEntity {
    String getUsername();
    void setUsername(String username);
    String getAvatar();
    void setAvatar(String avatar);
}
