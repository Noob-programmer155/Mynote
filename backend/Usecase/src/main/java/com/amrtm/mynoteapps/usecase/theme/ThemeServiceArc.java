package com.amrtm.mynoteapps.usecase.theme;

import com.amrtm.mynoteapps.entity.main.MyNoteEntity;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Function;

public interface ThemeServiceArc<DTO extends MyNoteEntity,ID,PagingAndSorting> {
    Mono<byte[]> getAvatar(String name);
    Flux<UUIDIdAndName> findByNameLikeMember(String name, PagingAndSorting pageable);
    Flux<DTO> findByNameLikeSearchMember(String name, PagingAndSorting pageable);
    Flux<UUIDIdAndName> findByNameLike(String name, PagingAndSorting pageable);
    Flux<DTO> findByNameLikeSearch(String name, PagingAndSorting pageable);
    Mono<Boolean> validateName(String name);
    Mono<Boolean> activateTheme(UUID theme);
    Mono<DTO> save(DTO data, byte[] filePart, String filename, boolean isUpdate, boolean condition, Function<Path,Mono<Void>> elseCondition);
    Mono<Boolean> addNewTheme(ID theme);
    Mono<Void> removeTheme(ID theme);
    Mono<Void> deleteById(ID id);
}
