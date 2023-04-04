package com.amrtm.mynoteapps.backend.service.model.user;

import com.amrtm.mynoteapps.backend.model.main.MyNoteEntity;
import com.amrtm.mynoteapps.backend.model.user.UserDTOInterface;
import com.amrtm.mynoteapps.backend.model.user.UserEntity;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import org.springframework.data.domain.Pageable;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface UserServiceArc<DTO extends UserDTOInterface,ID> {
    Mono<byte[]> getAvatar(String name);
//    Mono<DTO> findById();
    Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable);
    Flux<DTO> findByNameLikeData(String name, Pageable pageable);
    Mono<Boolean> validateName(String name);
    Mono<DTO> save(DTO data, FilePart avatar, boolean update);
    Mono<Void> deleteById(ID id);
}
