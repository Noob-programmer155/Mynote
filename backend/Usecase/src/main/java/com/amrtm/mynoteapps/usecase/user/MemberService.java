package com.amrtm.mynoteapps.usecase.user;

import com.amrtm.mynoteapps.entity.login.Login;
import com.amrtm.mynoteapps.entity.other.utils.Pair;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.repository.other.LoginRepoImpl;
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
import com.amrtm.mynoteapps.usecase.security.SecurityTokenProvider;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
import java.util.function.Function;

public class MemberService<Storage extends FileStorageImpl> implements UserServiceArc<MemberDTO, UUID> {
    private final MemberRepoImpl memberRepo;
    private final GroupRepoImpl groupRepo;
    private final MemberConverter memberConverter;
    private final GroupConverter groupConverter;
    private final LoginRepoImpl loginRepo;
    private final AuthValidation authValidation;
    private final JoinFetchMember joinFetchMember;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    private final Storage memberFileStorage;
    private final SecurityTokenProvider securityTokenProvider;

    public MemberService(MemberRepoImpl memberRepo, GroupRepoImpl groupRepo, MemberConverter memberConverter, GroupConverter groupConverter, LoginRepoImpl loginRepo, AuthValidation authValidation, JoinFetchMember joinFetchMember, GroupMemberRepoRelation groupMemberRepoRelation, Storage memberFileStorage, SecurityTokenProvider securityTokenProvider) {
        this.memberRepo = memberRepo;
        this.groupRepo = groupRepo;
        this.memberConverter = memberConverter;
        this.groupConverter = groupConverter;
        this.loginRepo = loginRepo;
        this.authValidation = authValidation;
        this.joinFetchMember = joinFetchMember;
        this.groupMemberRepoRelation = groupMemberRepoRelation;
        this.memberFileStorage = memberFileStorage;
        this.securityTokenProvider = securityTokenProvider;
    }

    //clear
    public Mono<String> login(String username, String password,Function<Pair<String,String>, Boolean> matchesPassword) {
        return Mono.just(username).filter(String::isBlank)
                .switchIfEmpty(Mono.error(new IllegalStateException("username must be added")))
                .flatMap(memberRepo::findByName).flatMap(item -> {
            if (matchesPassword.apply(new Pair<>(item.getPassword(), password))) {
                return securityTokenProvider.createToken(item.getUsername(),Role.USER)
                        .flatMap(data -> loginRepo.findByName(item.getUsername()).hasElement()
                                .flatMap(is -> {
                                    if (is)
                                        return loginRepo.update(new Login.builder().member(item.getId()).token(data).build());
                                    else
                                        return loginRepo.save(new Login.builder().member(item.getId()).token(data).build());
                                }).then(Mono.just(data)));
            } else
                return Mono.error(new IllegalStateException("password not match"));
        }).switchIfEmpty(Mono.error(new IllegalStateException("user does`nt sign in yet")));
    }

    public Mono<String> signup(MemberDTO member, byte[] filePart, String filename) {
        if (member.getPassword() == null || member.getPassword().isBlank() || member.getUsername() == null || member.getUsername().isBlank())
            return Mono.error(new IllegalStateException("password and username cannot be null"));
        return save(member, filePart, filename, false).flatMap(item -> {
            if (item != null)
                return securityTokenProvider.createToken(item.getUsername(), Role.USER)
                        .flatMap(data -> loginRepo.save(new Login.builder().member(item.getId()).token(data).build())
                                .then(Mono.just(data)));
            else
                return Mono.error(new IllegalStateException("save user failed"));
        });
    }

    public Mono<Boolean> logout(Mono<Void> sessionInvalidate, Mono<Void> invalidateContext) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> invalidateContext.then(sessionInvalidate.then(loginRepo.deleteById(item.getId())).then(Mono.just(true))));
    }

    public Mono<String> refresh(String token) {
        return securityTokenProvider.getUsernameAndDateExpired(token)
                .flatMap(item -> loginRepo.findByName(item.getFirst())
                        .switchIfEmpty(Mono.error(new IllegalStateException("you`re must login,token is expired")))
                        .flatMap(is -> securityTokenProvider.validateDate(item.getSecond()))
                        .flatMap(is -> {
                            if (is)
                                return securityTokenProvider.createToken(item.getFirst(),Role.USER);
                            else
                                return memberRepo.findByName(item.getFirst())
                                        .flatMap(data -> loginRepo.deleteById(data.getId()))
                                        .then(Mono.error(new IllegalStateException("token is invalid")));
                        })
                ).switchIfEmpty(Mono.error(new IllegalAccessError("must login first")));
    }

    @Override
    public Mono<byte[]> getAvatar(String name) {
        return memberFileStorage.retrieveFile(name);
    }

//    @Override
    public Mono<MemberDTO> findProfile() {
        return authValidation.getValidation()
                .flatMap(joinFetchMember::findByName);
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable) {
    return memberRepo.findByNameLike(name, pageable).map(item -> new UUIDIdAndName.builder()
            .id(item.getId()).name(item.getUsername()).build());
    }

    @Override
    public Flux<MemberDTO> findByNameLikeData(String name, Pageable pageable) {
        return memberRepo.findByNameLike(name, pageable).map(memberConverter::convertTo);
    }

    @Override
    public Mono<Boolean> validateName(String name) {
        return memberRepo.validateName(name).hasElement().map(item -> !item);
    }

    public Flux<GroupNoteDTO> findByRejectedStatusGroup(Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> groupRepo.findByRejectState(item,pageable)
                        .map(group -> {
                            GroupNoteDTO groupNoteDTO = groupConverter.convertTo(group);
                            groupNoteDTO.setIsMember(false);
                            return groupNoteDTO;
                        })
                );
    }

    public Flux<GroupNoteDTO> findByWaitingStatusGroup(Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> groupRepo.findByWaitingState(item,pageable)
                        .map(group -> {
                            GroupNoteDTO groupNoteDTO = groupConverter.convertTo(group);
                            groupNoteDTO.setIsMember(false);
                            return groupNoteDTO;
                        })
                );
    }

    public Flux<GroupNoteDTO> getGroups(UUID member) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).hasElement())
                .filter(is -> is)
                .flatMapMany(ids -> groupRepo.findByIdMember(member)
                        .flatMap(group -> groupMemberRepoRelation.findByParentAndChild(group.getId(),member)
                                    .map(rel -> {
                                        GroupNoteDTO groupNoteDTO = groupConverter.convertTo(group);
                                        groupNoteDTO.setIsMember(true);
                                        groupNoteDTO.setRoleMember(rel.getRole());
                                        return groupNoteDTO;
                                    }))
                );
    }

    public Mono<Boolean> updatePassword(String newPassword, String oldPassword, Function<Pair<String,String>, Boolean> matchesPassword) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> {
                    if(matchesPassword.apply(new Pair<>(item.getPassword(),oldPassword))) {
                        return memberRepo.save(memberConverter.deconvert(new MemberDTO.builder()
                                .id(item.getId())
                                .password(newPassword)
                                .build(),item))
                                .hasElement();
                    } else
                        return Mono.just(false);
                });

    }

    public Mono<Boolean> groupConfirm(UUID group) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChildNonAuthorize(group, item.getId()))
                .switchIfEmpty(Mono.error(new IllegalStateException("you not sign in this group")))
                .flatMap(item -> {
                    if (item != null) {
                        item.setIsConfirmed(1);
                        return groupMemberRepoRelation.save(item).hasElement();
                    } else
                        return Mono.just(false);
                });
    }

    //after reject delete relation
    public Mono<Boolean> groupReject(UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChildNonAuthorize(group,item))
                .switchIfEmpty(Mono.error(new IllegalStateException("you not sign in this group")))
                .flatMap(item -> {
                    if (item != null) {
                        item.setIsDeleted(1);
                        return groupMemberRepoRelation.save(item).hasElement();
                    } else
                        return Mono.just(false);
                });
    }

    public Mono<Boolean> sendRequest(UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.save(new GroupMemberRel.builder()
                        .parent(group)
                        .child(item)
                        .role(Role.MEMBER)
                        .isDeleted(0)
                        .isConfirmed(0)
                        .build()
                ).hasElement());
    }

    public Mono<Void> removeGroupRejected(UUID group){
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.deleteByParentAndChild(group,item));
    }

    public Mono<MemberDTO> save(MemberDTO data, byte[] avatar, String filename,boolean update) {
        if (avatar != null)
            return memberFileStorage.storeFile(avatar,filename,"member", data.getAvatar()).flatMap(item -> {
                data.setAvatar(item);
                if (update)
                    return memberRepo.findById(data.getId())
                            .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                            .flatMap(member -> memberRepo.save(memberConverter.deconvert(data,member)))
                            .map(memberConverter::convertTo);
                else
                    return memberRepo.save(memberConverter.deconvert(data))
                            .map(memberConverter::convertTo);
            });
        else {
            if (update)
                return memberRepo.findById(data.getId())
                        .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                        .flatMap(member -> memberRepo.save(memberConverter.deconvert(data, member)))
                        .map(memberConverter::convertTo);
            else
                return memberRepo.save(memberConverter.deconvert(data))
                        .map(memberConverter::convertTo);
        }
    }

    // for test only
    @Override
    public Mono<Void> deleteById(UUID uuid) {
        return memberRepo.findById(uuid)
                .flatMap(item -> {
                    if (item.getAvatar() != null)
                        return memberFileStorage.deleteFile(item.getAvatar()).flatMap(is -> {
                            if (is)
                                return memberRepo.deleteById(uuid);
                            else
                                return Mono.empty();
                        });
                    else
                        return memberRepo.deleteById(uuid);
                });
    }
}
