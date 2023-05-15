package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user.GroupNote;

public class GroupPersisConv implements PersistenceConverter<GroupNote, com.amrtm.mynoteapps.entity.user.group.impl.GroupNote>{
    @Override
    public GroupNote toFirst(com.amrtm.mynoteapps.entity.user.group.impl.GroupNote from) {
        return new GroupNote(
                from.getId(),
                from.getUsername(),
                from.getAvatar()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.user.group.impl.GroupNote toSecond(GroupNote from) {
        return new com.amrtm.mynoteapps.entity.user.group.impl.GroupNote(
                from.getId(),
                from.getUsername(),
                from.getAvatar()
        );
    }
}
