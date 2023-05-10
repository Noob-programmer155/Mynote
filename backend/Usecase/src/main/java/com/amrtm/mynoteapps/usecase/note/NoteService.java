package com.amrtm.mynoteapps.usecase.note;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.entity.repository.note.NotePrivateRepo;
import com.amrtm.mynoteapps.entity.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import com.amrtm.mynoteapps.entity.other.obj.Category;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.NoteCollabConverter;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.NotePrivateConverter;
import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@SuppressWarnings("unchecked")
public class NoteService implements NoteServiceArc {
    private final NotePrivateRepo notePrivateRepo;
    private final NoteCollabRepo noteCollabRepo;
    private final JoinFetchNote joinFetchNote;
    private final AuthValidation authValidation;
    private final NoteCollabConverter noteCollabConverter;
    private final NotePrivateConverter notePrivateConverter;
    private final MemberRepoImpl memberRepo;
    private final GroupMemberRepoRelation groupMemberRepoRelation;

    public NoteService(NotePrivateRepo notePrivateRepo, NoteCollabRepo noteCollabRepo, JoinFetchNote joinFetchNote, AuthValidation authValidation, NoteCollabConverter noteCollabConverter, NotePrivateConverter notePrivateConverter, MemberRepoImpl memberRepo, GroupMemberRepoRelation groupMemberRepoRelation) {
        this.notePrivateRepo = notePrivateRepo;
        this.noteCollabRepo = noteCollabRepo;
        this.joinFetchNote = joinFetchNote;
        this.authValidation = authValidation;
        this.noteCollabConverter = noteCollabConverter;
        this.notePrivateConverter = notePrivateConverter;
        this.memberRepo = memberRepo;
        this.groupMemberRepoRelation = groupMemberRepoRelation;
    }

    @Override
    public Flux<NotePrivateDTO> findByTitleMember(String name, Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> joinFetchNote.findByTitleLike(name,item,null,pageable));
    }

    public Flux<Category> getCategoryMember() {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(notePrivateRepo::findCategoryByMember);
    }

    public Flux<NoteCollabDTO> findBySubtype(UUID subtype, UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .switchIfEmpty(Mono.error(new IllegalStateException("You cannot add note, because you`re not a member")))
                .flatMapMany(item -> joinFetchNote.findBySubtypeGroup(subtype, group));
    }

    public Flux<Severity> getSeverityMember() {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(notePrivateRepo::findSeverityByMember);
    }

    public Flux<Severity> getSeverityGroup(UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .switchIfEmpty(Mono.error(new IllegalStateException("You cannot add note, because you`re not a member")))
                .flatMapMany(item -> noteCollabRepo.findSeverityByGroup(group));
    }

    @Override
    public Flux<NoteCollabDTO> findByTitleGroup(UUID group, String title, Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .switchIfEmpty(Mono.error(new IllegalStateException("You cannot add note, because you`re not a member")))
                .flatMapMany(item -> joinFetchNote.findByTitleLike(title, null, group, pageable));
    }

    @Override
    public Flux<NotePrivateDTO> filterMember(List<String> category, List<String> severity, Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> joinFetchNote.findByFilterPrivate(category,severity,item,pageable));
    }

    @Override
    public Flux<NoteCollabDTO> filterGroup(List<String> severity,List<UUID> subtypeDTOS, String member, UUID group, Pageable pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .switchIfEmpty(Mono.error(new IllegalStateException("You cannot add note, because you`re not a member")))
                .flatMapMany(item -> joinFetchNote.findByFilterGroupMember(severity, subtypeDTOS, member, group, pageable));
    }

    @Override
    public Mono<NoteCollabDTO> saveNoteCollab(NoteCollabDTO data, UUID group, boolean update) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .doOnNext(item -> data.setMember(new MemberDTO.builder().id(item).build()))
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
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .doOnNext(item -> data.setMember(new MemberDTO.builder().id(item).build()))
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
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                            .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                            .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                            .flatMap(rel -> noteCollabRepo.deleteById(id))
                );
    }

    @Override
    public Mono<Void> deleteNotePrivate(UUID id) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> notePrivateRepo.findById(id).filter(note -> note.getMember() == item)
                            .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                            .flatMap(is -> notePrivateRepo.deleteById(id)));
    }

    @Override
    public Mono<Void> deleteNoteByCategory(String category) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .filter(item -> !category.isBlank())
                .switchIfEmpty(Mono.error(new IllegalStateException("category must be filled !!!")))
                .flatMap(item -> notePrivateRepo.deleteByCategory(category, item));
    }
}
