package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.LoginPersisConv;
import com.amrtm.mynoteapps.entity.login.Login;
import com.amrtm.mynoteapps.entity.repository.login.LoginRepoImpl;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class LoginRepoAdapter implements LoginRepoImpl<Login> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.login.LoginRepoImpl loginRepo;
    private final LoginPersisConv loginPersisConv = new LoginPersisConv();
    public LoginRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.login.LoginRepoImpl loginRepo) {
        this.loginRepo = loginRepo;
    }

    @Override
    public Mono<Login> findByName(String username) {
        return loginRepo.findByName(username).map(loginPersisConv::toSecond);
    }

    @Override
    public Mono<Void> save(Login entity) {
        return loginRepo.save(loginPersisConv.toFirst(entity));
    }

    @Override
    public Mono<Void> update(Login entity) {
        return loginRepo.update(loginPersisConv.toFirst(entity));
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return loginRepo.deleteById(uuid);
    }
}
