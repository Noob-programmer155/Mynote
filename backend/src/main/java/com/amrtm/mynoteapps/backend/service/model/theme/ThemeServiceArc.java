package com.amrtm.mynoteapps.backend.service.model.theme;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import org.springframework.data.domain.Pageable;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ThemeServiceArc<DTO extends MyNoteEntity,ID> {
    Mono<byte[]> getAvatar(String name);
    Flux<UUIDIdAndName> findByNameLikeMember(String name, Pageable pageable);
    Flux<DTO> findByNameLikeSearchMember(String name, Pageable pageable);
    Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable);
    Flux<DTO> findByNameLikeSearch(String name, Pageable pageable);
    Mono<Boolean> validateName(String name);
    Mono<DTO> save(DTO data, FilePart filePart, boolean isUpdate);
    Mono<Boolean> addNewTheme(ID theme);
    Mono<Void> removeTheme(ID theme);
    Mono<Void> deleteById(ID id);
}
