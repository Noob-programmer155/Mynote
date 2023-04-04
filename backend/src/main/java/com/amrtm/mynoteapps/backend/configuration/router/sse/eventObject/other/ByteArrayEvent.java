package com.amrtm.mynoteapps.backend.configuration.router.sse.eventObject.other;

import org.springframework.context.ApplicationEvent;

public class ByteArrayEvent extends ApplicationEvent {
    public ByteArrayEvent(byte[] source) {
        super(source);
    }
}
