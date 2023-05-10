package com.amrtm.mynoteapps.usecase.theme;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface ThemeServiceArc<DTO extends MyNoteEntity,ID> {
    Mono<byte[]> getAvatar(String name);
    Flux<UUIDIdAndName> findByNameLikeMember(String name, Pageable pageable);
    Flux<DTO> findByNameLikeSearchMember(String name, Pageable pageable);
    Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable);
    Flux<DTO> findByNameLikeSearch(String name, Pageable pageable);
    Mono<Boolean> validateName(String name);
    Mono<Boolean> activateTheme(UUID theme);
    Mono<DTO> save(DTO data, byte[] filePart, String filename, boolean isUpdate);
    Mono<Boolean> addNewTheme(ID theme);
    Mono<Void> removeTheme(ID theme);
    Mono<Void> deleteById(ID id);
}
