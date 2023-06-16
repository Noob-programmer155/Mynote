package com.amrtm.mynoteapps.backend.configuration;

import com.amrtm.mynoteapps.adapter.database.repository.*;
import com.amrtm.mynoteapps.adapter.storage.GroupStorageImpl;
import com.amrtm.mynoteapps.adapter.storage.MemberStorageImpl;
import com.amrtm.mynoteapps.adapter.storage.ThemeStorageImpl;
import com.amrtm.mynoteapps.backend.configuration.security.impl.AuthValidationClass;
import com.amrtm.mynoteapps.backend.configuration.security.impl.PasswordEncoderClass;
import com.amrtm.mynoteapps.backend.configuration.security.token.jwt.JwtProvider;
import com.amrtm.mynoteapps.entity.repository.bindfunction.EntityBindFunctionImpl;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.*;
import com.amrtm.mynoteapps.usecase.note.JoinFetchNote;
import com.amrtm.mynoteapps.usecase.note.NoteService;
import com.amrtm.mynoteapps.usecase.subtype.SubtypeService;
import com.amrtm.mynoteapps.usecase.theme.ThemeService;
import com.amrtm.mynoteapps.usecase.user.GroupService;
import com.amrtm.mynoteapps.usecase.user.JoinFetchMember;
import com.amrtm.mynoteapps.usecase.user.MemberService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;

@Component
public class ServiceAll {
    private final JwtProvider jwtProvider;
    private final PasswordEncoderClass passwordEncoderClass;
    private final AuthValidationClass authValidationClass;
    private final LoginRepoAdapter loginRepoAdapter;
    private final NoteCollabRepoAdapter noteCollabRepoAdapter;
    private final NotePrivateRepoAdapter notePrivateRepoAdapter;
    private final GroupMemberRepoAdapter groupMemberRepoAdapter;
    private final GroupSubtypeRepoAdapter groupSubtypeRepoAdapter;
    private final ThemeMemberRepoAdapter themeMemberRepoAdapter;
    private final GroupRepoAdapter groupRepoAdapter;
    private final MemberRepoAdapter memberRepoAdapter;
    private final SubtypeRepoAdapter subtypeRepoAdapter;
    private final ThemeRepoAdapter themeRepoAdapter;

    public ServiceAll(JwtProvider jwtProvider, PasswordEncoderClass passwordEncoderClass, AuthValidationClass authValidationClass, LoginRepoAdapter loginRepoAdapter, NoteCollabRepoAdapter noteCollabRepoAdapter, NotePrivateRepoAdapter notePrivateRepoAdapter, GroupMemberRepoAdapter groupMemberRepoAdapter, GroupSubtypeRepoAdapter groupSubtypeRepoAdapter, ThemeMemberRepoAdapter themeMemberRepoAdapter, GroupRepoAdapter groupRepoAdapter, MemberRepoAdapter memberRepoAdapter, SubtypeRepoAdapter subtypeRepoAdapter, ThemeRepoAdapter themeRepoAdapter) {
        this.jwtProvider = jwtProvider;
        this.passwordEncoderClass = passwordEncoderClass;
        this.authValidationClass = authValidationClass;
        this.loginRepoAdapter = loginRepoAdapter;
        this.noteCollabRepoAdapter = noteCollabRepoAdapter;
        this.notePrivateRepoAdapter = notePrivateRepoAdapter;
        this.groupMemberRepoAdapter = groupMemberRepoAdapter;
        this.groupSubtypeRepoAdapter = groupSubtypeRepoAdapter;
        this.themeMemberRepoAdapter = themeMemberRepoAdapter;
        this.groupRepoAdapter = groupRepoAdapter;
        this.memberRepoAdapter = memberRepoAdapter;
        this.subtypeRepoAdapter = subtypeRepoAdapter;
        this.themeRepoAdapter = themeRepoAdapter;
    }

    @Value("${application.array.delimiter}")
    private String delimiter;

    @Value("${uuid.init}")
    private String uuid;

    @Bean
    public GroupService<GroupStorageImpl, Pageable> groupService() {
        return new GroupService<>(
                groupRepoAdapter,
                new GroupConverter(),
                new MemberConverter(passwordEncoderClass),
                groupMemberRepoAdapter,
                new GroupStorageImpl(Paths.get("/home/amar/worked/MyNote/res/images/group/")),
                authValidationClass,
                memberRepoAdapter,
                noteCollabRepoAdapter
        );
    }

    @Bean
    public MemberService<MemberStorageImpl, Pageable> memberService() {
        return new MemberService<>(
                memberRepoAdapter,
                groupRepoAdapter,
                new MemberConverter(passwordEncoderClass),
                new GroupConverter(),
                loginRepoAdapter,
                authValidationClass,
                new JoinFetchMember<>(memberRepoAdapter,themeRepoAdapter,new EntityBindFunctionImpl(delimiter),uuid),
                groupMemberRepoAdapter,
                new MemberStorageImpl(Paths.get("/home/amar/worked/MyNote/res/images/member/")),
                jwtProvider
        );
    }

    @Bean
    public ThemeService<ThemeStorageImpl, Pageable> themeService() {
        return new ThemeService<>(
                delimiter,
                themeRepoAdapter,
                new ThemeConverter(delimiter),
                authValidationClass,
                themeMemberRepoAdapter,
                memberRepoAdapter,
                new ThemeStorageImpl(Paths.get("/home/amar/worked/MyNote/res/images/theme/"))
        );
    }

    @Bean
    public SubtypeService<Pageable> subtypeService() {
        return new SubtypeService<>(
                subtypeRepoAdapter,
                new SubtypeConverter(),
                groupSubtypeRepoAdapter,
                authValidationClass,
                groupMemberRepoAdapter,
                memberRepoAdapter,
                noteCollabRepoAdapter
        );
    }

    @Bean
    public NoteService<Pageable> noteService() {
        return new NoteService<>(
                notePrivateRepoAdapter,
                noteCollabRepoAdapter,
                new JoinFetchNote<>(notePrivateRepoAdapter,noteCollabRepoAdapter,subtypeRepoAdapter,memberRepoAdapter,new EntityBindFunctionImpl(delimiter)),
                authValidationClass,
                new NoteCollabConverter(delimiter),
                new NotePrivateConverter(delimiter),
                memberRepoAdapter,
                groupMemberRepoAdapter
        );
    }
}
