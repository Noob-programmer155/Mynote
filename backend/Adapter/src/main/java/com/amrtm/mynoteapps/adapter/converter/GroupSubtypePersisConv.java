package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.relation.GroupSubtypeRel;

public class GroupSubtypePersisConv implements PersistenceConverter<GroupSubtypeRel, com.amrtm.mynoteapps.entity.model.relation.GroupSubtypeRel>{
    @Override
    public GroupSubtypeRel toFirst(com.amrtm.mynoteapps.entity.model.relation.GroupSubtypeRel from) {
        return new GroupSubtypeRel(
                from.getId(),
                from.getParent(),
                from.getChild(),
                from.getIndex(),
                from.getColor()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.model.relation.GroupSubtypeRel toSecond(GroupSubtypeRel from) {
        return new com.amrtm.mynoteapps.entity.model.relation.GroupSubtypeRel(
                from.getId(),
                from.getParent(),
                from.getChild(),
                from.getIndex(),
                from.getColor()
        );
    }
}
