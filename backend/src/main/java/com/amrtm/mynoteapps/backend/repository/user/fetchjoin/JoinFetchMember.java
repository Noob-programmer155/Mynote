package com.amrtm.mynoteapps.backend.repository.user.fetchjoin;

import com.amrtm.mynoteapps.backend.model.theme.impl.Theme;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNote;
import com.amrtm.mynoteapps.backend.repository.bindfunction.EntityBindFunctionImpl;
import com.amrtm.mynoteapps.backend.repository.theme.ThemeRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.MemberRepoImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class JoinFetchMember implements JoinFetchMemberInterface<MemberDTO>{
    private final MemberRepoImpl memberRepo;
    private final ThemeRepoImpl themeRepo;
    private final EntityBindFunctionImpl entityBindFunction;

    public Mono<MemberDTO> findByName(String name) {
        return memberRepo.findByName(name).flatMap(item -> themeRepo.findByIdMemberActive(item.getId())
                        .switchIfEmpty(Mono.just(Theme.builder().build()))
                        .map(theme -> Tuples.of(item,theme))).map(entityBindFunction::MEMBER_DTO_BINDING);
    }
}
