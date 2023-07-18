package com.amrtm.mynoteapps.usecase.user;

import com.amrtm.mynoteapps.entity.other.utils.Tuple2;
import com.amrtm.mynoteapps.entity.repository.bindfunction.EntityBindFunctionImpl;
import com.amrtm.mynoteapps.entity.repository.theme.ThemeRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.fetchjoin.JoinFetchMemberInterface;
import com.amrtm.mynoteapps.entity.model.theme.impl.Theme;
import com.amrtm.mynoteapps.entity.model.user.member.impl.Member;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuples;

import java.time.LocalDateTime;
import java.util.UUID;


public class JoinFetchMember<PagingAndSorting> implements JoinFetchMemberInterface<MemberDTO> {
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final ThemeRepoImpl<Theme,PagingAndSorting> themeRepo;
    private final EntityBindFunctionImpl entityBindFunction;
    private final String uuid;

    public JoinFetchMember(MemberRepoImpl<Member,PagingAndSorting> memberRepo, ThemeRepoImpl<Theme,PagingAndSorting> themeRepo, EntityBindFunctionImpl entityBindFunction, String uuid) {
        this.memberRepo = memberRepo;
        this.themeRepo = themeRepo;
        this.entityBindFunction = entityBindFunction;
        this.uuid = uuid;
    }

    public Mono<MemberDTO> findByName(String name) {
        return memberRepo.findByName(name).flatMap(item -> themeRepo.findByIdMemberActive(item.getId())
                        .switchIfEmpty(Mono.just(new Theme.builder()
                                .id(UUID.fromString(uuid))
                                .name("defaults")
                                .foreground_color("#363535ff")
                                .background_color("#ffffffff")
                                .border_color("#fcd403ff")
                                .default_background("#059df0ff")
                                .default_foreground("#f0f0f0ff")
                                .info_background("#1dc257ff")
                                .info_foreground("#f0f0f0ff")
                                .danger_background("#ff1900ff")
                                .danger_foreground("#f0f0f0ff")
                                .background("#fa9405ff")
                                .foreground("#f0f0f0ff")
                                .createdBy("My Note::"+uuid)
                                .createdDate(LocalDateTime.now()).build()))
                        .map(theme -> Tuples.of(item,theme))).map(item -> entityBindFunction.MEMBER_DTO_BINDING(new Tuple2<>(item.getT1(),item.getT2())));
    }
}
