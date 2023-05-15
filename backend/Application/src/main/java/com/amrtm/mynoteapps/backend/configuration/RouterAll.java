package com.amrtm.mynoteapps.backend.configuration;

import com.amrtm.mynoteapps.adapter.database.persistence.PagingAndSortingImpl;
import com.amrtm.mynoteapps.adapter.router.*;
import com.amrtm.mynoteapps.adapter.storage.GroupStorageImpl;
import com.amrtm.mynoteapps.adapter.storage.MemberStorageImpl;
import com.amrtm.mynoteapps.adapter.storage.ThemeStorageImpl;
import com.amrtm.mynoteapps.backend.configuration.security.token.jwt.JwtProvider;
import com.amrtm.mynoteapps.usecase.note.NoteService;
import com.amrtm.mynoteapps.usecase.subtype.SubtypeService;
import com.amrtm.mynoteapps.usecase.theme.ThemeService;
import com.amrtm.mynoteapps.usecase.user.GroupService;
import com.amrtm.mynoteapps.usecase.user.MemberService;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
public class RouterAll {
    private final JwtProvider jwtProvider;
    private final GroupService<GroupStorageImpl, Pageable> groupService;
    private final MemberService<MemberStorageImpl, Pageable> memberService;
    private final ThemeService<ThemeStorageImpl, Pageable> themeService;
    private final SubtypeService<Pageable> subtypeService;
    private final NoteService<Pageable> noteService;

    public RouterAll(JwtProvider jwtProvider, GroupService<GroupStorageImpl, Pageable> groupService, MemberService<MemberStorageImpl, Pageable> memberService, ThemeService<ThemeStorageImpl, Pageable> themeService, SubtypeService<Pageable> subtypeService, NoteService<Pageable> noteService) {
        this.jwtProvider = jwtProvider;
        this.groupService = groupService;
        this.memberService = memberService;
        this.themeService = themeService;
        this.subtypeService = subtypeService;
        this.noteService = noteService;
    }

    @Bean("groupRouterSrc")
    public GroupRouter<Pageable> groupRouter() {
        return new GroupRouter<>(groupService,new PagingAndSortingImpl());
    }

    @Bean("memberRouterSrc")
    public MemberRouter<Pageable> memberRouter() {
        return new MemberRouter<>(memberService,jwtProvider,new PagingAndSortingImpl());
    }

    @Bean("themeRouterSrc")
    public ThemeRouter<Pageable> themeRouter() {
        return new ThemeRouter<>(themeService,new PagingAndSortingImpl());
    }

    @Bean("subtypeRouterSrc")
    public SubtypeRouter<Pageable> subtypeRouter() {
        return new SubtypeRouter<>(subtypeService,new PagingAndSortingImpl());
    }

    @Bean("noteRouterSrc")
    public NoteRouter<Pageable> noteRouter() {
        return new NoteRouter<>(noteService,new PagingAndSortingImpl());
    }
}
