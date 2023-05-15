package com.amrtm.mynoteapps.entity.repository.user;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.entity.repository.MyNoteRepo;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepo<E extends MyNoteEntity,ID, PagingAndSorting> extends MyNoteRepo<E, ID> {
    Mono<Name> validateName(String username);
    Flux<E> findByNameLike(String name, PagingAndSorting pageable);
}
