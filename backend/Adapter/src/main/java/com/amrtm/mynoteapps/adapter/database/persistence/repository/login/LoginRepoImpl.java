package com.amrtm.mynoteapps.adapter.database.persistence.repository.login;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.login.Login;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface LoginRepoImpl extends ReactiveCrudRepository<Login, UUID>{
    @Query("SELECT l.* FROM login AS l INNER JOIN member AS m ON l.member = m.id WHERE m.name = :username")
    Mono<Login> findByName(String username);
    @Modifying
    @Query("INSERT INTO login VALUES(:#{#entity.member},:#{#entity.token})")
    Mono<Void> save(Login entity);
    @Modifying
    @Query("UPDATE login SET token = :#{#entity.token} WHERE member = :#{#entity.member}")
    Mono<Void> update(Login entity);
    @Override
    Mono<Void> deleteById(UUID uuid);
}
