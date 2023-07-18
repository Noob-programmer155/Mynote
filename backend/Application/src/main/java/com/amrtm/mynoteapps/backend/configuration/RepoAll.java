package com.amrtm.mynoteapps.backend.configuration;

import com.amrtm.mynoteapps.adapter.database.repository.*;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.login.LoginRepoImpl;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.note.NoteCollabRepo;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.note.NotePrivateRepo;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.relation.GroupSubtypeRepoRelation;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.relation.SubtypeNoteRepoRelation;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.relation.ThemeMemberRepoRelation;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.theme.ThemeRepoImpl;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.user.GroupRepoImpl;
import com.amrtm.mynoteapps.backend.configuration.database.persistence.user.MemberRepoImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class RepoAll {
    private final LoginRepoImpl loginRepo;
    private final NotePrivateRepo notePrivateRepo;
    private final NoteCollabRepo noteCollabRepo;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    private final GroupSubtypeRepoRelation groupSubtypeRepoRelation;
    private final ThemeMemberRepoRelation themeMemberRepoRelation;
    private final SubtypeNoteRepoRelation subtypeNoteRepoRelation;
    private final SubtypeRepoImpl subtypeRepo;
    private final ThemeRepoImpl themeRepo;
    private final GroupRepoImpl groupRepo;
    private final MemberRepoImpl memberRepo;

    public RepoAll(LoginRepoImpl loginRepo, NotePrivateRepo notePrivateRepo, NoteCollabRepo noteCollabRepo, GroupMemberRepoRelation groupMemberRepoRelation, GroupSubtypeRepoRelation groupSubtypeRepoRelation, ThemeMemberRepoRelation themeMemberRepoRelation,
                   SubtypeNoteRepoRelation subtypeNoteRepoRelation ,SubtypeRepoImpl subtypeRepo, ThemeRepoImpl themeRepo, GroupRepoImpl groupRepo, MemberRepoImpl memberRepo) {
        this.loginRepo = loginRepo;
        this.notePrivateRepo = notePrivateRepo;
        this.noteCollabRepo = noteCollabRepo;
        this.groupMemberRepoRelation = groupMemberRepoRelation;
        this.groupSubtypeRepoRelation = groupSubtypeRepoRelation;
        this.themeMemberRepoRelation = themeMemberRepoRelation;
        this.subtypeNoteRepoRelation = subtypeNoteRepoRelation;
        this.subtypeRepo = subtypeRepo;
        this.themeRepo = themeRepo;
        this.groupRepo = groupRepo;
        this.memberRepo = memberRepo;
    }

    @Bean
    public GroupRepoAdapter groupRepoAdapter() {
        return new GroupRepoAdapter(groupRepo);
    }
    @Bean
    public MemberRepoAdapter memberRepoAdapter() {
        return new MemberRepoAdapter(memberRepo);
    }

    @Bean
    public ThemeRepoAdapter themeRepoAdapter() {
        return new ThemeRepoAdapter(themeRepo);
    }

    @Bean
    public SubtypeRepoAdapter subtypeRepoAdapter() {
        return new SubtypeRepoAdapter(subtypeRepo);
    }

    @Bean
    public GroupMemberRepoAdapter groupMemberRepoAdapter() {
        return new GroupMemberRepoAdapter(groupMemberRepoRelation);
    }

    @Bean
    public GroupSubtypeRepoAdapter groupSubtypeRepoAdapter() {
        return new GroupSubtypeRepoAdapter(groupSubtypeRepoRelation);
    }

    @Bean
    public ThemeMemberRepoAdapter themeMemberRepoAdapter() {
        return new ThemeMemberRepoAdapter(themeMemberRepoRelation);
    }

    @Bean
    public SubtypeNoteRepoAdapter subtypeNoteRepoAdapter() {
        return new SubtypeNoteRepoAdapter(subtypeNoteRepoRelation);
    }

    @Bean
    public NotePrivateRepoAdapter notePrivateRepoAdapter() {
        return new NotePrivateRepoAdapter(notePrivateRepo);
    }

    @Bean
    public NoteCollabRepoAdapter noteCollabRepoAdapter() {
        return new NoteCollabRepoAdapter(noteCollabRepo);
    }

    @Bean
    public LoginRepoAdapter loginRepoAdapter() {
        return new LoginRepoAdapter(loginRepo);
    }
}
