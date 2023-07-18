package com.amrtm.mynoteapps.usecase.user;

import com.amrtm.mynoteapps.entity.model.user.UserDTOInterface;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.function.Function;

public interface UserServiceArc<DTO extends UserDTOInterface,ID,PagingAndSorting> {
    Mono<byte[]> getAvatar(String name);
//    Mono<DTO> findById();
    Flux<UUIDIdAndName> findByNameLike(String name, PagingAndSorting pageable);
    Flux<DTO> findByNameLikeData(String name, PagingAndSorting pageable);
    Mono<Boolean> validateName(String name);
    Mono<DTO> save(DTO data, byte[] avatar, String filename, boolean update, boolean condition, Function<Path,Mono<Void>> elseCondition);
    Mono<Void> deleteById(ID id);
}
