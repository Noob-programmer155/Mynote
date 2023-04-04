package com.amrtm.mynoteapps.backend.model.other;

import com.amrtm.mynoteapps.backend.model.GlobalEntity;

import java.util.UUID;

public interface LoginInterface extends GlobalEntity {
    UUID getMember();
    void setMember(UUID member);
    String getToken();
    void setToken(String token);
}
