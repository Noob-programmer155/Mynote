package com.amrtm.mynoteapps.usecase.subtype;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SubtypeServiceArc<DTO extends MyNoteEntity,ID,PagingAndSorting> {
    Flux<DTO> findByGroup(ID id);
    Flux<DTO> findByName(String name, PagingAndSorting pageable);
    Mono<Boolean> updateIndex(Integer indexFrom, Integer indexTo, ID subtypeFrom, ID subtypeTo, ID group);
    Mono<DTO> updateSubtype(Integer index,ID oldSubtype,DTO newSubtype, ID group);
    Mono<DTO> save(Integer index, DTO data, ID group);
    Mono<Void> removeSubtype(ID subtype, ID group);
    Mono<Void> deleteById(ID id, ID group);
}
