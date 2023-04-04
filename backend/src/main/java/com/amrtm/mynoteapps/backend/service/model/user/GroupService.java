package com.amrtm.mynoteapps.backend.service.model.user;

import com.amrtm.mynoteapps.backend.converter.entity_converter.GroupConverter;
import com.amrtm.mynoteapps.backend.converter.entity_converter.MemberConverter;
import com.amrtm.mynoteapps.backend.model.other.Role;
import com.amrtm.mynoteapps.backend.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.backend.model.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.backend.repository.relation.GroupSubtypeRepoRelation;
import com.amrtm.mynoteapps.backend.repository.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.backend.service.file.GroupFileStorage;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Objects;
import java.util.UUID;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class GroupService implements UserServiceArc<GroupNoteDTO, UUID>{
    private final GroupRepoImpl groupRepo;
    private final GroupConverter groupConverter;
    private final MemberConverter memberConverter;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    private final GroupFileStorage groupFileStorage;
    private final GroupSubtypeRepoRelation groupSubtypeRepoRelation;
    private final SubtypeRepoImpl subtypeRepo;
    private final MemberRepoImpl memberRepo;

    @Override
    public Mono<byte[]> getAvatar(String name) {
        return groupFileStorage.retrieveFile(name);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable) {
        return groupRepo.findByNameLike(name, pageable).map(item -> UUIDIdAndName.builder()
                .id(item.getId()).name(item.getUsername()).build());
    }

    // notif sudah masuk grup atau belum
    @Override
    public Flux<GroupNoteDTO> findByNameLikeData(String name, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(data -> data.getRole() == Role.ADMIN || data.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMapMany(item -> memberRepo.findByWaitingState(group,pageable)
                        .map(memberConverter::convertTo)
                );
    }

    public Flux<MemberDTO> findByRejectedStatus(UUID group, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(data -> data.getRole() == Role.ADMIN || data.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMapMany(item -> memberRepo.findByRejectState(group,pageable)
                        .map(memberConverter::convertTo)
                );
    }

    public Flux<MemberDTO> getMemberGroup(UUID group, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(is -> is)
                .flatMapMany(item -> memberRepo.findMemberGroup(group).map(memberConverter::convertTo));
    }

    public Mono<Boolean> updatePassword(UUID group,String newPassword, String oldPassword) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(role -> role.getRole() == Role.MANAGER)
                        .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                        .flatMap(data -> groupRepo.findById(data.getParent()))
                        .flatMap(data -> {
                            if(SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().matches(oldPassword,data.getPassword())) {
                                return groupRepo.save(groupConverter.deconvert(GroupNoteDTO.builder()
                                        .id(data.getId())
                                        .password(newPassword)
                                        .build(),data));
                            } else
                                return Mono.empty();
                        })).hasElement();
    }

    public Mono<Boolean> updateRole(UUID member, UUID group, Role role) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .filter(roleObj -> roleObj.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group, member)
                        .switchIfEmpty(Mono.error(new IllegalStateException("member not found")))
                        .flatMap(data -> groupMemberRepoRelation.save(GroupMemberRel.builder()
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.save(GroupMemberRel.builder()
                        .parent(group)
                        .child(member)
                        .role(Role.MEMBER)
                        .isDeleted(0)
                        .isConfirmed(0)
                        .build()
                ).hasElement());
    }

    public Mono<Boolean> confirmAggrement(UUID member,UUID group){
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item))
                .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupMemberRepoRelation.deleteByParentAndChildAuth(group,member));
    }

    public Mono<GroupNoteDTO> save(GroupNoteDTO data, FilePart avatar, boolean update) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> {
                    if (avatar != null)
                        return groupFileStorage.storeFile(avatar,"group", data.getAvatar()).flatMap(file -> {
                            data.setAvatar(file);
                            if (update)
                                return groupRepo.findById(data.getId())
                                        .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                                        .flatMap(dto -> groupRepo.save(groupConverter.deconvert(data,dto)))
                                        .map(groupConverter::convertTo);
                            else
                                return groupRepo.save(groupConverter.deconvert(data))
                                    .flatMap(grp -> groupMemberRepoRelation.save(GroupMemberRel.builder()
                                            .parent(grp.getId())
                                            .child(item)
                                            .role(Role.MANAGER)
                                            .isDeleted(0)
                                            .isConfirmed(1)
                                            .build())
                                            .thenReturn(groupConverter.convertTo(grp)));
                        });
                    else {
                        if (update)
                            return groupRepo.findById(data.getId())
                                    .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                                    .flatMap(dto -> groupRepo.save(groupConverter.deconvert(data,dto)))
                                    .map(groupConverter::convertTo);
                        else
                            return groupRepo.save(groupConverter.deconvert(data))
                                    .flatMap(grp -> groupMemberRepoRelation.save(GroupMemberRel.builder()
                                                    .parent(grp.getId())
                                                    .child(item)
                                                    .role(Role.MANAGER)
                                                    .isDeleted(0)
                                                    .isConfirmed(1)
                                                    .build())
                                            .thenReturn(groupConverter.convertTo(grp)));
                    }
                });
    }

    @Override
    public Mono<Void> deleteById(UUID id) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(id,item))
                .filter(role -> role.getRole() == Role.MANAGER)
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupRepo.findById(id)
                    .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                    .flatMap(data -> {
                        if (data.getAvatar() != null)
                            return groupFileStorage.deleteFile(data.getAvatar())
                                    .filter(is -> is)
                                    .switchIfEmpty(Mono.error(new IllegalStateException("cannot delete file image "+data.getAvatar())))
                                    .then(groupSubtypeRepoRelation.findByParent(id).collectList()
                                            .flatMap(list -> {
                                                if (!list.isEmpty())
                                                    return subtypeRepo.deleteAllById(list.stream().map(GroupSubtypeRel::getChild).toList());
                                                else
                                                    return Mono.just(list);
                                            }).then(groupRepo.deleteById(data.getId())));
                        else
                            return groupSubtypeRepoRelation.findByParent(id).collectList()
                                    .flatMap(list -> {
                                        if (!list.isEmpty())
                                            return subtypeRepo.deleteAllById(list.stream().map(GroupSubtypeRel::getChild).toList());
                                        else
                                            return Mono.just(list);
                                    }).then(groupRepo.deleteById(data.getId()));
                    })
                );
    }
}
