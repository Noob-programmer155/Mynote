package com.amrtm.mynoteapps.usecase.user;

import com.amrtm.mynoteapps.entity.model.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.entity.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.entity.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.model.user.group.impl.GroupNote;
import com.amrtm.mynoteapps.entity.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.entity.model.user.member.impl.Member;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.GroupConverter;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.MemberConverter;
import com.amrtm.mynoteapps.usecase.storage.file.FileStorageImpl;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.FileNotFoundException;
import java.nio.file.Path;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;

public class GroupService<Storage extends FileStorageImpl,PagingAndSorting> implements UserServiceArc<GroupNoteDTO, UUID, PagingAndSorting> {
    private final GroupRepoImpl<GroupNote,PagingAndSorting> groupRepo;
    private final GroupConverter groupConverter;
    private final MemberConverter memberConverter;
    private final GroupMemberRepoRelation<GroupMemberRel> groupMemberRepoRelation;
    private final Storage groupFileStorage;
    private final AuthValidation authValidation;
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo;

    public GroupService(GroupRepoImpl<GroupNote,PagingAndSorting> groupRepo, GroupConverter groupConverter, MemberConverter memberConverter,
                        GroupMemberRepoRelation<GroupMemberRel> groupMemberRepoRelation, Storage groupFileStorage, AuthValidation authValidation,
                        MemberRepoImpl<Member,PagingAndSorting> memberRepo, NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo) {
        this.groupRepo = groupRepo;
        this.groupConverter = groupConverter;
        this.memberConverter = memberConverter;
        this.groupMemberRepoRelation = groupMemberRepoRelation;
        this.groupFileStorage = groupFileStorage;
        this.authValidation = authValidation;
        this.memberRepo = memberRepo;
        this.noteCollabRepo = noteCollabRepo;
    }

    @Override
    public Mono<byte[]> getAvatar(String name) {
        return groupFileStorage.retrieveFile(name);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLike(String name, PagingAndSorting pageable) {
        return groupRepo.findByNameLike(name, pageable).map(item -> new UUIDIdAndName.builder()
                .id(item.getId()).name(item.getUsername()).build());
    }

    // notif sudah masuk grup atau belum
    @Override
    public Flux<GroupNoteDTO> findByNameLikeData(String name, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> groupRepo.findByNameLike(name, pageable)
                        .flatMap(group -> groupMemberRepoRelation.findByParentAndChild(group.getId(),item).hasElement()
                                .map(is -> {
                                    GroupNoteDTO groupNoteDTO = groupConverter.convertTo(group);
                                    groupNoteDTO.setIsMember(is);
                                    return groupNoteDTO;
                                })
                        )
                );
    }

    @Override
    public Mono<Boolean> validateName(String name) {
        return groupRepo.validateName(name).hasElement().map(item -> !item);
    }

    public Flux<MemberDTO> findByWaitingStatus(UUID group, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(data -> data.getRole() == Role.ADMIN || data.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMapMany(item -> memberRepo.findByWaitingState(group,pageable)
                        .map(member -> memberConverter.convertToNotification(member,member.getUserFrom().equals(group)))
                );
    }

    public Flux<MemberDTO> findByRejectedStatus(UUID group, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(data -> data.getRole() == Role.ADMIN || data.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMapMany(item -> memberRepo.findByRejectState(group,pageable)
                        .map(member -> memberConverter.convertToNotification(member,member.getUserFrom().equals(group)))
                );
    }

    public Flux<MemberDTO> getMemberGroup(UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> memberRepo.findMemberGroup(group)
                        .flatMap(member -> Mono.just(member)
                                .flatMap(mbr -> groupMemberRepoRelation.findByParentAndChild(group,mbr.getId()))
                                .map(memberDt -> memberConverter.convertToWithRole(member,memberDt.getRole()))
                                .defaultIfEmpty(memberConverter.convertToWithRole(member,Role.USER)))
                        )
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")));
    }

    public Mono<Boolean> updateRole(UUID member, UUID group, Role role) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")))
                .filter(roleObj -> roleObj.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group, member)
                        .switchIfEmpty(Mono.error(new IllegalStateException("member not found")))
                        .flatMap(data -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                                .id(data.getId())
                                .parent(data.getParent())
                                .child(data.getChild())
                                .isConfirmed(data.getIsConfirmed())
                                .isDeleted(data.getIsDeleted())
                                .role(role)
                                .build()).map(Objects::nonNull)
                        ));
    }

    public Mono<Boolean> sendAggrement(UUID member,UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                        .parent(group)
                        .child(member)
                        .role(Role.MEMBER)
                        .isDeleted(0)
                        .isConfirmed(0)
                        .userFrom(group)
                        .build()
                ).hasElement());
    }

    public Mono<Boolean> confirmAggrement(UUID member,UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChildNonAuthorize(group, member))
                .switchIfEmpty(Mono.error(new IllegalStateException("member does`nt sign in this group")))
                .flatMap(item -> {
                    if (item != null) {
                        item.setIsConfirmed(1);
                        return groupMemberRepoRelation.save(item).hasElement();
                    } else
                        return Mono.just(false);
                });
    }

    //after reject delete relation
    public Mono<Boolean> rejectAggrement(UUID member,UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChildNonAuthorize(group, member))
                .switchIfEmpty(Mono.error(new IllegalStateException("member does`nt sign in this group")))
                .flatMap(item -> {
                    if (item != null) {
                        item.setIsDeleted(1);
                        return groupMemberRepoRelation.save(item).hasElement();
                    } else
                        return Mono.just(false);
                });
    }

    public Mono<Void> removeMember(UUID member,UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.deleteByParentAndChildAuth(group,member));
    }

    public Mono<GroupNoteDTO> save(GroupNoteDTO data, byte[] avatar, String filename, boolean update, boolean condition, Function<Path,Mono<Void>> elseCondition) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName).map(Member::getId)
                .flatMap(ids -> {
                    if (avatar.length > 0)
                        return Mono.just(update)
                                .filter(is -> is)
                                .flatMap(is ->
                                        groupMemberRepoRelation.findByParentAndChild(data.getId(),ids)
                                        .filter(role -> role.getRole() == Role.MANAGER)
                                        .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                                        .flatMap(is1 -> groupRepo.findById(data.getId()))
                                        .flatMap(group ->
                                                groupFileStorage.storeFile(avatar, filename,"group", (group.getAvatar() != null && !group.getAvatar().isBlank())?group.getAvatar():"",condition,elseCondition)
                                                        .flatMap(file -> {data.setAvatar(file);return groupRepo.save(groupConverter.deconvert(data,group));}))
                                ).switchIfEmpty(
                                        groupFileStorage.storeFile(avatar, filename,"group", "",condition,elseCondition)
                                                .flatMap(file -> {data.setAvatar(file);return groupRepo.save(groupConverter.deconvert(data));})
                                                .flatMap(grp -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                                                        .parent(grp.getId())
                                                        .child(ids)
                                                        .role(Role.MANAGER)
                                                        .isDeleted(0)
                                                        .isConfirmed(1)
                                                        .build()).then(Mono.just(grp))))
                                .map(item -> {
                                    GroupNoteDTO group = groupConverter.convertTo(item);
                                    group.setRoleMember(Role.MANAGER);
                                    group.setIsMember(true);
                                    return group;
                                });
                    else {
                        return Mono.just(update)
                                .filter(is -> is)
                                .flatMap(is -> groupMemberRepoRelation.findByParentAndChild(data.getId(),ids)
                                        .filter(role -> role.getRole() == Role.MANAGER)
                                        .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                                        .flatMap(is1 -> groupRepo.findById(data.getId()))
                                        .flatMap(grp -> groupRepo.save(groupConverter.deconvert(data,grp))))
                                .switchIfEmpty(groupRepo.save(groupConverter.deconvert(data))
                                        .flatMap(grp -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                                                .parent(grp.getId())
                                                .child(ids)
                                                .role(Role.MANAGER)
                                                .isDeleted(0)
                                                .isConfirmed(1)
                                                .build()).then(Mono.just(grp))))
                                .map(item -> {
                                    GroupNoteDTO group = groupConverter.convertTo(item);
                                    group.setRoleMember(Role.MANAGER);
                                    group.setIsMember(true);
                                    return group;
                                });
                    }
                });
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(id,item))
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not member")))
                .filter(role -> role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                .flatMap(item -> groupRepo.findById(id)
                    .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                    .flatMap(data -> {
                        if (data.getAvatar() != null)
                            return groupFileStorage.deleteFile(data.getAvatar())
                                    .filter(is -> is)
                                    .switchIfEmpty(Mono.error(new FileNotFoundException("cannot delete file image "+data.getAvatar())))
                                    .flatMap(is -> noteCollabRepo.deleteByGroup(id))
                                    .then(groupRepo.deleteById(data.getId()));
                        else
                            return noteCollabRepo.deleteByGroup(id)
                                    .then(groupRepo.deleteById(data.getId()));
                    })
                );
    }
}
