package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.ThemeMemberPersisConv;
import com.amrtm.mynoteapps.entity.model.relation.ThemeMemberRel;
import com.amrtm.mynoteapps.entity.repository.relation.ThemeMemberRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class ThemeMemberRepoAdapter implements ThemeMemberRepoRelation<ThemeMemberRel> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.ThemeMemberRepoRelation themeMemberRepoRelation;
    private final ThemeMemberPersisConv themeMemberPersisConv = new ThemeMemberPersisConv();
    public ThemeMemberRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.ThemeMemberRepoRelation themeMemberRepoRelation) {
        this.themeMemberRepoRelation = themeMemberRepoRelation;
    }

    @Override
    public Mono<ThemeMemberRel> findByParentAndChild(UUID parent, UUID child) {
        return themeMemberRepoRelation.findByParentAndChild(parent, child).map(themeMemberPersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteByParentAndChild(UUID parent, UUID child) {
        return themeMemberRepoRelation.deleteByParentAndChild(parent, child);
    }

    @Override
    public Mono<ThemeMemberRel> findByActiveState(UUID member) {
        return themeMemberRepoRelation.findByActiveState(member).map(themeMemberPersisConv::toSecond);
    }

    @Override
    public <S extends ThemeMemberRel> Mono<S> save(S entity) {
        return (Mono<S>) themeMemberRepoRelation.save(themeMemberPersisConv.toFirst(entity)).map(themeMemberPersisConv::toSecond);
    }
}
