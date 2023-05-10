package com.amrtm.mynoteapps.backend.service.model.user;

import com.amrtm.mynoteapps.backend.service.converter.entity_converter.GroupConverter;
import com.amrtm.mynoteapps.backend.service.converter.entity_converter.MemberConverter;
import com.amrtm.mynoteapps.backend.model.other.Login;
import com.amrtm.mynoteapps.backend.model.other.Role;
import com.amrtm.mynoteapps.backend.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.repository.other.LoginRepoImpl;
import com.amrtm.mynoteapps.backend.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.backend.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.fetchjoin.JoinFetchMember;
import com.amrtm.mynoteapps.backend.service.file.MemberFileStorage;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import com.amrtm.mynoteapps.backend.service.security.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MemberService implements UserServiceArc<MemberDTO, UUID>{
    private final MemberRepoImpl memberRepo;
    private final GroupRepoImpl groupRepo;
    private final MemberConverter memberConverter;
    private final GroupConverter groupConverter;
    private final LoginRepoImpl loginRepo;
    private final JoinFetchMember joinFetchMember;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    private final MemberFileStorage memberFileStorage;
    private final JwtProvider jwtProvider;

    //clear
    public Mono<String> login(String username, String password) {
        return Mono.just(username).filter(String::isBlank)
                .switchIfEmpty(Mono.error(new IllegalStateException("username must be added")))
                .flatMap(memberRepo::findByName).flatMap(item -> {
            if (SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().matches(password,item.getPassword())) {
                return jwtProvider.createToken(item.getUsername(),Role.USER)
                        .flatMap(data -> loginRepo.findByName(item.getUsername()).hasElement()
                                .flatMap(is -> {
                                    if (is)
                                        return loginRepo.update(Login.builder().member(item.getId()).token(data).build());
                                    else
                                        return loginRepo.save(Login.builder().member(item.getId()).token(data).build());
                                }).thenReturn(data));
            } else
                return Mono.error(new IllegalStateException("password not match"));
        }).switchIfEmpty(Mono.error(new IllegalStateException("user does`nt sign in yet")));
    }

    public Mono<String> signup(MemberDTO member, FilePart filePart) {
        if (member.getPassword() == null || member.getPassword().isBlank() || member.getUsername() == null || member.getUsername().isBlank())
            return Mono.error(new IllegalStateException("password and username cannot be null"));
        return save(member, filePart, false).flatMap(item -> {
            if (item != null)
                return jwtProvider.createToken(item.getUsername(),Role.USER)
                        .flatMap(data -> loginRepo.save(Login.builder().member(item.getId()).token(data).build())
                                .thenReturn(data));
            else
                return Mono.error(new IllegalStateException("save user failed"));
        });
    }

    public Mono<Boolean> logout(WebSession session) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()))
                .flatMap(item -> Mono.deferContextual(Mono::just).contextWrite(ReactiveSecurityContextHolder.clearContext())
                        .flatMap(data -> session.invalidate().then(loginRepo.deleteById(item.getId())).thenReturn(true))
                );
    }

    public Mono<String> refresh(String token) {
        return jwtProvider.getUsernameAndDateClaimJwtExpired(token)
                .flatMap(item -> loginRepo.findByName(item.getFirst())
                        .switchIfEmpty(Mono.error(new IllegalStateException("you`re must login,token is expired")))
                        .flatMap(is -> jwtProvider.validateDate(item.getSecond()))
                        .flatMap(is -> {
                            if (is)
                                return jwtProvider.createToken(item.getFirst(),Role.USER);
                            else
                                return memberRepo.findByName(item.getFirst())
                                        .flatMap(data -> loginRepo.deleteById(data.getId()))
                                        .then(Mono.error(new IllegalStateException("token is invalid")));
                        })
                ).switchIfEmpty(Mono.error(new AuthenticationCredentialsNotFoundException("must login first")));
    }

    @Override
    public Mono<byte[]> getAvatar(String name) {
        return memberFileStorage.retrieveFile(name);
    }

//    @Override
    public Mono<MemberDTO> findProfile() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> joinFetchMember.findByName((String) item.getPrincipal()));
    }

    @Override
    public Flux<UUIDIdAndName> findByNameLike(String name, Pageable pageable) {
        return memberRepo.findByNameLike(name, pageable).map(item -> UUIDIdAndName.builder()
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMapMany(item -> groupRepo.findByRejectState(item,pageable)
                        .map(group -> {
                            GroupNoteDTO groupNoteDTO = groupConverter.convertTo(group);
                            groupNoteDTO.setIsMember(false);
                            return groupNoteDTO;
                        })
                );
    }

    public Flux<GroupNoteDTO> findByWaitingStatusGroup(Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMapMany(item -> groupRepo.findByWaitingState(item,pageable)
                        .map(group -> {
                            GroupNoteDTO groupNoteDTO = groupConverter.convertTo(group);
                            groupNoteDTO.setIsMember(false);
                            return groupNoteDTO;
                        })
                );
    }

    public Flux<GroupNoteDTO> getGroups(UUID member) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).hasElement())
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

    public Mono<Boolean> updatePassword(String newPassword, String oldPassword) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()))
                .flatMap(item -> {
                    if(SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8().matches(oldPassword,item.getPassword())) {
                        return memberRepo.save(memberConverter.deconvert(MemberDTO.builder()
                                .id(item.getId())
                                .password(newPassword)
                                .build(),item))
                                .hasElement();
                    } else
                        return Mono.just(false);
                });

    }

    public Mono<Boolean> groupConfirm(UUID group) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()))
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
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
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.save(GroupMemberRel.builder()
                        .parent(group)
                        .child(item)
                        .role(Role.MEMBER)
                        .isDeleted(0)
                        .isConfirmed(0)
                        .build()
                ).hasElement());
    }

    public Mono<Void> removeGroupRejected(UUID group){
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.deleteByParentAndChild(group,item));
    }

    public Mono<MemberDTO> save(MemberDTO data, FilePart avatar,boolean update) {
        if (avatar != null)
            return memberFileStorage.storeFile(avatar,"member", data.getAvatar()).flatMap(item -> {
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
