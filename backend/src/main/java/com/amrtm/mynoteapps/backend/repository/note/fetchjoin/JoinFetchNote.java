package com.amrtm.mynoteapps.backend.repository.note.fetchjoin;

import com.amrtm.mynoteapps.backend.model.note.NoteDTOInterface;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollab;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivate;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.backend.model.subtype.impl.Subtype;
import com.amrtm.mynoteapps.backend.model.user.member.impl.Member;
import com.amrtm.mynoteapps.backend.repository.bindfunction.EntityBindFunctionImpl;
import com.amrtm.mynoteapps.backend.repository.note.NoteCollabRepo;
import com.amrtm.mynoteapps.backend.repository.note.NotePrivateRepo;
import com.amrtm.mynoteapps.backend.repository.subtype.SubtypeRepoImpl;
import com.amrtm.mynoteapps.backend.repository.user.MemberRepoImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

class JoinFetchNotePrivate implements JoinFetchNotePrivateInterface {

    private final NotePrivateRepo notePrivateRepo;
    private final MemberRepoImpl memberRepo;
    private final EntityBindFunctionImpl entityBindFunction;

    public JoinFetchNotePrivate(NotePrivateRepo notePrivateRepo, MemberRepoImpl memberRepo, EntityBindFunctionImpl entityBindFunction) {
        this.notePrivateRepo = notePrivateRepo;
        this.memberRepo = memberRepo;
        this.entityBindFunction = entityBindFunction;
    }

    public Flux<NotePrivateDTO> findByTitleLike(String name, UUID id, Pageable pageable) {
        return notePrivateRepo.findByTitleLike(name,id,pageable).flatMap(item -> {
            if (item != null) {
                Mono<Member> mbr = memberRepo.findById(item.getMember());
                return Mono.zip(Mono.just(item),mbr).map(entityBindFunction::NOTE_PRIVATE_DTO_BINDING);
            } else
                return Flux.empty();
        });
    }

    public Flux<NotePrivateDTO> findByFilterPrivate(List<String> category, List<String> severity, UUID member, Pageable pageable) {
        return notePrivateRepo.findByFilter(category,severity,member,pageable).distinctUntilChanged(NotePrivate::getId).flatMap(item -> {
            if (item != null) {
                Mono<Member> mbr = memberRepo.findById(item.getMember());
                return Mono.zip(Mono.just(item),mbr).map(entityBindFunction::NOTE_PRIVATE_DTO_BINDING);
            } else
                return Flux.empty();
        });
    }
}

class JoinFetchNoteCollab implements JoinFetchNoteCollabInterface{
    private final NoteCollabRepo noteCollabRepo;
    private final SubtypeRepoImpl subtypeRepo;
    private final MemberRepoImpl memberRepo;
    private final EntityBindFunctionImpl entityBindFunction;

    public JoinFetchNoteCollab(NoteCollabRepo noteCollabRepo, SubtypeRepoImpl subtypeRepo, MemberRepoImpl memberRepo, EntityBindFunctionImpl entityBindFunction) {
        this.noteCollabRepo = noteCollabRepo;
        this.subtypeRepo = subtypeRepo;
        this.memberRepo = memberRepo;
        this.entityBindFunction = entityBindFunction;
    }

    public Flux<NoteCollabDTO> findByTitleLikeAndGroupMember(String name, UUID member, UUID group, Pageable pageable) {
        return noteCollabRepo.findByTitleLikeAndGroupMember(name, member, group, pageable).flatMap(item -> {
            if (item != null) {
                Mono<Subtype> sub = subtypeRepo.findById(item.getSubtype());
                Mono<Member> mbr = memberRepo.findById(item.getMember());
                return Mono.zip(Mono.just(item),sub,mbr).map(entityBindFunction::NOTE_COLLAB_DTO_BINDING);
            } else
                return Flux.empty();
        });
    }

    public Flux<NoteCollabDTO> findByFilterGroupMember(List<String> severity, List<UUID> subtype, UUID member, UUID group, Pageable pageable) {
        return noteCollabRepo.findByFilterGroupMember(severity,subtype,member,group,pageable).distinctUntilChanged(NoteCollab::getId).flatMap(item -> {
            if (item != null) {
                Mono<Subtype> sub = subtypeRepo.findById(item.getSubtype());
                Mono<Member> mbr = memberRepo.findById(item.getMember());
                return Mono.zip(Mono.just(item),sub,mbr).map(entityBindFunction::NOTE_COLLAB_DTO_BINDING);
            } else
                return Flux.empty();
        });
    }
}

@Component
public class JoinFetchNote{
    private final JoinFetchNotePrivate joinFetchNotePrivate;
    private final JoinFetchNoteCollab joinFetchNoteCollab;
    public JoinFetchNote(NotePrivateRepo notePrivateRepo, NoteCollabRepo noteCollabRepo, SubtypeRepoImpl subtypeRepo, MemberRepoImpl memberRepo, EntityBindFunctionImpl entityBindFunction) {
        this.joinFetchNotePrivate = new JoinFetchNotePrivate(notePrivateRepo, memberRepo, entityBindFunction);
        this.joinFetchNoteCollab = new JoinFetchNoteCollab(noteCollabRepo, subtypeRepo, memberRepo, entityBindFunction);
    }

    @SuppressWarnings("unchecked")
    public <T extends NoteDTOInterface> Flux<T> findByTitleLike(String name, UUID member, UUID group, Pageable pageable) {
        if (group == null)
            return (Flux<T>) joinFetchNotePrivate.findByTitleLike(name, member, pageable);
        else
            return (Flux<T>) joinFetchNoteCollab.findByTitleLikeAndGroupMember(name, member, group, pageable);
    }

    public Flux<NotePrivateDTO> findByFilterPrivate(List<String> category, List<String> severity, UUID member, Pageable pageable) {
        return joinFetchNotePrivate.findByFilterPrivate(category, severity, member, pageable);
    }

    public Flux<NoteCollabDTO> findByFilterGroupMember(List<String> severity, List<UUID> subtype, UUID member, UUID group, Pageable pageable) {
        return joinFetchNoteCollab.findByFilterGroupMember(severity, subtype, member, group, pageable);
    }
}
