package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.GroupSubtypePersisConv;
import com.amrtm.mynoteapps.entity.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.entity.repository.relation.GroupSubtypeRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class GroupSubtypeRepoAdapter implements GroupSubtypeRepoRelation<GroupSubtypeRel> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.GroupSubtypeRepoRelation groupSubtypeRepoRelation;
    private final GroupSubtypePersisConv groupSubtypePersisConv = new GroupSubtypePersisConv();
    public GroupSubtypeRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.GroupSubtypeRepoRelation groupSubtypeRepoRelation) {
        this.groupSubtypeRepoRelation = groupSubtypeRepoRelation;
    }

    @Override
    public Mono<Void> updateIndex(Integer index, UUID parent, UUID child) {
        return groupSubtypeRepoRelation.updateIndex(index, parent, child);
    }

    @Override
    public Mono<Void> deleteByParentAndChild(UUID parent, UUID child) {
        return groupSubtypeRepoRelation.deleteByParentAndChild(parent, child);
    }

    @Override
    public <S extends GroupSubtypeRel> Mono<S> save(S entity) {
        return (Mono<S>) groupSubtypeRepoRelation.save(groupSubtypePersisConv.toFirst(entity)).map(groupSubtypePersisConv::toSecond);
    }
}
