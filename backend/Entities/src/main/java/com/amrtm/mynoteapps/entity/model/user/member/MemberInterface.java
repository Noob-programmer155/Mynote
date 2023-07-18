package com.amrtm.mynoteapps.entity.model.user.member;

import com.amrtm.mynoteapps.entity.model.user.UserEntity;

public interface MemberInterface extends UserEntity {
    String getPassword();
    void setPassword(String password);
}
