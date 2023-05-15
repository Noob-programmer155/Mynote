package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.ThemePersisConv;
import com.amrtm.mynoteapps.entity.repository.theme.ThemeRepoImpl;
import com.amrtm.mynoteapps.entity.theme.impl.Theme;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class ThemeRepoAdapter implements ThemeRepoImpl<Theme, Pageable> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.theme.ThemeRepoImpl themeRepo;
    private final ThemePersisConv themePersisConv = new ThemePersisConv();
    public ThemeRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.theme.ThemeRepoImpl themeRepo) {
        this.themeRepo = themeRepo;
    }

    @Override
    public Mono<Theme> findById(UUID uuid) {
        return themeRepo.findById(uuid).map(themePersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return themeRepo.deleteById(uuid);
    }

    @Override
    public Mono<Theme> findByName(String name) {
        return themeRepo.findByName(name).map(themePersisConv::toSecond);
    }

    @Override
    public Mono<Theme> findByIdMemberActive(UUID member) {
        return themeRepo.findByIdMemberActive(member).map(themePersisConv::toSecond);
    }

    @Override
    public Flux<Theme> findByNameLikeAndMember(String name, UUID member, Pageable pageable) {
        return themeRepo.findByNameLikeAndMember(name, member, pageable).map(themePersisConv::toSecond);
    }

    @Override
    public Flux<Theme> findByNameLike(String name, Pageable pageable) {
        return themeRepo.findByNameLike(name, pageable).map(themePersisConv::toSecond);
    }

    @Override
    public <S extends Theme> Mono<S> save(S entity) {
        return (Mono<S>) themeRepo.save(themePersisConv.toFirst(entity)).map(themePersisConv::toSecond);
    }
}
