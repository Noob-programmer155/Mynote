package com.amrtm.mynoteapps.usecase.user;

import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.entity.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.entity.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.GroupConverter;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.MemberConverter;
import com.amrtm.mynoteapps.usecase.file.FileStorageImpl;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.UUID;

public class GroupService<Storage extends FileStorageImpl> implements UserServiceArc<GroupNoteDTO, UUID> {
    private final GroupRepoImpl groupRepo;
    private final GroupConverter groupConverter;
    private final MemberConverter memberConverter;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    private final Storage groupFileStorage;
    private final AuthValidation authValidation;
    private final MemberRepoImpl memberRepo;
    private final NoteCollabRepo noteCollabRepo;

    public GroupService(GroupRepoImpl groupRepo, GroupConverter groupConverter, MemberConverter memberConverter, GroupMemberRepoRelation groupMemberRepoRelation, Storage groupFileStorage, AuthValidation authValidation, MemberRepoImpl memberRepo, NoteCollabRepo noteCollabRepo) {
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
    public Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable) {
        return groupRepo.findByNameLike(name, pageable).map(item -> new UUIDIdAndName.builder()
                .id(item.getId()).name(item.getUsername()).build());
    }

    // notif sudah masuk grup atau belum
    @Override
    public Flux<GroupNoteDTO> findByNameLikeData(String name, Pageable pageable) {
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

    public Flux<MemberDTO> findByWaitingStatus(UUID group, Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(data -> data.getRole() == Role.ADMIN || data.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMapMany(item -> memberRepo.findByWaitingState(group,pageable)
                        .map(memberConverter::convertTo)
                );
    }

    public Flux<MemberDTO> findByRejectedStatus(UUID group, Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(data -> data.getRole() == Role.ADMIN || data.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMapMany(item -> memberRepo.findByRejectState(group,pageable)
                        .map(memberConverter::convertTo)
                );
    }

    public Flux<MemberDTO> getMemberGroup(UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .flatMapMany(item -> memberRepo.findMemberGroup(group)
                        .map(member -> memberConverter.convertToWithRole(member,item.getRole())));
    }

    public Mono<Boolean> updateRole(UUID member, UUID group, Role role) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .filter(roleObj -> roleObj.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
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
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                        .parent(group)
                        .child(member)
                        .role(Role.MEMBER)
                        .isDeleted(0)
                        .isConfirmed(0)
                        .build()
                ).hasElement());
    }

    public Mono<Boolean> confirmAggrement(UUID member,UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
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
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
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
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.deleteByParentAndChildAuth(group,member));
    }

    public Mono<GroupNoteDTO> save(GroupNoteDTO data, byte[] avatar, String filename, boolean update) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> {
                    if (avatar != null)
                        return groupFileStorage.storeFile(avatar, filename,"group", data.getAvatar()).flatMap(file -> {
                            data.setAvatar(file);
                            if (update)
                                return groupRepo.findById(data.getId())
                                        .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                                        .flatMap(dto -> groupRepo.save(groupConverter.deconvert(data,dto)))
                                        .map(groupConverter::convertTo);
                            else
                                return groupRepo.save(groupConverter.deconvert(data))
                                    .flatMap(grp -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                                            .parent(grp.getId())
                                            .child(item)
                                            .role(Role.MANAGER)
                                            .isDeleted(0)
                                            .isConfirmed(1)
                                            .build())
                                            .then(Mono.just(groupConverter.convertTo(grp))));
                        });
                    else {
                        if (update)
                            return groupRepo.findById(data.getId())
                                    .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                                    .flatMap(dto -> groupRepo.save(groupConverter.deconvert(data,dto)))
                                    .map(groupConverter::convertTo);
                        else
                            return groupRepo.save(groupConverter.deconvert(data))
                                    .flatMap(grp -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                                                    .parent(grp.getId())
                                                    .child(item)
                                                    .role(Role.MANAGER)
                                                    .isDeleted(0)
                                                    .isConfirmed(1)
                                                    .build())
                                            .then(Mono.just(groupConverter.convertTo(grp))));
                    }
                });
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(id,item))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not member")))
                .filter(role -> role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupRepo.findById(id)
                    .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                    .flatMap(data -> {
                        if (data.getAvatar() != null)
                            return groupFileStorage.deleteFile(data.getAvatar())
                                    .filter(is -> is)
                                    .switchIfEmpty(Mono.error(new IllegalStateException("cannot delete file image "+data.getAvatar())))
                                    .flatMap(is -> noteCollabRepo.deleteByGroup(id))
                                    .then(groupRepo.deleteById(data.getId()));
                        else
                            return noteCollabRepo.deleteByGroup(id)
                                    .then(groupRepo.deleteById(data.getId()));
                    })
                );
    }
}
