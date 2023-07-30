package com.amrtm.mynoteapps.usecase.note;

import com.amrtm.mynoteapps.entity.model.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.other.obj.Severity;
import com.amrtm.mynoteapps.entity.model.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.model.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.entity.model.relation.SubtypeNoteRel;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.entity.repository.note.NotePrivateRepo;
import com.amrtm.mynoteapps.entity.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.entity.repository.relation.GroupSubtypeRepoRelation;
import com.amrtm.mynoteapps.entity.repository.relation.SubtypeNoteRepoRelation;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.model.user.member.impl.Member;
import com.amrtm.mynoteapps.entity.other.obj.Category;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.NoteCollabConverter;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.NotePrivateConverter;
import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@SuppressWarnings("unchecked")
public class NoteService<PagingAndSorting> implements NoteServiceArc<PagingAndSorting> {
    private final NotePrivateRepo<NotePrivate,PagingAndSorting> notePrivateRepo;
    private final NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo;
    private final JoinFetchNote<PagingAndSorting> joinFetchNote;
    private final AuthValidation authValidation;
    private final NoteCollabConverter noteCollabConverter;
    private final NotePrivateConverter notePrivateConverter;
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final GroupMemberRepoRelation<GroupMemberRel> groupMemberRepoRelation;
    private final GroupSubtypeRepoRelation<GroupSubtypeRel> groupSubtypeRepoRelation;
    private final SubtypeNoteRepoRelation<SubtypeNoteRel> subtypeNoteRepoRelation;

    public NoteService(NotePrivateRepo<NotePrivate,PagingAndSorting> notePrivateRepo, NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo,
                       JoinFetchNote<PagingAndSorting> joinFetchNote, AuthValidation authValidation, NoteCollabConverter noteCollabConverter, NotePrivateConverter notePrivateConverter,
                       MemberRepoImpl<Member,PagingAndSorting> memberRepo, GroupMemberRepoRelation<GroupMemberRel> groupMemberRepoRelation, GroupSubtypeRepoRelation<GroupSubtypeRel> groupSubtypeRepoRelation,
                       SubtypeNoteRepoRelation<SubtypeNoteRel> subtypeNoteRepoRelation) {
        this.notePrivateRepo = notePrivateRepo;
        this.noteCollabRepo = noteCollabRepo;
        this.joinFetchNote = joinFetchNote;
        this.authValidation = authValidation;
        this.noteCollabConverter = noteCollabConverter;
        this.notePrivateConverter = notePrivateConverter;
        this.memberRepo = memberRepo;
        this.groupMemberRepoRelation = groupMemberRepoRelation;
        this.groupSubtypeRepoRelation = groupSubtypeRepoRelation;
        this.subtypeNoteRepoRelation = subtypeNoteRepoRelation;
    }

    @Override
    public Flux<NotePrivateDTO> findByTitleMember(String name, PagingAndSorting pageable) {
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
                .switchIfEmpty(Mono.error(new IllegalAccessException("You cannot add note, because you`re not a member")))
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
                .switchIfEmpty(Mono.error(new IllegalAccessException("You cannot add note, because you`re not a member")))
                .flatMapMany(item -> noteCollabRepo.findSeverityByGroup(group));
    }

    @Override
    public Flux<NoteCollabDTO> findByTitleGroup(UUID group, String title, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .switchIfEmpty(Mono.error(new IllegalAccessException("You cannot get note, because you`re not a member")))
                .flatMapMany(item -> joinFetchNote.findByTitleLike(title, null, group, pageable));
    }

    @Override
    public Flux<NotePrivateDTO> filterMember(List<String> category, List<String> severity, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMapMany(item -> joinFetchNote.findByFilterPrivate(category,severity,item,pageable));
    }

    @Override
    public Flux<NoteCollabDTO> filterGroup(List<String> severity,List<UUID> subtypeDTOS, String member, UUID group, PagingAndSorting pageable) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item).hasElement())
                .filter(item -> item)
                .switchIfEmpty(Mono.error(new IllegalAccessException("You cannot get note, because you`re not a member")))
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
                .switchIfEmpty(Mono.error(new IllegalAccessException("You cannot add note, because you`re not a member")))
                .flatMap(item -> {
                    if (update)
                        return noteCollabRepo.findById(data.getId()).flatMap(note -> {
                                    if(data.getSubtype() != null && !note.getSubtype().equals(data.getSubtype().getId()))
                                        return groupSubtypeRepoRelation.findByParentAndChild(group,note.getSubtype())
                                                    .flatMap(rel -> subtypeNoteRepoRelation.deleteByParentAndChild(rel.getId(),note.getId()))
                                                    .then(
                                                            groupSubtypeRepoRelation.findByParentAndChild(group,data.getSubtype().getId())
                                                                    .flatMap(rel -> subtypeNoteRepoRelation.save(new SubtypeNoteRel.builder()
                                                                            .parent(rel.getId())
                                                                            .child(note.getId())
                                                                            .build()))
                                                    ).then(noteCollabRepo.save(noteCollabConverter.deconvert(data, note)));
                                    else
                                        return noteCollabRepo.save(noteCollabConverter.deconvert(data, note));
                                })
                                .map(noteCollabConverter::convertTo);
                    else {
                        if (data.getSubtype() != null) {
                            return noteCollabRepo.save(noteCollabConverter.deconvert(data))
                                    .flatMap(noteCollab -> groupSubtypeRepoRelation.findByParentAndChild(group,data.getSubtype().getId())
                                            .flatMap(rel -> subtypeNoteRepoRelation.save(new SubtypeNoteRel.builder()
                                                    .parent(rel.getId())
                                                    .child(noteCollab.getId())
                                                    .build())).then(Mono.just(noteCollab))
                                    )
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
                .flatMap(item -> {
                    if (update)
                        return notePrivateRepo.findById(data.getId()).flatMap(note ->
                                        notePrivateRepo.save(notePrivateConverter.deconvert(data, note)))
                                .map(notePrivateConverter::convertTo);
                    else
                        return notePrivateRepo.save(notePrivateConverter.deconvert(data,item))
                                .map(notePrivateConverter::convertTo);
                });
    }

    @Override
    public Mono<Void> deleteNoteCollab(UUID id, UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                            .switchIfEmpty(Mono.error(new IllegalAccessException("You cannot add note, because you`re not a member")))
                            .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER)
                            .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
                            .flatMap(rel -> noteCollabRepo.deleteById(id))
                );
    }

    @Override
    public Mono<Void> deleteNotePrivate(UUID id) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> notePrivateRepo.findById(id).filter(note -> note.getMember().equals(item))
                            .switchIfEmpty(Mono.error(new IllegalAccessException("you`re not allowed")))
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
