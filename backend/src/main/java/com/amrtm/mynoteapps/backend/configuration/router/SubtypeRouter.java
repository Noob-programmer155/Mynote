package com.amrtm.mynoteapps.backend.configuration.router;

import com.amrtm.mynoteapps.backend.configuration.router.error.ErrorCustom;
import com.amrtm.mynoteapps.backend.configuration.router.other.SingleData;
import com.amrtm.mynoteapps.backend.model.subtype.impl.SubtypeDTO;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.service.model.subtype.SubtypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class SubtypeRouter {
    private final SubtypeService subtypeService;
    public Mono<ServerResponse> getByName(ServerRequest request) {
        return ServerResponse.ok().body(subtypeService.findByNameGroup(
                request.queryParam("name").orElse(""),
                UUID.fromString(request.queryParam("group").orElse("")),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), SubtypeDTO.class);
    }

    public Mono<ServerResponse> searchByName(ServerRequest request) {
        return ServerResponse.ok().body(subtypeService.findByName(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), SubtypeDTO.class);
    }

    public Mono<ServerResponse> addGroup(ServerRequest request) {
        return subtypeService.addSubtype(
                UUID.fromString(request.queryParam("subtype").orElse("")),
                UUID.fromString(request.queryParam("group").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.bodyToMono(SubtypeDTO.class).flatMap(item ->
                subtypeService.save(
                        item,
                        UUID.fromString(request.queryParam("group").orElse("")),
                        false
                )
        )
            .flatMap(item -> ServerResponse.ok().body(Mono.just(item), SubtypeDTO.class))
            .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                    ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
            ));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.bodyToMono(SubtypeDTO.class).flatMap(item ->
                        subtypeService.save(
                                item,
                                UUID.fromString(request.queryParam("group").orElse("")),
                                true
                        )
                )
                .flatMap(item -> ServerResponse.ok().body(Mono.just(item), SubtypeDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> removeGroup(ServerRequest request) {
        return subtypeService.removeSubtype(
                UUID.fromString(request.queryParam("subtype").orElse("")),
                UUID.fromString(request.queryParam("group").orElse(""))
        ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return subtypeService.deleteById(
                UUID.fromString(request.queryParam("subtype").orElse("")),
                UUID.fromString(request.queryParam("group").orElse(""))
        ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }
}
