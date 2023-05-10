package com.amrtm.mynoteapps.backend.router;

import com.amrtm.mynoteapps.backend.router.error.ErrorCustom;
import com.amrtm.mynoteapps.backend.router.other.SingleData;
import com.amrtm.mynoteapps.backend.model.other.Role;
import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.service.model.user.MemberService;
import com.amrtm.mynoteapps.backend.service.other.UUIDIdAndName;
import com.amrtm.mynoteapps.backend.configuration.security.token.jwt.JwtProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
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
public class MemberRouter {
    private final MemberService memberService;
    private final JwtProvider jwtProvider;
    @Value("${jwt.header.bearer}")
    private String bearer;

    public Mono<ServerResponse> login(ServerRequest request) {
        return memberService.login(
                request.queryParam("username").orElse(""),
                request.queryParam("password").orElse("")
        ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> signup(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
            Map<String, Part> data = item.toSingleValueMap();
            try {
                FilePart filePart = (FilePart) data.get("image");
                FormFieldPart member = (FormFieldPart) data.get("data");
                MemberDTO memberDTO = new ObjectMapper().readValue(member.value(), MemberDTO.class);
                return memberService.signup(memberDTO,filePart);
            } catch (JsonProcessingException e) {
                return Mono.error(new RuntimeException(e));
            }
        }).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> logout(ServerRequest request) {
        return ServerResponse.ok().body(request.session().flatMap(memberService::logout)
                .map(SingleData::new),SingleData.class)
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> refresh(ServerRequest request) {
        String token = request.headers().firstHeader(HttpHeaders.AUTHORIZATION);
        if (token != null && !token.isBlank()) {
            token = token.substring(bearer.length()+1);
        }
        return memberService.refresh(token)
                .flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> getAvatar(ServerRequest request) {
        return ServerResponse.ok().contentType(MediaType.IMAGE_JPEG).body(memberService.getAvatar(
                request.queryParam("name").orElse("")
        ).switchIfEmpty(Mono.just(new byte[]{})), byte[].class);
    }

    public Mono<ServerResponse> getMember() {
        return ServerResponse.ok().body(memberService.findProfile(), MemberDTO.class);
    }

    public Mono<ServerResponse> searchMember(ServerRequest request) {
        return ServerResponse.ok().body(memberService.findByNameLike(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), UUIDIdAndName.class);
    }

    public Mono<ServerResponse> searchMemberData(ServerRequest request) {
        return ServerResponse.ok().body(memberService.findByNameLikeData(
                request.queryParam("name").orElse(""),
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), MemberDTO.class);
    }

    public Mono<ServerResponse> validateNameMember(ServerRequest request) {
        return ServerResponse.ok().body(memberService.validateName(request.queryParam("name").orElse(""))
                .flatMap(item -> Mono.just(new SingleData<>(item))),SingleData.class);
    }

    public Mono<ServerResponse> notifWillJoinGroup(ServerRequest request) {
        return ServerResponse.ok().body(memberService.findByWaitingStatusGroup(
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> notifRejectedJoinGroup(ServerRequest request) {
        return ServerResponse.ok().body(memberService.findByRejectedStatusGroup(
                PageRequest.of(
                        Integer.parseInt(request.queryParam("page").orElse("0")),
                        Integer.parseInt(request.queryParam("size").orElse("10")),
                        Sort.Direction.ASC,
                        "name"
                )
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> groupMember(ServerRequest request) {
        return ServerResponse.ok().body(memberService.getGroups(
                UUID.fromString(request.queryParam("member").orElse(""))
        ), GroupNoteDTO.class);
    }

    public Mono<ServerResponse> updatePassword(ServerRequest request) {
        return memberService.updatePassword(
                        request.queryParam("newPassword").orElse(""),
                        request.queryParam("oldPassword").orElse("")
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> groupConfirmation(ServerRequest request) {
        return memberService.groupConfirm(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> groupReject(ServerRequest request) {
        return memberService.groupReject(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> sendRequest(ServerRequest request) {
        return memberService.sendRequest(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).flatMap(item -> ServerResponse.ok().body(Mono.just(new SingleData<>(item)),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> update(ServerRequest request) {
        return request.body(BodyExtractors.toMultipartData()).flatMap(item -> {
                    Map<String, Part> data = item.toSingleValueMap();
                    try {
                        FilePart filePart = (FilePart) data.get("image");
                        FormFieldPart member = (FormFieldPart) data.get("data");
                        MemberDTO memberDTO = new ObjectMapper().readValue(member.value(), MemberDTO.class);
                        memberDTO.setPassword(null);
                        return memberService.save(memberDTO,filePart,true);
                    } catch (JsonProcessingException e) {
                        return Mono.error(new RuntimeException(e));
                    }
                }).flatMap(item -> ServerResponse.ok().body(jwtProvider.createToken(item.getUsername(), Role.USER).map(SingleData::new),SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> delete(ServerRequest request) {
        return memberService.deleteById(
                        UUID.fromString(request.queryParam("member").orElse(""))
                ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }

    public Mono<ServerResponse> deleteGroup(ServerRequest request) {
        return memberService.removeGroupRejected(
                        UUID.fromString(request.queryParam("group").orElse(""))
                ).then(ServerResponse.ok().body(Mono.just(new SingleData<>(true)), SingleData.class))
                .onErrorResume(item -> Mono.just(new ErrorCustom(item.getMessage())).flatMap(error ->
                        ServerResponse.status(HttpStatus.BAD_REQUEST).body(Mono.just(error),ErrorCustom.class)
                ));
    }
}
