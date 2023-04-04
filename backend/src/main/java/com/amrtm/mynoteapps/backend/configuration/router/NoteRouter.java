package com.amrtm.mynoteapps.backend.configuration.router;

import com.amrtm.mynoteapps.backend.configuration.router.error.ErrorCustom;
import com.amrtm.mynoteapps.backend.configuration.router.other.SingleData;
import com.amrtm.mynoteapps.backend.model.note.collab_note.impl.NoteCollabDTO;
import com.amrtm.mynoteapps.backend.model.note.private_note.impl.NotePrivateDTO;
import com.amrtm.mynoteapps.backend.service.model.note.NoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class NoteRouter {
    private final NoteService noteService;
    @Value("${uuid.init}")
    private String initUUID;

    public Mono<ServerResponse> searchByTitleInMember(ServerRequest request) {
        return ServerResponse.ok().body(noteService.findByTitleMember(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10"))
                        , Sort.Direction.DESC
                        , "lastModifiedDate"
                )
        ), NotePrivateDTO.class);
    }

    public Mono<ServerResponse> searchByTitleInGroup(ServerRequest request) {
        return ServerResponse.ok().body(noteService.findByTitleGroup(
                UUID.fromString(request.queryParam("member").orElse(initUUID)),
                UUID.fromString(request.queryParam("group").orElse("")),
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10"))
                        , Sort.Direction.DESC
                        , "lastModifiedDate"
                )
        ), NoteCollabDTO.class);
    }

    public Mono<ServerResponse> filterMember(ServerRequest request) {
        return ServerResponse.ok().body(noteService.filterMember(
                (request.queryParams().get("categories") != null)? request.queryParams().get("categories").stream().toList(): List.of(""),
                (request.queryParams().get("severities") != null)? request.queryParams().get("severities").stream().toList(): List.of(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10"))
                        , Sort.Direction.DESC
                        , "lastModifiedDate"
                )
        ), NotePrivateDTO.class);
    }

    public Mono<ServerResponse> filterGroup(ServerRequest request) {
        return ServerResponse.ok().body(noteService.filterGroup(
                (request.queryParams().get("severities") != null)? request.queryParams().get("severities").stream().toList(): List.of(""),
                (request.queryParams().get("subtypes") != null)?request.queryParams().get("subtypes").stream().map(UUID::fromString).toList(): List.of(UUID.fromString(initUUID)),
                UUID.fromString(request.queryParam("member").orElse(initUUID)),
                UUID.fromString(request.queryParam("group").orElse("")),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10"))
                        , Sort.Direction.DESC
                        , "lastModifiedDate"
                )
        ), NoteCollabDTO.class);
    }

    public Mono<ServerResponse> saveNotePrivate(ServerRequest request) {
        return request.bodyToMono(NotePrivateDTO.class).flatMap(item -> noteService.saveNotePrivate(item,false))
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NotePrivateDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> saveNoteCollab(ServerRequest request) {
        return request.bodyToMono(NoteCollabDTO.class).flatMap(item -> noteService.saveNoteCollab(item,request.queryParam("group").map(UUID::fromString).orElse(null),false))
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NoteCollabDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> updateNotePrivate(ServerRequest request) {
        return request.bodyToMono(NotePrivateDTO.class).flatMap(item -> noteService.saveNotePrivate(item,true))
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NotePrivateDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> updateNoteCollab(ServerRequest request) {
        return request.bodyToMono(NoteCollabDTO.class).flatMap(item -> noteService.saveNoteCollab(item,request.queryParam("group").map(UUID::fromString).orElse(null),true))
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), NoteCollabDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> deleteNotePrivate(ServerRequest request) {
        return noteService.deleteNotePrivate(
                UUID.fromString(request.queryParam("note").orElse(""))
        ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> deleteNoteCollab(ServerRequest request) {
        return noteService.deleteNoteCollab(
                        UUID.fromString(request.queryParam("note").orElse("")),
                        request.queryParam("group").map(UUID::fromString).orElse(null)
                ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }
}
