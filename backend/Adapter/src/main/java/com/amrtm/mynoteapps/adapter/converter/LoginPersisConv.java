package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.login.Login;

public class LoginPersisConv implements PersistenceConverter<Login, com.amrtm.mynoteapps.entity.model.login.Login>{
    @Override
    public Login toFirst(com.amrtm.mynoteapps.entity.model.login.Login from) {
        return new Login(from.getMember(), from.getToken());
    }

    @Override
    public com.amrtm.mynoteapps.entity.model.login.Login toSecond(Login from) {
        return new com.amrtm.mynoteapps.entity.model.login.Login(from.getMember(),from.getToken());
    }
}
