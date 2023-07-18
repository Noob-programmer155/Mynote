package com.amrtm.mynoteapps.backend.router;

import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.model.subtype.impl.SubtypeDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Component
public class SubtypeRouter {
    private final com.amrtm.mynoteapps.adapter.router.SubtypeRouter<Pageable> subtypeRouter;

    public SubtypeRouter(com.amrtm.mynoteapps.adapter.router.SubtypeRouter<Pageable> subtypeRouter) {
        this.subtypeRouter = subtypeRouter;
    }

    public Mono<ServerResponse> getByGroup(ServerRequest request) {
        return ServerResponse.ok().body(subtypeRouter.getByGroup(
                UUID.fromString(request.queryParam("group").orElse(""))
        ), SubtypeDTO.class);
    }

    public Mono<ServerResponse> searchByName(ServerRequest request) {
        return ServerResponse.ok().body(subtypeRouter.searchByName(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), SubtypeDTO.class);
    }

    public Mono<ServerResponse> updateIndex(ServerRequest request) {
        return subtypeRouter.updateIndex(
                        Integer.parseInt(request.queryParam("indexFrom").orElse("0")),
                        Integer.parseInt(request.queryParam("indexTo").orElse("0")),
                        UUID.fromString(request.queryParam("subtypeFrom").orElse("")),
                        UUID.fromString(request.queryParam("subtypeTo").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.bodyToMono(SubtypeDTO.class).flatMap(item ->
                subtypeRouter.update(
                        Integer.parseInt(request.queryParam("index").orElse("0")),
                        UUID.fromString(request.queryParam("oldSubtype").orElse("")),
                        item,
                        UUID.fromString(request.queryParam("group").orElse(""))
                )
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SubtypeDTO.class));
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.bodyToMono(SubtypeDTO.class).flatMap(item ->
                subtypeRouter.save(
                        Integer.parseInt(request.queryParam("index").orElse("0")),
                        item,
                        UUID.fromString(request.queryParam("group").orElse(""))
                )
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SubtypeDTO.class));
    }

    public Mono<ServerResponse> removeGroup(ServerRequest request) {
        return subtypeRouter.removeGroup(
                UUID.fromString(request.queryParam("group").orElse("")),
                UUID.fromString(request.queryParam("subtype").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return subtypeRouter.delete(
                UUID.fromString(request.queryParam("group").orElse("")),
                UUID.fromString(request.queryParam("subtype").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }
}
