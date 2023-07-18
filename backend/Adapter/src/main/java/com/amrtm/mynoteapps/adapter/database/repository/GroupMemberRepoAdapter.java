package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.GroupMemberPersisConv;
import com.amrtm.mynoteapps.entity.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.repository.relation.GroupMemberRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class GroupMemberRepoAdapter implements GroupMemberRepoRelation<GroupMemberRel> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.GroupMemberRepoRelation groupMemberRepoRelation;
    private final GroupMemberPersisConv groupMemberPersisConv = new GroupMemberPersisConv();

    public GroupMemberRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.GroupMemberRepoRelation groupMemberRepoRelation) {
        this.groupMemberRepoRelation = groupMemberRepoRelation;
    }

    @Override
    public Mono<GroupMemberRel> findByParentAndChild(UUID parent, UUID child) {
        return groupMemberRepoRelation.findByParentAndChild(parent, child).map(groupMemberPersisConv::toSecond);
    }

    @Override
    public Mono<GroupMemberRel> findByParentAndChildNonAuthorize(UUID parent, UUID child) {
        return groupMemberRepoRelation.findByParentAndChildNonAuthorize(parent, child).map(groupMemberPersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteByParentAndChildAuth(UUID parent, UUID child) {
        return groupMemberRepoRelation.deleteByParentAndChildAuth(parent, child);
    }

    @Override
    public Mono<Void> deleteByParentAndChild(UUID parent, UUID child) {
        return groupMemberRepoRelation.deleteByParentAndChild(parent, child);
    }

    @Override
    public <S extends GroupMemberRel> Mono<S> save(S entity) {
        return (Mono<S>) groupMemberRepoRelation.save(groupMemberPersisConv.toFirst(entity)).map(groupMemberPersisConv::toSecond);
    }
}
