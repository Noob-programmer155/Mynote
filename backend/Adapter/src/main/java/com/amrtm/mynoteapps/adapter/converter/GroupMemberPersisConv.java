package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.GroupMemberRel;

public class GroupMemberPersisConv implements PersistenceConverter<GroupMemberRel, com.amrtm.mynoteapps.entity.relation.GroupMemberRel>{
    @Override
    public GroupMemberRel toFirst(com.amrtm.mynoteapps.entity.relation.GroupMemberRel from) {
        return new GroupMemberRel(
                from.getId(),
                from.getParent(),
                from.getChild(),
                from.getRole(),
                from.getIsDeleted(),
                from.getIsConfirmed(),
                from.getUserFrom()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.relation.GroupMemberRel toSecond(GroupMemberRel from) {
        return new com.amrtm.mynoteapps.entity.relation.GroupMemberRel(
                from.getId(),
                from.getParent(),
                from.getChild(),
                from.getRole(),
                from.getIsDeleted(),
                from.getIsConfirmed(),
                from.getUserFrom()
        );
    }
}
