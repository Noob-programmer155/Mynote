package com.amrtm.mynoteapps.backend.configuration.router.sse.eventPublisher;

import com.amrtm.mynoteapps.backend.configuration.router.sse.eventObject.other.ByteArrayEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
import reactor.core.publisher.MonoSink;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.function.Consumer;

//@Component
@RequiredArgsConstructor
public class ByteArrayEventPublisher implements ApplicationListener<ByteArrayEvent>, Consumer<MonoSink<ByteArrayEvent>> {
    private final Executor executor;
    private ByteArrayEvent byteArrayEvent;

    @Override
    public void accept(MonoSink<ByteArrayEvent> byteArrayEventFluxSink) {
        this.executor.execute(() -> {
            while(true)
            {
                byteArrayEventFluxSink.success(byteArrayEvent);
            }
        });
    }

    @Override
    public void onApplicationEvent(ByteArrayEvent event) {
        this.byteArrayEvent = event;
    }
}
