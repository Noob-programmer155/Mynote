package com.amrtm.mynoteapps.backend.router;

import com.amrtm.mynoteapps.backend.configuration.converter.DataBufferMultipartToByteArray;
import com.amrtm.mynoteapps.backend.configuration.security.impl.PasswordEncoderClass;
import com.amrtm.mynoteapps.entity.model.login.LoginDTO;
import com.amrtm.mynoteapps.entity.model.login.PasswordDTO;
import com.amrtm.mynoteapps.entity.other.obj.GroupNotif;
import com.amrtm.mynoteapps.entity.other.obj.UUIDIdAndName;
import com.amrtm.mynoteapps.entity.other.utils.SingleData;
import com.amrtm.mynoteapps.entity.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.entity.model.user.member.impl.MemberDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.http.codec.multipart.FormFieldPart;
import org.springframework.http.codec.multipart.Part;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyExtractors;
import org.springframework.web.reactive.function.server.ServerRequest;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.util.UUID;

@Component
public class MemberRouter {
    @Value("${jwt.header.bearer}")
    private String bearer;
    private final PasswordEncoderClass passwordEncoderClass;
    private final com.amrtm.mynoteapps.adapter.router.MemberRouter<Pageable> memberRouterSrc;

    public MemberRouter(com.amrtm.mynoteapps.adapter.router.MemberRouter<Pageable> memberRouterSrc,PasswordEncoderClass passwordEncoderClass) {
        this.memberRouterSrc = memberRouterSrc;
        this.passwordEncoderClass = passwordEncoderClass;
    }

    public Mono<ServerResponse> login(ServerRequest request) {
        return request.bodyToMono(LoginDTO.class).flatMap(data -> ServerResponse.ok().body(memberRouterSrc.login(
                data.getUsername(),data.getPassword(),
                (item) -> passwordEncoderClass.matches(item.getFirst(), item.getSecond())
        ), SingleData.class));
    }

    public Mono<ServerResponse> signup(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
            Map<String, Part> data = item.toSingleValueMap();
            try {
                FilePart filePart = (FilePart) data.get("image");
                FormFieldPart member = (FormFieldPart) data.get("data");
                MemberDTO memberDTO = new ObjectMapper().readValue(member.value(), MemberDTO.class);
                return DataBufferMultipartToByteArray.transform(filePart).flatMap(databytes -> memberRouterSrc.signup(memberDTO,
                        databytes.getT1(), databytes.getT2(), databytes.getT3(), databytes.getT4()));
            } catch (JsonProcessingException e) {
                return Mono.error(new IllegalArgumentException(e));
            }
        }).flatMap(item -> ServerResponse.ok().body(Mono.just(item),SingleData.class));
    }

    public Mono<ServerResponse> logout(ServerRequest request) {
        return ServerResponse.ok().body(request.session().flatMap(item -> memberRouterSrc.logout(
                    Mono.deferContextual(Mono::just).contextWrite(ReactiveSecurityContextHolder.clearContext()).then(),
                    item.invalidate()
                )),SingleData.class);
    }

    public Mono<ServerResponse> refresh(ServerRequest request) {
        String token = request.headers().firstHeader(HttpHeaders.AUTHORIZATION);
        if (token != null && !token.isBlank()) {
            token = token.substring(bearer.length()+1);
        }
        return ServerResponse.ok().body(memberRouterSrc.refresh(token), SingleData.class);
    }

    public Mono<ServerResponse> getAvatar(ServerRequest request) {
        return ServerResponse.ok().contentType(MediaType.IMAGE_JPEG).body(memberRouterSrc.getAvatar(
                request.queryParam("name").orElse("")
        ), byte[].class);
    }

    public Mono<ServerResponse> getMember() {
        return ServerResponse.ok().body(memberRouterSrc.getMember(), MemberDTO.class);
    }

    public Mono<ServerResponse> searchMember(ServerRequest request) {
        return ServerResponse.ok().body(memberRouterSrc.searchMember(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> searchMemberData(ServerRequest request) {
        return ServerResponse.ok().body(memberRouterSrc.searchMemberData(
                request.queryParam("name").orElse(""),
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> validateNameMember(ServerRequest request) {
        return ServerResponse.ok().body(memberRouterSrc.validateNameMember(request.queryParam("name").orElse("")),SingleData.class);
    }

    public Mono<ServerResponse> notifWillJoinGroup(ServerRequest request) {
        return ServerResponse.ok().body(memberRouterSrc.notifWillJoinGroup(
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), GroupNotif.class);
    }

    public Mono<ServerResponse> notifRejectedJoinGroup(ServerRequest request) {
        return ServerResponse.ok().body(memberRouterSrc.notifRejectedJoinGroup(
                Integer.parseInt(request.queryParam("page").orElse("0")),
                Integer.parseInt(request.queryParam("size").orElse("10"))
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> groupMember(ServerRequest request) {
        return ServerResponse.ok().body(memberRouterSrc.groupMember(
                UUID.fromString(request.queryParam("member").orElse(""))
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> updatePassword(ServerRequest request) {
        return request.bodyToMono(PasswordDTO.class).flatMap(password -> memberRouterSrc.updatePassword(
                    password.getNewPassword(),password.getOldPassword(),
                    (item) -> passwordEncoderClass.matches(item.getFirst(), item.getSecond())
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item),SingleData.class)));
    }

    public Mono<ServerResponse> groupConfirmation(ServerRequest request) {
        return memberRouterSrc.groupConfirmation(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item),SingleData.class));
    }

    public Mono<ServerResponse> groupReject(ServerRequest request) {
        return memberRouterSrc.groupReject(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item),SingleData.class));
    }

    public Mono<ServerResponse> sendRequest(ServerRequest request) {
        return memberRouterSrc.sendRequest(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item),SingleData.class));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                    Map<String, Part> data = item.toSingleValueMap();
                    try {
                        FilePart filePart = (FilePart) data.get("image");
                        FormFieldPart member = (FormFieldPart) data.get("data");
                        MemberDTO memberDTO = new ObjectMapper().readValue(member.value(), MemberDTO.class);
                        memberDTO.setPassword(null);
                        return DataBufferMultipartToByteArray.transform(filePart).flatMap(databytes -> memberRouterSrc.update(memberDTO,
                                databytes.getT1(), databytes.getT2(), databytes.getT3(), databytes.getT4()));
                    } catch (JsonProcessingException e) {
                        return Mono.error(new IllegalArgumentException(e));
                    }
                }).flatMap(item -> ServerResponse.ok().body(Mono.just(item),SingleData.class));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return memberRouterSrc.delete(
                        UUID.fromString(request.queryParam("member").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }

    public Mono<ServerResponse> deleteGroup(ServerRequest request) {
        return memberRouterSrc.deleteGroup(
                        UUID.fromString(request.queryParam("group").orElse("")),
                        UUID.fromString(request.queryParam("member").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(item), SingleData.class));
    }
}
