package com.amrtm.mynoteapps.backend.model.user;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;

public interface UserDTOInterface extends MyNoteEntity {
    String getUsername();
    void setUsername(String username);
    String getPassword();
    void setPassword(String password);
    String getAvatar();
    void setAvatar(String avatar);
}
