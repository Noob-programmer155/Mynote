package com.amrtm.mynoteapps.backend.repository.user.fetchjoin;

import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import reactor.core.publisher.Mono;

import java.util.UUID;

public interface JoinFetchMemberInterface<E extends MemberDTO> {
    Mono<E> findByName(String name);
}
