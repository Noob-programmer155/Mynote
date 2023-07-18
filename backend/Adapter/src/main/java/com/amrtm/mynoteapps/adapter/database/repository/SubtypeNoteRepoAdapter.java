package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.SubtypeNotePersisConv;
import com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel;
import com.amrtm.mynoteapps.entity.repository.relation.SubtypeNoteRepoRelation;
import reactor.core.publisher.Mono;

import java.util.UUID;

public class SubtypeNoteRepoAdapter implements SubtypeNoteRepoRelation<SubtypeNoteRel> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.SubtypeNoteRepoRelation subtypeNoteRepoRelation;
    private final SubtypeNotePersisConv subtypeNotePersisConv = new SubtypeNotePersisConv();

    public SubtypeNoteRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.relation.SubtypeNoteRepoRelation subtypeNoteRepoRelation) {
        this.subtypeNoteRepoRelation = subtypeNoteRepoRelation;
    }

    @Override
    public Mono<Void> deleteByParentAndChild(Long parent, UUID child) {
        return subtypeNoteRepoRelation.deleteByParentAndChild(parent, child);
    }

    @Override
    public <S extends SubtypeNoteRel> Mono<S> save(S entity) {
        return (Mono<S>) subtypeNoteRepoRelation.save(subtypeNotePersisConv.toFirst(entity)).map(subtypeNotePersisConv::toSecond);
    }
}
