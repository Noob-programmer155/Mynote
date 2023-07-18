package com.amrtm.mynoteapps.adapter.router;

import com.amrtm.mynoteapps.adapter.storage.MemberStorageImpl;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.usecase.security.SecurityTokenProvider;
import com.amrtm.mynoteapps.usecase.user.MemberService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Function;

public class MemberRouter<PagingAndSorting> {
    private final MemberService<MemberStorageImpl,PagingAndSorting> memberService;
    private final SecurityTokenProvider securityTokenProvider;
    private final com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting;

    public MemberRouter(MemberService<MemberStorageImpl,PagingAndSorting> memberService, SecurityTokenProvider securityTokenProvider, com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting) {
        this.memberService = memberService;
        this.securityTokenProvider = securityTokenProvider;
        this.pagingAndSorting = pagingAndSorting;
    }

    public Mono<SingleData<String>> login(String username, String password, Function<Pair<String, String>, Boolean> matchesPassword) {
        return memberService.login(username,password,matchesPassword).map(SingleData::new);
    }

    public Mono<SingleData<String>> signup(MemberDTO memberDTO,byte[] filePart,String filename,boolean condition,Function<Path,Mono<Void>> elseCondition) {
        return memberService.signup(memberDTO,filePart,filename,condition,elseCondition).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> logout(Mono<Void> sessionInvalidate, Mono<Void> invalidateContext) {
        return memberService.logout(sessionInvalidate,invalidateContext).map(SingleData::new);
    }

    public Mono<SingleData<String>> refresh(String token) {
        return memberService.refresh(token).map(SingleData::new);
    }

    public Mono<byte[]> getAvatar(String name) {
        return memberService.getAvatar(name).switchIfEmpty(Mono.just(new byte[]{}));
    }

    public Mono<MemberDTO> getMember() {
        return memberService.findProfile();
    }

    public Flux<UUIDIdAndName> searchMember(String name, int page, int size) {
        return memberService.findByNameLike(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<MemberDTO> searchMemberData(String name, int page, int size) {
        return memberService.findByNameLikeData(name,pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Mono<SingleData<Boolean>> validateNameMember(String name) {
        return memberService.validateName(name).map(SingleData::new);
    }

    public Flux<GroupNoteDTO> notifWillJoinGroup(int page, int size) {
        return memberService.findByWaitingStatusGroup(pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<GroupNoteDTO> notifRejectedJoinGroup(int page, int size) {
        return memberService.findByRejectedStatusGroup(pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<GroupNoteDTO> groupMember(UUID member) {
        return memberService.getGroups(member);
    }

    public Mono<SingleData<Boolean>> updatePassword(String newPassword,String oldPassword,Function<Pair<String, String>, Boolean> matchesPassword) {
        return memberService.updatePassword(newPassword,oldPassword,matchesPassword).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> groupConfirmation(UUID group) {
        return memberService.groupConfirm(group).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> groupReject(UUID group) {
        return memberService.groupReject(group).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> sendRequest(UUID group) {
        return memberService.sendRequest(group).map(SingleData::new);
    }

    public Mono<SingleData<String>> update(MemberDTO memberDTO,byte[] filePart,String filename,boolean condition,Function<Path,Mono<Void>> elseCondition) {
        return memberService.save(memberDTO,filePart,filename,true,condition,elseCondition).flatMap(item -> securityTokenProvider.createToken(item.getUsername(), Role.USER).map(SingleData::new));
    }

    public Mono<SingleData<Boolean>> delete(UUID member) {
        return memberService.deleteById(member).then(Mono.just(new SingleData<>(true)));
    }

    public Mono<SingleData<Boolean>> deleteGroup(UUID group,UUID member) {
        return memberService.removeGroupRejected(group,member).then(Mono.just(new SingleData<>(true)));
    }
}
