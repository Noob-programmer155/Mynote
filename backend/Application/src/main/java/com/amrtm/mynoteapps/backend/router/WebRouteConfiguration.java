package com.amrtm.mynoteapps.backend.router;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.server.RequestPredicates;
import org.springframework.web.reactive.function.server.RouterFunction;
import org.springframework.web.reactive.function.server.RouterFunctions;
import org.springframework.web.reactive.function.server.ServerResponse;

@Configuration
public class WebRouteConfiguration {
    private final NoteRouter noteRouter;
    private final SubtypeRouter subtypeRouter;
    private final ThemeRouter themeRouter;
    private final GroupRouter groupRouter;
    private final MemberRouter memberRouter;

    public WebRouteConfiguration(NoteRouter noteRouter, SubtypeRouter subtypeRouter, ThemeRouter themeRouter, GroupRouter groupRouter, MemberRouter memberRouter) {
        this.noteRouter = noteRouter;
        this.subtypeRouter = subtypeRouter;
        this.themeRouter = themeRouter;
        this.groupRouter = groupRouter;
        this.memberRouter = memberRouter;
    }

    @Bean
    public RouterFunction<ServerResponse> routes() {
        RouterFunction<ServerResponse> noteRoute = RouterFunctions.route()
                .GET("/search",noteRouter::searchByTitleInMember)//
                .GET("/category", noteRouter::getCategoryMember)//
                .GET("/subtype", noteRouter::getSubtypeGroup)//
                .GET("/filter",noteRouter::filterMember)//
                .GET("/group/filter",noteRouter::filterGroup)//
                .GET("/severities",noteRouter::getSeverityNotePrivate)//
                .GET("/group/severities",noteRouter::getSeverityNoteCollab)//
                .GET("/search/group",noteRouter::searchByTitleInGroup)//
                .POST("",noteRouter::saveNotePrivate)//
                .POST("/group",noteRouter::saveNoteCollab)//
                .PUT("",noteRouter::updateNotePrivate)//
                .PUT("/group",noteRouter::updateNoteCollab)//
                .DELETE("",noteRouter::deleteNotePrivate)//
                .DELETE("/group",noteRouter::deleteNoteCollab)//
                .DELETE("/category",noteRouter::deleteNotePrivateByCategory)//
                .build();
        RouterFunction<ServerResponse> subtypeRoute = RouterFunctions.route()
                .POST("/rel",subtypeRouter::save)//
                .PUT("/rel/modify",subtypeRouter::update)//
                .PUT("/rel/index",subtypeRouter::updateIndex)//
//                .DELETE("",subtypeRouter::delete)
                .DELETE("/rel",subtypeRouter::removeGroup)//
                .build();
        RouterFunction<ServerResponse> themeRoute= RouterFunctions.route()
                .GET("/search",themeRouter::searchByName)//
                .GET("/search/data",themeRouter::searchByNameData)//
                .GET("/member/search",themeRouter::getByNameInMember)//
                .GET("/member/search/data",themeRouter::getByNameDataInMember)//
                .GET("/validate",themeRouter::validateNameTheme)//
                .POST("",RequestPredicates.contentType(MediaType.MULTIPART_FORM_DATA),themeRouter::save)//
                .POST("/rel",themeRouter::addRelationMember)//
                .POST("/activate",themeRouter::activateTheme)//
                .PUT("",RequestPredicates.contentType(MediaType.MULTIPART_FORM_DATA),themeRouter::update)//
                .DELETE("",themeRouter::delete)//?
                .DELETE("/rel",themeRouter::removeRelationMember)//
                .build();
        RouterFunction<ServerResponse> groupRoute = RouterFunctions.route()
//                .GET("",groupRouter::getGroup)
                .GET("/search",groupRouter::searchGroup)//
                .GET("/search/data",groupRouter::searchGroupData)//
                .GET("/validate",groupRouter::validateNameGroup)//
                .GET("/request",groupRouter::notifMemberWillJoin)//
                .GET("/request/reject",groupRouter::notifMemberRejectJoin)//
                .GET("/members",groupRouter::memberGroup)//
                .POST("", RequestPredicates.contentType(MediaType.MULTIPART_FORM_DATA),groupRouter::save)
                .POST("/request",groupRouter::sendRequest)//
                .POST("/request/confirm",groupRouter::confirmAggrement)//
                .POST("/request/reject",groupRouter::rejectAggrement)//
                .PUT("", RequestPredicates.contentType(MediaType.MULTIPART_FORM_DATA),groupRouter::update)//
                .PUT("/role/promoted",groupRouter::updateRolePromoted)//
                .PUT("/role/demoted",groupRouter::updateRoleDemoted)//
                .DELETE("",groupRouter::delete)//
                .DELETE("/member/remove",groupRouter::removeMember)//
                .build();
        RouterFunction<ServerResponse> memberRoute = RouterFunctions.route()
                .GET("",(item) -> memberRouter.getMember())//
                .GET("/search",memberRouter::searchMember)//
                .GET("/search/data",memberRouter::searchMemberData)//
                .GET("/validate",memberRouter::validateNameMember)//
                .GET("/request",memberRouter::notifWillJoinGroup)//
                .GET("/request/reject",memberRouter::notifRejectedJoinGroup)//
                .GET("/groups",memberRouter::groupMember)//
                .POST("/logout",memberRouter::logout)//
                .POST("/request",memberRouter::sendRequest)//
                .POST("/request/reject",memberRouter::groupReject)//
                .POST("/request/confirm",memberRouter::groupConfirmation)//
                .PUT("", RequestPredicates.contentType(MediaType.MULTIPART_FORM_DATA),memberRouter::update)//
                .PUT("/password",memberRouter::updatePassword)//
//                .DELETE("",memberRouter::delete)
                .DELETE("/rel",memberRouter::deleteGroup)//
                .build();
        RouterFunction<ServerResponse> publicRoute = RouterFunctions.route()
                .GET("/subtype",subtypeRouter::getByGroup)//
                .GET("/subtype/search",subtypeRouter::searchByName)//
                .GET("/group/avatar",groupRouter::getAvatar)//
                .GET("/theme/image",themeRouter::getAvatar)//
                .GET("/member/avatar",memberRouter::getAvatar)//
                .POST("/signup", RequestPredicates.contentType(MediaType.MULTIPART_FORM_DATA),memberRouter::signup)//
                .POST("/login",memberRouter::login)//
                .POST("/refresh",memberRouter::refresh)//
                .build();

        return RouterFunctions.route()
                .path("/api/v1",item -> item
                        .path("/public",() -> publicRoute)
                        .path("/user",route -> route
                                .path("/note",() -> noteRoute)
                                .path("/subtype", () -> subtypeRoute)
                                .path("/theme", () -> themeRoute)
                                .path("/group", () -> groupRoute)
                                .path("/member", () -> memberRoute)
                                .build()
                        ).build()
                ).build();
    }
}
