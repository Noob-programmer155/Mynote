package com.amrtm.mynoteapps.adapter.database.repository.other;

import com.amrtm.mynoteapps.entity.login.Login;
import org.springframework.data.r2dbc.repository.Modifying;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface LoginRepoImpl extends LoginRepo<Login,UUID>,ReactiveCrudRepository<Login, UUID>{
    @Query("SELECT l.* FROM login AS l INNER JOIN member AS m ON l.member = m.id WHERE m.name = :username")
    Mono<Login> findByName(String username);
    @Modifying
    @Query("INSERT INTO login VALUES(:#{#entity.member},:#{#entity.token})")
    @Override
    <S extends Login> Mono<S> save(S entity);
    @Modifying
    @Query("UPDATE login SET token = :#{#entity.token} WHERE member = :#{#entity.member}")
    <S extends Login> Mono<S> update(S entity);
    @Override
    Mono<Void> deleteById(UUID uuid);
}
