package com.amrtm.mynoteapps.adapter.database.repository.subtype;

import com.amrtm.mynoteapps.adapter.database.repository.MyNoteRepo;
import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.other.bind.SubtypeColorBinding;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SubtypeRepo<E extends MyNoteEntity,ID> extends MyNoteRepo<E, ID> {
    Mono<E> findByName(String name);
    Flux<E> findByNameLike(String name,Pageable pageable);
    Flux<SubtypeColorBinding> findByGroup(ID group);
    Mono<Void> deleteAllById(Iterable<? extends ID> uuids);
}
