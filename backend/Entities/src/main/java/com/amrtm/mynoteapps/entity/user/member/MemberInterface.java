package com.amrtm.mynoteapps.entity.user.member;

import com.amrtm.mynoteapps.entity.user.UserEntity;

public interface MemberInterface extends UserEntity {
    String getPassword();
    void setPassword(String password);
}
