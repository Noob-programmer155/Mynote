package com.amrtm.mynoteapps.backend.configuration.router;

import com.amrtm.mynoteapps.backend.configuration.router.error.ErrorCustom;
import com.amrtm.mynoteapps.backend.configuration.router.other.SingleData;
import com.amrtm.mynoteapps.backend.model.theme.impl.ThemeDTO;
import com.amrtm.mynoteapps.backend.service.model.theme.ThemeService;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
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
@RequiredArgsConstructor
public class ThemeRouter {
    private final ThemeService themeService;
    public Mono<ServerResponse> getAvatar(ServerRequest request) {
        return ServerResponse.ok().contentType(MediaType.IMAGE_JPEG).body(themeService.getAvatar(
                request.queryParam("name").orElse("")
        ).switchIfEmpty(Mono.just(new byte[]{})), byte[].class);
    }

    public Mono<ServerResponse> searchByName(ServerRequest request) {
        return ServerResponse.ok().body(themeService.findByNameLike(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> searchByNameData(ServerRequest request) {
        return ServerResponse.ok().body(themeService.findByNameLikeSearch(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), ThemeDTO.class);
    }

    public Mono<ServerResponse> getByNameInMember(ServerRequest request) {
        return ServerResponse.ok().body(themeService.findByNameLikeMember(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> getByNameDataInMember(ServerRequest request) {
        return ServerResponse.ok().body(themeService.findByNameLikeSearchMember(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), ThemeDTO.class);
    }

    public Mono<ServerResponse> validateNameTheme(ServerRequest request) {
        return ServerResponse.ok().body(themeService.validateName(request.queryParam("name").orElse(""))
                        .flatMap(item -> Mono.just(new SingleData<>(item))),SingleData.class);
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                    Map<String, Part> data = item.toSingleValueMap();
                    try {
                        FilePart filePart = (FilePart) data.get("image");
                        FormFieldPart theme = (FormFieldPart) data.get("data");
                        ThemeDTO themeDTO = new ObjectMapper().readValue(theme.value(), ThemeDTO.class);
                        return themeService.save(themeDTO,filePart,false);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                }).flatMap(item -> ServerResponse.ok().body(Mono.just(item), ThemeDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                    Map<String, Part> data = item.toSingleValueMap();
                    try {
                        FilePart filePart = (FilePart) data.get("image");
                        FormFieldPart theme = (FormFieldPart) data.get("data");
                        ThemeDTO themeDTO = new ObjectMapper().readValue(theme.value(), ThemeDTO.class);
                        return themeService.save(themeDTO,filePart,true);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                }).flatMap(item -> ServerResponse.ok().body(Mono.just(item), ThemeDTO.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> addRelationMember(ServerRequest request) {
        return themeService.addNewTheme(
                UUID.fromString(request.queryParam("theme").orElse(""))
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> removeRelationMember(ServerRequest request) {
        return themeService.removeTheme(
                UUID.fromString(request.queryParam("theme").orElse(""))
        ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return themeService.deleteById(
                UUID.fromString(request.queryParam("theme").orElse(""))
        ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }
}
