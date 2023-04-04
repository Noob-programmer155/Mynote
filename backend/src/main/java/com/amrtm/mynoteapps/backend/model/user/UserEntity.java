package com.amrtm.mynoteapps.backend.model.user;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserEntity extends MyNoteEntity {
    String getUsername();
    void setUsername(String username);
    String getPassword();
    void setPassword(String password);
    String getAvatar();
    void setAvatar(String avatar);
}
