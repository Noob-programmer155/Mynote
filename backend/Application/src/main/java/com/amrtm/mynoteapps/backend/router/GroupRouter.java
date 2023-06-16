package com.amrtm.mynoteapps.backend.router;

import com.amrtm.mynoteapps.backend.configuration.converter.DataBufferMultipartToByteArray;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.entity.user.member.impl.MemberDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
public class GroupRouter {
    private final com.amrtm.mynoteapps.adapter.router.GroupRouter<Pageable> groupRouter;

    public GroupRouter(com.amrtm.mynoteapps.adapter.router.GroupRouter<Pageable> groupRouter) {
        this.groupRouter = groupRouter;
    }
//    private final Mono<ByteArrayEvent> byteArrayEvent;
//    private final ObjectMapper objectMapper;
//
//    public GroupRouter(GroupService groupService, ByteArrayEventPublisher byteArrayEventPublisher, ObjectMapper objectMapper) {
//        this.groupService = groupService;
//        this.byteArrayEvent = Mono.create(byteArrayEventPublisher).share();
//        this.objectMapper = objectMapper;
//    }

    public Mono<ServerResponse> getAvatar(ServerRequest request) {
        return ServerResponse.ok().contentType(MediaType.IMAGE_JPEG).body(groupRouter.getAvatar(
                request.queryParam("name").orElse("")
        ), byte[].class);
    }

//    public Mono<ServerResponse> getGroup(ServerRequest request) {
//        return ServerResponse.ok().body(groupService.findById(
//                UUID.fromString(request.queryParam("group").orElse(""))
//        ), GroupNoteDTO.class);
//    }

    public Mono<ServerResponse> searchGroup(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.searchGroup(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> searchGroupData(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.searchGroupData(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> validateNameGroup(ServerRequest request) {
        return ServerResponse.ok().body(
                groupRouter.validateNameGroup(request.queryParam("name").orElse("")),SingleData.class);
    }

    public Mono<ServerResponse> notifMemberWillJoin(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.notifMemberWillJoin(
                UUID.fromString(request.queryParam("group").orElse("")),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> notifMemberRejectJoin(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.notifMemberRejectJoin(
                UUID.fromString(request.queryParam("group").orElse("")),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> memberGroup(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.memberGroup(
                UUID.fromString(request.queryParam("group").orElse(""))
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> updateRolePromoted(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.updateRolePromoted(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse("")))
                ,SingleData.class);
    }

    public Mono<ServerResponse> updateRoleDemoted(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.updateRoleDemoted(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse("")))
                ,SingleData.class);
    }

    public Mono<ServerResponse> sendRequest(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.sendRequest(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse("")))
                ,SingleData.class);
    }

    public Mono<ServerResponse> confirmAggrement(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.confirmAggrement(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ),SingleData.class);
    }

    public Mono<ServerResponse> rejectAggrement(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.rejectAggrement(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ),SingleData.class);
    }

    public Mono<ServerResponse> removeMember(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.removeMember(
                        UUID.fromString(request.queryParam("member").orElse("")),
                        UUID.fromString(request.queryParam("group").orElse(""))
                ),SingleData.class);
    }

    public Mono<ServerResponse> save(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
            Map<String, Part> data = item.toSingleValueMap();
            try {
                FilePart filePart = (FilePart) data.get("image");
                FormFieldPart group = (FormFieldPart) data.get("data");
                GroupNoteDTO groupdt = new ObjectMapper().readValue(group.value(), GroupNoteDTO.class);
                return DataBufferMultipartToByteArray.transform(filePart).flatMap(databytes -> groupRouter.save(groupdt,
                        databytes.getT1(), databytes.getT2(), databytes.getT3(), databytes.getT4()));
            } catch (JsonProcessingException e) {
                return Mono.error(new IllegalArgumentException(e));
            }
        }).flatMap(item -> ServerResponse.ok().body(Mono.just(item),GroupNoteDTO.class));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                Map<String, Part> data = item.toSingleValueMap();
                try {
                    FilePart filePart = (FilePart) data.get("image");
                    FormFieldPart group = (FormFieldPart) data.get("data");
                    GroupNoteDTO groupdata = new ObjectMapper().readValue(group.value(), GroupNoteDTO.class);
                    return DataBufferMultipartToByteArray.transform(filePart).flatMap(databytes -> groupRouter.update(groupdata,
                            databytes.getT1(), databytes.getT2(), databytes.getT3(), databytes.getT4()));
                } catch (JsonProcessingException e) {
                    return Mono.error(new IllegalArgumentException(e));
                }
            }).flatMap(item -> ServerResponse.ok().body(Mono.just(item),GroupNoteDTO.class));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return ServerResponse.ok().body(groupRouter.delete(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ), SingleData.class);
    }
}
