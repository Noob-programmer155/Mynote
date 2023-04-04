package com.amrtm.mynoteapps.backend.service.model.subtype;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface SubtypeServiceArc<DTO extends MyNoteEntity,ID> {
    Flux<DTO> findByNameGroup(String name, ID id, Pageable pageable);
    Flux<DTO> findByName(String name, Pageable pageable);
    Mono<Boolean> addSubtype(ID subtype, ID group);
    Mono<DTO> save(DTO data, ID group, boolean isUpdate);
    Mono<Void> removeSubtype(ID subtype, ID group);
    Mono<Void> deleteById(ID id, ID group);
}
