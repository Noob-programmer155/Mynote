package com.amrtm.mynoteapps.backend.repository.user;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import com.amrtm.mynoteapps.backend.model.other.Name;
import com.amrtm.mynoteapps.backend.model.other.Password;
import com.amrtm.mynoteapps.backend.repository.MyNoteRepo;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserRepo<E extends MyNoteEntity,ID> extends MyNoteRepo<E, ID> {
    Mono<Name> validateName(String username);
    Flux<E> findByNameLike(String name, Pageable pageable);
}
