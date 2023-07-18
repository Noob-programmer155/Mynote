package com.amrtm.mynoteapps.entity.model.user;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;

public interface UserEntity extends MyNoteEntity {
    String getUsername();
    void setUsername(String username);
    String getAvatar();
    void setAvatar(String avatar);
}
