package com.amrtm.mynoteapps.backend.configuration.router;

import com.amrtm.mynoteapps.backend.configuration.router.error.ErrorCustom;
import com.amrtm.mynoteapps.backend.configuration.router.other.SingleData;
import com.amrtm.mynoteapps.backend.model.other.Role;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.service.model.user.GroupService;
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
public class GroupRouter {
    private final GroupService groupService;
//    private final Mono<ByteArrayEvent> byteArrayEvent;
//    private final ObjectMapper objectMapper;
//
//    public GroupRouter(GroupService groupService, ByteArrayEventPublisher byteArrayEventPublisher, ObjectMapper objectMapper) {
//        this.groupService = groupService;
//        this.byteArrayEvent = Mono.create(byteArrayEventPublisher).share();
//        this.objectMapper = objectMapper;
//    }

    public Mono<ServerResponse> getAvatar(ServerRequest request) {
        return ServerResponse.ok().contentType(MediaType.IMAGE_JPEG).body(groupService.getAvatar(
                request.queryParam("name").orElse("")
        ).switchIfEmpty(Mono.just(new byte[]{})), byte[].class);
    }

//    public Mono<ServerResponse> getGroup(ServerRequest request) {
//        return ServerResponse.ok().body(groupService.findById(
//                UUID.fromString(request.queryParam("group").orElse(""))
//        ), GroupNoteDTO.class);
//    }

    public Mono<ServerResponse> searchGroup(ServerRequest request) {
        return ServerResponse.ok().body(groupService.findByNameLike(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> searchGroupData(ServerRequest request) {
        return ServerResponse.ok().body(groupService.findByNameLikeData(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> validateNameGroup(ServerRequest request) {
        return ServerResponse.ok().body(groupService.validateName(request.queryParam("name").orElse(""))
                .flatMap(item -> Mono.just(new SingleData<>(item))),SingleData.class);
    }

    public Mono<ServerResponse> notifMemberWillJoin(ServerRequest request) {
        return ServerResponse.ok().body(groupService.findByWaitingStatus(
                UUID.fromString(request.queryParam("group").orElse("")),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> notifMemberRejectJoin(ServerRequest request) {
        return ServerResponse.ok().body(groupService.findByRejectedStatus(
                UUID.fromString(request.queryParam("group").orElse("")),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> memberGroup(ServerRequest request) {
        return ServerResponse.ok().body(groupService.getMemberGroup(
                UUID.fromString(request.queryParam("group").orElse("")),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> updatePassword(ServerRequest request) {
        return groupService.updatePassword(
                UUID.fromString(request.queryParam("group").orElse("")),
                request.queryParam("newPassword").orElse(""),
                request.queryParam("oldPassword").orElse("")
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> updateRolePromoted(ServerRequest request) {
        return groupService.updateRole(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse("")),
                        Role.ADMIN)
                .flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> updateRoleDemoted(ServerRequest request) {
        return groupService.updateRole(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse("")),
                        Role.MEMBER)
                .flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> sendRequest(ServerRequest request) {
        return groupService.sendAggrement(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> confirmAggrement(ServerRequest request) {
        return groupService.confirmAggrement(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> rejectAggrement(ServerRequest request) {
        return groupService.rejectAggrement(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> removeMember(ServerRequest request) {
        return groupService.removeMember(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
            Map<String, Part> data = item.toSingleValueMap();
            try {
                FilePart filePart = (FilePart) data.get("image");
                FormFieldPart group = (FormFieldPart) data.get("data");
                GroupNoteDTO groupdt = new ObjectMapper().readValue(group.value(), GroupNoteDTO.class);
                return groupService.save(groupdt,filePart,false);
            } catch (JsonProcessingException e) {
                return Mono.error(new RuntimeException(e));
            }
        })
            .flatMap(item -> ServerResponse.ok().body(Mono.just(item),GroupNoteDTO.class))
            .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                    ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
            ));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                Map<String, Part> data = item.toSingleValueMap();
                try {
                    FilePart filePart = (FilePart) data.get("image");
                    FormFieldPart group = (FormFieldPart) data.get("data");
                    GroupNoteDTO groupdata = new ObjectMapper().readValue(group.value(), GroupNoteDTO.class);
                    groupdata.setPassword(null);
                    return groupService.save(groupdata,filePart,true);
                } catch (JsonProcessingException e) {
                    return Mono.error(new RuntimeException(e));
                }
            })
            .flatMap(item -> ServerResponse.ok().body(Mono.just(item),GroupNoteDTO.class))
            .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                    ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
            ));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return groupService.deleteById(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }
}
