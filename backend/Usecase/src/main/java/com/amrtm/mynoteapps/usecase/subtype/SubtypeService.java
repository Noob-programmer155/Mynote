package com.amrtm.mynoteapps.usecase.subtype;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.other.Role;
import com.amrtm.mynoteapps.entity.relation.GroupMemberRel;
import com.amrtm.mynoteapps.entity.relation.GroupSubtypeRel;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.entity.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.entity.repository.relation.GroupSubtypeRepoRelation;
import com.amrtm.mynoteapps.entity.repository.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.subtype.impl.Subtype;
import com.amrtm.mynoteapps.entity.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import com.amrtm.mynoteapps.usecase.converter.entity_converter.SubtypeConverter;
import com.amrtm.mynoteapps.usecase.security.AuthValidation;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;
public class SubtypeService<PagingAndSorting> implements SubtypeServiceArc<SubtypeDTO, UUID, PagingAndSorting>{
    private final SubtypeRepoImpl<Subtype,PagingAndSorting> subtypeRepo;
    private final SubtypeConverter subtypeConverter;
    private final GroupSubtypeRepoRelation<GroupSubtypeRel> groupSubtypeRepoRelation;
    private final AuthValidation authValidation;
    private final GroupMemberRepoRelation<GroupMemberRel> groupMemberRepoRelation;
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo;

    public SubtypeService(SubtypeRepoImpl<Subtype,PagingAndSorting> subtypeRepo, SubtypeConverter subtypeConverter, GroupSubtypeRepoRelation<GroupSubtypeRel> groupSubtypeRepoRelation,
                          AuthValidation authValidation, GroupMemberRepoRelation<GroupMemberRel> groupMemberRepoRelation, MemberRepoImpl<Member,PagingAndSorting> memberRepo,
                          NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo) {
        this.subtypeRepo = subtypeRepo;
        this.subtypeConverter = subtypeConverter;
        this.groupSubtypeRepoRelation = groupSubtypeRepoRelation;
        this.authValidation = authValidation;
        this.groupMemberRepoRelation = groupMemberRepoRelation;
        this.memberRepo = memberRepo;
        this.noteCollabRepo = noteCollabRepo;
    }

    @Override
    public Flux<SubtypeDTO> findByGroup(UUID id) {
        return subtypeRepo.findByGroup(id).map(subtypeConverter::convertToWithColor);
    }

    @Override
    public Flux<SubtypeDTO> findByName(String name, PagingAndSorting pageable) {
        return subtypeRepo.findByNameLike(name, pageable).map(subtypeConverter::convertTo);
    }

    @Override
    public Mono<Boolean> updateIndex(Integer indexFrom, Integer indexTo, UUID subtypeFrom, UUID subtypeTo, UUID group) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .then(groupSubtypeRepoRelation.updateIndex(indexTo,group,subtypeFrom))
                .then(groupSubtypeRepoRelation.updateIndex(indexFrom,group,subtypeTo))
                .then(Mono.just(true));
    }

    @Override
    public Mono<SubtypeDTO> updateSubtype(Integer index,UUID oldSubtype,SubtypeDTO newSubtype, UUID group) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .then(groupSubtypeRepoRelation.deleteByParentAndChild(group,oldSubtype)
                        .then(subtypeRepo.findByName(newSubtype.getName()))
                        .switchIfEmpty(subtypeRepo.save(subtypeConverter.deconvert(newSubtype)))
                        .flatMap(newSubtypeDt -> groupSubtypeRepoRelation.save(new GroupSubtypeRel.builder()
                                        .parent(group)
                                        .child(newSubtypeDt.getId())
                                        .index(index)
                                        .color(newSubtype.getColor()).build())
                                .flatMap(rel -> noteCollabRepo.updateSubtypeGroup(rel.getParent(),oldSubtype,rel.getChild()))
                                .then(Mono.just(subtypeConverter.convertTo(newSubtypeDt)))));
    }

    @Override
    public Mono<SubtypeDTO> save(Integer index, SubtypeDTO data, UUID group) {
        return authValidation.getValidation()
                .flatMap(item -> memberRepo.findByName(item).map(Member::getId))
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item)
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> subtypeRepo.findByName(data.getName())
                        .switchIfEmpty(subtypeRepo.save(subtypeConverter.deconvert(data)))
                        .flatMap(subtype -> groupSubtypeRepoRelation.save(new GroupSubtypeRel.builder()
                                .parent(group)
                                .child(subtype.getId())
                                .index(index)
                                .color(data.getColor()).build())
                                .then(Mono.just(subtype)))
                        .map(subtypeConverter::convertTo)
                );
    }

    @Override
    public Mono<Void> removeSubtype(UUID subtype, UUID group) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> noteCollabRepo.deleteByGroupAndSubtype(group,subtype))
                .flatMap(item -> groupSubtypeRepoRelation.deleteByParentAndChild(group,subtype));
    }

    // for test only
    @Override
    public Mono<Void> deleteById(UUID subtype, UUID group) {
        return authValidation.getValidation()
                .flatMap(memberRepo::findByName)
                .flatMap(item -> groupMemberRepoRelation.findByParentAndChild(group,item.getId())
                        .filter(role -> role.getRole() == Role.ADMIN || role.getRole() == Role.MANAGER))
                .switchIfEmpty(Mono.error(new IllegalStateException("you`re not allowed")))
                .flatMap(item -> subtypeRepo.deleteById(subtype));
    }
}
