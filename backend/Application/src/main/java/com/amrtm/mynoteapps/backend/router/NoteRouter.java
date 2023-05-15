package com.amrtm.mynoteapps.backend.router;

import com.amrtm.mynoteapps.entity.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.entity.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Component
public class NoteRouter {
    @Value("${uuid.init}")
    private String initUUID;
    private final com.amrtm.mynoteapps.adapter.router.NoteRouter<Pageable> noteRouter;

    public NoteRouter(com.amrtm.mynoteapps.adapter.router.NoteRouter<Pageable> noteRouter) {
        this.noteRouter = noteRouter;
    }

    public Mono<ServerResponse> searchByTitleInMember(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.searchByTitleInMember(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), NotePrivateDTO.class);
    }

    public Mono<ServerResponse> searchByTitleInGroup(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.searchByTitleInGroup(
                UUID.fromString(request.queryParam("group").orElse("")),
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), NoteCollabDTO.class);
    }

    public Mono<ServerResponse> getCategoryMember(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.getCategoryMember(), SingleData.class);
    }

    public Mono<ServerResponse> getSubtypeGroup(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.getSubtypeGroup(
                UUID.fromString(request.queryParam("group").orElse("")),
                UUID.fromString(request.queryParam("subtype").orElse(""))
        ), NoteCollabDTO.class);
    }

    public Mono<ServerResponse> filterMember(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.filterMember(
                (request.queryParams().get("categories") != null)? request.queryParams().get("categories").stream().toList(): List.of(""),
                (request.queryParams().get("severities") != null)? request.queryParams().get("severities").stream().toList(): List.of(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), NotePrivateDTO.class);
    }

    public Mono<ServerResponse> filterGroup(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.filterGroup(
                UUID.fromString(request.queryParam("group").orElse("")),
                (request.queryParams().get("severities") != null)? request.queryParams().get("severities").stream().toList(): List.of(""),
                (request.queryParams().get("subtypes") != null)?request.queryParams().get("subtypes").stream().map(UUID::fromString).toList(): List.of(UUID.fromString(initUUID)),
                request.queryParam("member").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), NoteCollabDTO.class);
    }

    public Mono<ServerResponse> getSeverityNotePrivate(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.getSeverityNotePrivate(), SingleData.class);
    }

    public Mono<ServerResponse> getSeverityNoteCollab(ServerRequest request) {
        return ServerResponse.ok().body(noteRouter.getSeverityNoteCollab(
                                UUID.fromString(request.queryParam("group").orElse(""))
                        ), SingleData.class);
    }

    public Mono<ServerResponse> saveNotePrivate(ServerRequest request) {
        return request.bodyToMono(NotePrivateDTO.class).flatMap(noteRouter::saveNotePrivate)
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NotePrivateDTO.class));
    }

    public Mono<ServerResponse> saveNoteCollab(ServerRequest request) {
        return request.bodyToMono(NoteCollabDTO.class).flatMap(item -> noteRouter.saveNoteCollab(request.queryParam("group").map(UUID::fromString).orElse(null),item))
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NoteCollabDTO.class));
    }

    public Mono<ServerResponse> updateNotePrivate(ServerRequest request) {
        return request.bodyToMono(NotePrivateDTO.class).flatMap(noteRouter::updateNotePrivate)
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NotePrivateDTO.class));
    }

    public Mono<ServerResponse> updateNoteCollab(ServerRequest request) {
        return request.bodyToMono(NoteCollabDTO.class).flatMap(item -> noteRouter.updateNoteCollab(request.queryParam("group").map(UUID::fromString).orElse(null),item))
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NoteCollabDTO.class));
    }

    public Mono<ServerResponse> deleteNotePrivate(ServerRequest request) {
        return noteRouter.deleteNotePrivate(
                UUID.fromString(request.queryParam("note").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> deleteNoteCollab(ServerRequest request) {
        return noteRouter.deleteNoteCollab(
                        request.queryParam("group").map(UUID::fromString).orElse(null),
                        UUID.fromString(request.queryParam("note").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> deleteNotePrivateByCategory(ServerRequest request) {
        return noteRouter.deleteNotePrivateByCategory(
                        request.queryParam("category").orElse("")
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }
}
