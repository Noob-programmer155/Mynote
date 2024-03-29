package com.amrtm.mynoteapps.adapter.router;

import com.amrtm.mynoteapps.adapter.storage.GroupStorageImpl;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.usecase.user.GroupService;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.file.Path;
import java.util.UUID;
import java.util.function.Function;

public class GroupRouter<PagingAndSorting> {
    private final GroupService<GroupStorageImpl,PagingAndSorting> groupService;
    private final com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting;

    public GroupRouter(GroupService<GroupStorageImpl,PagingAndSorting> groupService, com.amrtm.mynoteapps.entity.other.pagingandsorting.PagingAndSorting<PagingAndSorting> pagingAndSorting) {
        this.groupService = groupService;
        this.pagingAndSorting = pagingAndSorting;
    }

    public Mono<byte[]> getAvatar(String name) {
        return groupService.getAvatar(name).switchIfEmpty(Mono.just(new byte[]{}));
    }

//    public Mono<ServerResponse> getGroup() {
//        return ServerResponse.ok().body(groupService.findById(
//                UUID.fromString(request.queryParam("group").orElse(""))
//        ), GroupNoteDTO.class);
//    }

    public Flux<UUIDIdAndName> searchGroup(String name, int page, int size) {
        return groupService.findByNameLike(name, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<GroupNoteDTO> searchGroupData(String name, int page, int size) {
        return groupService.findByNameLikeData(name,pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Mono<SingleData<Boolean>> validateNameGroup(String name) {
        return groupService.validateName(name).flatMap(item -> Mono.just(new SingleData<>(item)));
    }

    public Flux<MemberDTO> notifMemberWillJoin(UUID group,int page,int size) {
        return groupService.findByWaitingStatus(group, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<MemberDTO> notifMemberRejectJoin(UUID group,int page,int size) {
        return groupService.findByRejectedStatus(group, pagingAndSorting.create(page,size,pagingAndSorting.asc(),"name"));
    }

    public Flux<MemberDTO> memberGroup(UUID group) {
        return groupService.getMemberGroup(group);
    }

    public Mono<SingleData<Boolean>> updateRolePromoted(UUID member, UUID group) {
        return groupService.updateRole(member,group,Role.ADMIN).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> updateRoleDemoted(UUID member, UUID group) {
        return groupService.updateRole(member,group,Role.MEMBER).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> sendRequest(UUID member, UUID group) {
        return groupService.sendAggrement(member,group).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> confirmAggrement(UUID member, UUID group) {
        return groupService.confirmAggrement(member,group).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> rejectAggrement(UUID member, UUID group) {
        return groupService.rejectAggrement(member,group).map(SingleData::new);
    }

    public Mono<SingleData<Boolean>> removeMember(UUID member, UUID group) {
        return groupService.removeMember(member,group).thenReturn(new SingleData<>(true));
    }

    public Mono<GroupNoteDTO> save(GroupNoteDTO groupNoteDTO,byte[] avatar, String filename, boolean condition, Function<Path,Mono<Void>> elseCondition) {
        return groupService.save(groupNoteDTO,avatar,filename,false,condition,elseCondition);
    }

    public Mono<GroupNoteDTO> update(GroupNoteDTO groupNoteDTO,byte[] avatar, String filename, boolean condition, Function<Path,Mono<Void>> elseCondition) {
        return groupService.save(groupNoteDTO,avatar,filename,true,condition,elseCondition);
    }

    public Mono<SingleData<Boolean>> delete(UUID group) {
        return groupService.deleteById(group).thenReturn(new SingleData<>(true));
    }
}
