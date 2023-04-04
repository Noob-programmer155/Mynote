package com.amrtm.mynoteapps.backend.service.model.subtype;

import com.amrtm.mynoteapps.backend.converter.entity_converter.SubtypeConverter;
import com.amrtm.mynoteapps.backend.model.other.Role;
import com.amrtm.mynoteapps.backend.model.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.backend.model.subtype.impl.Subtype;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.backend.repository.relation.GroupSubtypeRepoRelation;
import com.amrtm.mynoteapps.backend.repository.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.MemberRepoImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SubtypeService implements SubtypeServiceArc<SubtypeDTO, UUID>{
    private final SubtypeRepoImpl subtypeRepo;
    private final SubtypeConverter subtypeConverter;
    private final GroupSubtypeRepoRelation groupSubtypeRepoRelation;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    private final MemberRepoImpl memberRepo;
    
    @Override
    public Flux<SubtypeDTO> findByNameGroup(String name, UUID id, Pageable pageable) {
        return subtypeRepo.findByNameLikeGroup(name, id, pageable).map(subtypeConverter::convertTo);
    }

    @Override
    public Flux<SubtypeDTO> findByName(String name, Pageable pageable) {
        return subtypeRepo.findByNameLike(name, pageable).map(subtypeConverter::convertTo);
    }

    @Override
    public Mono<Boolean> addSubtype(UUID subtype, UUID group) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .then(groupSubtypeRepoRelation.save(GroupSubtypeRel.builder()
                        .parent(group)
                        .child(subtype)
                        .build()).thenReturn(true));
    }

    @Override
    public Mono<SubtypeDTO> save(SubtypeDTO data, UUID group, boolean update) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> {
                    if (update)
                        return subtypeRepo.findById(data.getId())
                                .switchIfEmpty(Mono.error(new IllegalStateException("id not found")))
                                .flatMap(subtype -> subtypeRepo.save(subtypeConverter.deconvert(data,subtype)))
                                .map(subtypeConverter::convertTo);
                    else
                        return subtypeRepo.save(subtypeConverter.deconvert(data))
                                .flatMap(subtype -> groupSubtypeRepoRelation.save(GroupSubtypeRel.builder()
                                        .parent(group)
                                        .child(subtype.getId()).build())
                                        .thenReturn(subtype)
                                ).map(subtypeConverter::convertTo);
                });
    }

    @Override
    public Mono<Void> removeSubtype(UUID subtype, UUID group) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> groupSubtypeRepoRelation.deleteByParentAndChild(group,subtype));
    }

    // for test only
    @Override
    public Mono<Void> deleteById(UUID subtype, UUID group) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> subtypeRepo.deleteById(subtype));
    }
}
