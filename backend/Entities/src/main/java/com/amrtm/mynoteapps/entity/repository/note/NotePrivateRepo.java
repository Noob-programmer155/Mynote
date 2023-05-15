package com.amrtm.mynoteapps.entity.repository.note;

import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.other.obj.Category;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

public interface NotePrivateRepo<E extends NotePrivate,PagingAndSorting> extends NoteRepo<E, UUID> {
    Flux<E> findByTitleLike(String name, UUID member, PagingAndSorting pageable);
    Flux<Category> findCategoryByMember(UUID member);
    Flux<Severity> findSeverityByMember(UUID member);
    Flux<E> findByFilter(List<String> category, List<String> severity, UUID member, PagingAndSorting pageable);
    @Override
    <S extends E> Mono<S> save(S entity);
    Mono<Void> deleteByCategory(String category, UUID member);
}
