package com.amrtm.mynoteapps.entity.repository.subtype;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.other.bind.SubtypeColorBinding;
import com.amrtm.mynoteapps.entity.repository.MyNoteRepo;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SubtypeRepo<E extends MyNoteEntity,ID,PagingAndSorting> extends MyNoteRepo<E, ID> {
    Mono<E> findByName(String name);
    Flux<E> findByNameLike(String name, PagingAndSorting pageable);
    Flux<SubtypeColorBinding> findByGroup(ID group);
    Mono<Void> deleteAllById(Iterable<? extends ID> uuids);
}
