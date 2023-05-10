package com.amrtm.mynoteapps.entity.repository.user.fetchjoin;

import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;
import reactor.core.publisher.Mono;

public interface JoinFetchMemberInterface<E extends MemberDTO> {
    Mono<E> findByName(String name);
}
