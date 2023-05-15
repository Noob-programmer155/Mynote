package com.amrtm.mynoteapps.usecase.note;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.entity.note.NoteDTOInterface;
import com.amrtm.mynoteapps.entity.other.utils.Tuple2;
import com.amrtm.mynoteapps.entity.other.utils.Tuple3;
import com.amrtm.mynoteapps.entity.repository.bindfunction.EntityBindFunctionImpl;
import com.amrtm.mynoteapps.entity.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.entity.repository.note.NotePrivateRepo;
import com.amrtm.mynoteapps.entity.repository.note.fetchjoin.JoinFetchNoteCollabInterface;
import com.amrtm.mynoteapps.entity.repository.note.fetchjoin.JoinFetchNotePrivateInterface;
import com.amrtm.mynoteapps.entity.repository.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.entity.repository.user.MemberRepoImpl;
import com.amrtm.mynoteapps.entity.subtype.impl.Subtype;
import com.amrtm.mynoteapps.entity.user.member.impl.Member;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;


import java.util.List;
import java.util.UUID;

class JoinFetchNotePrivate<PagingAndSorting> implements JoinFetchNotePrivateInterface<PagingAndSorting> {

    private final NotePrivateRepo<NotePrivate,PagingAndSorting> notePrivateRepo;
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final EntityBindFunctionImpl entityBindFunction;

    public JoinFetchNotePrivate(NotePrivateRepo<NotePrivate,PagingAndSorting> notePrivateRepo, MemberRepoImpl<Member,PagingAndSorting> memberRepo, EntityBindFunctionImpl entityBindFunction) {
        this.notePrivateRepo = notePrivateRepo;
        this.memberRepo = memberRepo;
        this.entityBindFunction = entityBindFunction;
    }

    public Flux<NotePrivateDTO> findByTitleLike(String name, UUID id, PagingAndSorting pageable) {
        return memberRepo.findById(id).flatMapMany(member -> notePrivateRepo.findByTitleLike(name,member.getId(),pageable).flatMap(item -> {
            if (item != null) {
                return Mono.zip(Mono.just(item),Mono.just(member)).map(data -> entityBindFunction.NOTE_PRIVATE_DTO_BINDING(new Tuple2<>(data.getT1(),data.getT2())));
            } else
                return Flux.empty();
        }));
    }

    public Flux<NotePrivateDTO> findByFilterPrivate(List<String> category, List<String> severity, UUID member, PagingAndSorting pageable) {
        return memberRepo.findById(member).flatMapMany(memberItem -> notePrivateRepo.findByFilter(category,severity,member,pageable).distinctUntilChanged(NotePrivate::getId).flatMap(item -> {
            if (item != null) {
                return Mono.zip(Mono.just(item),Mono.just(memberItem)).map(data -> entityBindFunction.NOTE_PRIVATE_DTO_BINDING(new Tuple2<>(data.getT1(),data.getT2())));
            } else
                return Flux.empty();
        }));
    }
}

class JoinFetchNoteCollab<PagingAndSorting> implements JoinFetchNoteCollabInterface<PagingAndSorting> {
    private final NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo;
    private final SubtypeRepoImpl<Subtype,PagingAndSorting> subtypeRepo;
    private final MemberRepoImpl<Member,PagingAndSorting> memberRepo;
    private final EntityBindFunctionImpl entityBindFunction;

    public JoinFetchNoteCollab(NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo, SubtypeRepoImpl<Subtype,PagingAndSorting> subtypeRepo,
                               MemberRepoImpl<Member,PagingAndSorting> memberRepo, EntityBindFunctionImpl entityBindFunction) {
        this.noteCollabRepo = noteCollabRepo;
        this.subtypeRepo = subtypeRepo;
        this.memberRepo = memberRepo;
        this.entityBindFunction = entityBindFunction;
    }

    @Override
    public Flux<NoteCollabDTO> findBySubtype(UUID subtype, UUID group) {
        return subtypeRepo.findById(subtype).flatMapMany(subtypeItem -> noteCollabRepo.findBySubtype(subtype, group).flatMap(item -> {
                if (item != null) {
                    Mono<Member> mbr = memberRepo.findById(item.getMember());
                    return Mono.zip(Mono.just(item), Mono.just(subtypeItem), mbr).map(data -> entityBindFunction.NOTE_COLLAB_DTO_BINDING(new Tuple3<>(data.getT1(),data.getT2(),data.getT3())));
                } else
                    return Flux.empty();
            }));
    }

    public Flux<NoteCollabDTO> findByTitleLikeAndGroup(String name, UUID group, PagingAndSorting pageable) {
        return noteCollabRepo.findByTitleLikeAndGroupMember(name, group, pageable).flatMap(item -> {
            if (item != null) {
                Mono<Subtype> sub = subtypeRepo.findById(item.getSubtype());
                Mono<Member> member = memberRepo.findById(item.getMember());
                return Mono.zip(Mono.just(item),sub,member).map(data -> entityBindFunction.NOTE_COLLAB_DTO_BINDING(new Tuple3<>(data.getT1(),data.getT2(),data.getT3())));
            } else
                return Flux.empty();
        });
    }

    public Flux<NoteCollabDTO> findByFilterGroupMember(List<String> severity, List<UUID> subtype, String member, UUID group, PagingAndSorting pageable) {
        return noteCollabRepo.findByFilterGroupMember(severity,subtype,member,group,pageable).distinctUntilChanged(NoteCollab::getId).flatMap(item -> {
            if (item != null) {
                Mono<Subtype> sub = subtypeRepo.findById(item.getSubtype());
                Mono<Member> mbr = memberRepo.findById(item.getMember());
                return Mono.zip(Mono.just(item),sub,mbr).map(data -> entityBindFunction.NOTE_COLLAB_DTO_BINDING(new Tuple3<>(data.getT1(),data.getT2(),data.getT3())));
            } else
                return Flux.empty();
        });
    }
}


public class JoinFetchNote<PagingAndSorting>{
    private final JoinFetchNotePrivate<PagingAndSorting> joinFetchNotePrivate;
    private final JoinFetchNoteCollab<PagingAndSorting> joinFetchNoteCollab;
    public JoinFetchNote(NotePrivateRepo<NotePrivate,PagingAndSorting> notePrivateRepo, NoteCollabRepo<NoteCollab,PagingAndSorting> noteCollabRepo,
                         SubtypeRepoImpl<Subtype,PagingAndSorting> subtypeRepo, MemberRepoImpl<Member,PagingAndSorting> memberRepo, EntityBindFunctionImpl entityBindFunction) {
        this.joinFetchNotePrivate = new JoinFetchNotePrivate<>(notePrivateRepo, memberRepo, entityBindFunction);
        this.joinFetchNoteCollab = new JoinFetchNoteCollab<>(noteCollabRepo, subtypeRepo, memberRepo, entityBindFunction);
    }

    @SuppressWarnings("unchecked")
    public <T extends NoteDTOInterface> Flux<T> findByTitleLike(String name, UUID member, UUID group, PagingAndSorting pageable) {
        if (group == null)
            return (Flux<T>) joinFetchNotePrivate.findByTitleLike(name, member, pageable);
        else
            return (Flux<T>) joinFetchNoteCollab.findByTitleLikeAndGroup(name, group, pageable);
    }

    public Flux<NoteCollabDTO> findBySubtypeGroup(UUID subtype, UUID group) {
        return joinFetchNoteCollab.findBySubtype(subtype, group);
    }

    public Flux<NotePrivateDTO> findByFilterPrivate(List<String> category, List<String> severity, UUID member, PagingAndSorting pageable) {
        return joinFetchNotePrivate.findByFilterPrivate(category, severity, member, pageable);
    }

    public Flux<NoteCollabDTO> findByFilterGroupMember(List<String> severity, List<UUID> subtype, String member, UUID group, PagingAndSorting pageable) {
        return joinFetchNoteCollab.findByFilterGroupMember(severity, subtype, member, group, pageable);
    }
}
