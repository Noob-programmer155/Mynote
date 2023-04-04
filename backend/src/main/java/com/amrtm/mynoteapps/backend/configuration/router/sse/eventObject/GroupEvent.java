package com.amrtm.mynoteapps.backend.configuration.router.sse.eventObject;

import com.amrtm.mynoteapps.backend.model.user.group.impl.GroupNoteDTO;
import org.springframework.context.ApplicationEvent;

public class GroupEvent extends ApplicationEvent {
    public GroupEvent(GroupNoteDTO source) {
        super(source);
    }
}
