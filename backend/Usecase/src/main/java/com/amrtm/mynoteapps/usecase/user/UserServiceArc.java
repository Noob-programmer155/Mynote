package com.amrtm.mynoteapps.usecase.user;

import com.amrtm.mynoteapps.entity.user.UserDTOInterface;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface UserServiceArc<DTO extends UserDTOInterface,ID> {
    Mono<byte[]> getAvatar(String name);
//    Mono<DTO> findById();
    Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable);
    Flux<DTO> findByNameLikeData(String name, Pageable pageable);
    Mono<Boolean> validateName(String name);
    Mono<DTO> save(DTO data, byte[] avatar, String filename, boolean update);
    Mono<Void> deleteById(ID id);
}
