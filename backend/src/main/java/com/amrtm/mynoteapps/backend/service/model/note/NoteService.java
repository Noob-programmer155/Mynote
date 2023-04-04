package com.amrtm.mynoteapps.backend.service.model.note;

import com.amrtm.mynoteapps.backend.converter.entity_converter.NoteCollabConverter;
import com.amrtm.mynoteapps.backend.converter.entity_converter.NotePrivateConverter;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.backend.model.other.Role;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.backend.repository.note.NotePrivateRepo;
import com.amrtm.mynoteapps.backend.repository.note.fetchjoin.JoinFetchNote;
import com.amrtm.mynoteapps.backend.repository.relation.GroupMemberRepoRelation;
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

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@SuppressWarnings("unchecked")
public class NoteService implements NoteServiceArc {
    private final NotePrivateRepo notePrivateRepo;
    private final NoteCollabRepo noteCollabRepo;
    private final JoinFetchNote joinFetchNote;
    private final NoteCollabConverter noteCollabConverter;
    private final NotePrivateConverter notePrivateConverter;
    private final MemberRepoImpl memberRepo;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    
    @Override
    public Flux<NotePrivateDTO> findByTitleMember(String name, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMapMany(item -> joinFetchNote.findByTitleLike(name,item,null,pageable));
    }

    @Override
    public Flux<NoteCollabDTO> findByTitleGroup(UUID member, UUID group, String name, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .flatMapMany(item -> joinFetchNote.findByTitleLike(name, member, group, pageable));
    }

    @Override
    public Flux<NotePrivateDTO> filterMember(List<String> category, List<String> severity, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMapMany(item -> joinFetchNote.findByFilterPrivate(category,severity,item,pageable));
    }

    @Override
    public Flux<NoteCollabDTO> filterGroup(List<String> severity,List<UUID> subtypeDTOS, UUID member, UUID group, Pageable pageable) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .flatMapMany(item -> joinFetchNote.findByFilterGroupMember(severity, subtypeDTOS, member, group, pageable));
    }

    @Override
    public Mono<NoteCollabDTO> saveNoteCollab(NoteCollabDTO data, UUID group, boolean update) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .doOnNext(item -> data.setMember(MemberDTO.builder().id(item).build()))
                .flatMap(item -> {
                    if (group != null) {
                        return groupMemberRepoRelation.findByParentAndChild(group,item);
                    } else {
                        return Mono.empty();
                    }
                })
                .switchIfEmpty(Mono.error(new IllegalStateException("You cannot add note, because you`re not a member")))
                .flatMap(item -> {
                    if (update)
                        return noteCollabRepo.findById(data.getId()).flatMap(note ->
                                noteCollabRepo.save(noteCollabConverter.deconvert(data, note)))
                                .map(noteCollabConverter::convertTo);
                    else {
                        if (data.getSubtype() != null) {
                            return noteCollabRepo.save(noteCollabConverter.deconvert(data))
                                    .map(noteCollabConverter::convertTo);
                        } else
                            return Mono.error(new IllegalStateException("subtype must not be null"));
                    }
                });
    }

    @Override
    public Mono<NotePrivateDTO> saveNotePrivate(NotePrivateDTO data, boolean update) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .doOnNext(item -> data.setMember(MemberDTO.builder().id(item).build()))
                .flatMap(item -> {
                    if (update)
                        return notePrivateRepo.findById(data.getId()).flatMap(note ->
                                        notePrivateRepo.save(notePrivateConverter.deconvert(data, note)))
                                .map(notePrivateConverter::convertTo);
                    else
                        return notePrivateRepo.save(notePrivateConverter.deconvert(data))
                                .map(notePrivateConverter::convertTo);
                });
    }

    @Override
    public Mono<Void> deleteNoteCollab(UUID id, UUID group) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                            .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                            .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                            .flatMap(rel -> noteCollabRepo.deleteById(id))
                );
    }

    @Override
    public Mono<Void> deleteNotePrivate(UUID id) {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .filter(Authentication::isAuthenticated)
                .map(UsernamePasswordAuthenticationToken.class::cast)
                .flatMap(item -> memberRepo.findByName((String) item.getPrincipal()).map(Member::getId))
                .flatMap(item -> notePrivateRepo.findById(id).filter(note -> note.getMember() == item)
                            .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                            .flatMap(is -> notePrivateRepo.deleteById(id)));
    }
}
