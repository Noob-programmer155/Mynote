package com.amrtm.mynoteapps.entity.model.login;

import com.amrtm.mynoteapps.entity.GlobalEntity;

import java.util.UUID;

public interface LoginInterface extends GlobalEntity {
    UUID getMember();
    void setMember(UUID member);
    String getToken();
    void setToken(String token);
}
