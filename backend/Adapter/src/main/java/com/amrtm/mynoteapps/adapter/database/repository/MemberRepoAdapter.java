package com.amrtm.mynoteapps.adapter.database.repository;

import com.amrtm.mynoteapps.adapter.converter.MemberPersisConv;
import com.amrtm.mynoteapps.entity.other.obj.MemberNotif;
import com.amrtm.mynoteapps.entity.other.obj.Name;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.logging.Logger;

public class MemberRepoAdapter implements MemberRepoImpl<Member, Pageable> {
    private final com.amrtm.mynoteapps.adapter.database.persistence.repository.user.MemberRepoImpl memberRepo;
    private final MemberPersisConv memberPersisConv = new MemberPersisConv();
    public MemberRepoAdapter(com.amrtm.mynoteapps.adapter.database.persistence.repository.user.MemberRepoImpl memberRepo) {
        this.memberRepo = memberRepo;
    }

    @Override
    public Mono<Member> findById(UUID uuid) {
        return memberRepo.findById(uuid).map(memberPersisConv::toSecond);
    }

    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return memberRepo.deleteById(uuid);
    }

    @Override
    public Mono<Member> findByName(String name) {
        return memberRepo.findByName(name).map(memberPersisConv::toSecond);
    }

    @Override
    public Flux<Member> findByNameLike(String name, Pageable pageable) {
        return memberRepo.findByNameLike(name, pageable).map(memberPersisConv::toSecond);
    }

    @Override
    public Flux<MemberNotif> findByWaitingState(UUID group, Pageable pageable) {
        return memberRepo.findByWaitingState(group, pageable);
    }

    @Override
    public Flux<MemberNotif> findByRejectState(UUID group, Pageable pageable) {
        return memberRepo.findByRejectState(group, pageable);
    }

    @Override
    public Flux<Member> findMemberGroup(UUID group) {
        return memberRepo.findMemberGroup(group).map(memberPersisConv::toSecond);
    }

    @Override
    public Mono<Name> validateName(String username) {
        return memberRepo.validateName(username);
    }

    Logger log = Logger.getLogger(MemberRepoAdapter.class.getName());
    @Override
    public <S extends Member> Mono<S> save(S entity) {
        return (Mono<S>) memberRepo.save(memberPersisConv.toFirst(entity)).map(memberPersisConv::toSecond);
    }
}
