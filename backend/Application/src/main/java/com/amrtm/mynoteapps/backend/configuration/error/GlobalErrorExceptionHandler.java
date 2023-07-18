package com.amrtm.mynoteapps.backend.configuration.error;

import com.amrtm.mynoteapps.backend.configuration.security.impl.ErrorBindException;
import com.amrtm.mynoteapps.entity.other.ErrorCustom;
import org.springframework.boot.autoconfigure.web.WebProperties;
import org.springframework.boot.autoconfigure.web.reactive.error.AbstractErrorWebExceptionHandler;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.reactive.error.DefaultErrorAttributes;
import org.springframework.boot.web.reactive.error.ErrorAttributes;
import org.springframework.context.ApplicationContext;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.codec.ServerCodecConfigurer;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.server.*;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
@Order(-2)
public class GlobalErrorExceptionHandler extends AbstractErrorWebExceptionHandler {
    private final ErrorBindException errorBindException = new ErrorBindException();

    /**
     * Create a new {@code AbstractErrorWebExceptionHandler}.
     *
     * @param errorAttributes    the error attributes
     * @param applicationContext the application context
     * @since 2.4.0
     */
    public GlobalErrorExceptionHandler(ErrorAttributes errorAttributes, ApplicationContext applicationContext,
                                       ServerCodecConfigurer serverCodecConfigurer) {
        super(errorAttributes, new WebProperties.Resources(), applicationContext);
        super.setMessageWriters(serverCodecConfigurer.getWriters());
        super.setMessageReaders(serverCodecConfigurer.getReaders());
    }

    @Override
    protected RouterFunction<ServerResponse> getRoutingFunction(ErrorAttributes errorAttributes) {
        return RouterFunctions.route(RequestPredicates.all(),this::renderErrorResponse);
    }

    private Mono<ServerResponse> renderErrorResponse(ServerRequest request) {
        Throwable t = getError(request);
        HttpStatus status;
        if (errorBindException.jwtExpiredRefresh().contains(t.getClass())) status = HttpStatus.EXPECTATION_FAILED;
        else if (errorBindException.authException().contains(t.getClass())) status = HttpStatus.UNAUTHORIZED;
        else if (errorBindException.humanException().contains(t.getClass())) status = HttpStatus.BAD_REQUEST;
        else status = HttpStatus.INTERNAL_SERVER_ERROR;
        return ServerResponse.status(status).contentType(MediaType.APPLICATION_JSON).body(
                Mono.just(new ErrorCustom(t.getMessage())),ErrorCustom.class
        );
    }
}
