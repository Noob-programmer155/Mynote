package com.amrtm.mynoteapps.backend.router;

import com.amrtm.mynoteapps.backend.configuration.converter.DataBufferMultipartToByteArray;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.theme.impl.ThemeDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FormFieldPart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@Component
public class ThemeRouter {
    private final com.amrtm.mynoteapps.adapter.router.ThemeRouter<Pageable> themeRouter;

    public ThemeRouter(com.amrtm.mynoteapps.adapter.router.ThemeRouter<Pageable> themeRouter) {
        this.themeRouter = themeRouter;
    }

    public Mono<ServerResponse> getAvatar(ServerRequest request) {
        return ServerResponse.ok().contentType(MediaType.IMAGE_JPEG).body(themeRouter.getAvatar(
                request.queryParam("name").orElse("")
        ), byte[].class);
    }

    public Mono<ServerResponse> searchByName(ServerRequest request) {
        return ServerResponse.ok().body(themeRouter.searchByName(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> searchByNameData(ServerRequest request) {
        return ServerResponse.ok().body(themeRouter.searchByNameData(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), ThemeDTO.class);
    }

    public Mono<ServerResponse> getByNameInMember(ServerRequest request) {
        return ServerResponse.ok().body(themeRouter.getByNameInMember(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> getByNameDataInMember(ServerRequest request) {
        return ServerResponse.ok().body(themeRouter.getByNameDataInMember(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), ThemeDTO.class);
    }

    public Mono<ServerResponse> validateNameTheme(ServerRequest request) {
        return ServerResponse.ok().body(themeRouter.validateNameTheme(request.queryParam("name").orElse("")), SingleData.class);
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                    Map<String, Part> data = item.toSingleValueMap();
                    try {
                        FilePart filePart = (FilePart) data.get("image");
                        FormFieldPart theme = (FormFieldPart) data.get("data");
                        ThemeDTO themeDTO = new ObjectMapper().registerModule(new JavaTimeModule()).readValue(theme.value(), ThemeDTO.class);
                        return DataBufferMultipartToByteArray.transform(filePart).flatMap(databytes -> themeRouter.save(themeDTO,
                                databytes.getT1(), databytes.getT2(), databytes.getT3(), databytes.getT4()));
                    } catch (JsonProcessingException e) {
                        return Mono.error(new IllegalArgumentException(e));
                    }
                }).flatMap(item -> ServerResponse.ok().body(Mono.just(item), ThemeDTO.class));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                    Map<String, Part> data = item.toSingleValueMap();
                    try {
                        FilePart filePart = (FilePart) data.get("image");
                        FormFieldPart theme = (FormFieldPart) data.get("data");
                        ThemeDTO themeDTO = new ObjectMapper().registerModule(new JavaTimeModule()).readValue(theme.value(), ThemeDTO.class);
                        return DataBufferMultipartToByteArray.transform(filePart).flatMap(databytes -> themeRouter.update(themeDTO,
                                databytes.getT1(), databytes.getT2(), databytes.getT3(), databytes.getT4()));
                    } catch (JsonProcessingException e) {
                        return Mono.error(new IllegalArgumentException(e));
                    }
                }).flatMap(item -> ServerResponse.ok().body(Mono.just(item), ThemeDTO.class));
    }

    public Mono<ServerResponse> activateTheme(ServerRequest request) {
        return themeRouter.activateTheme(
                        UUID.fromString(request.queryParam("theme").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> addRelationMember(ServerRequest request) {
        return themeRouter.addRelationMember(
                UUID.fromString(request.queryParam("theme").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> removeRelationMember(ServerRequest request) {
        return themeRouter.removeRelationMember(
                UUID.fromString(request.queryParam("theme").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return themeRouter.delete(
                UUID.fromString(request.queryParam("theme").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }
}
