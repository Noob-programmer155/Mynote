package com.amrtm.mynoteapps.adapter.converter;

import com.amrtm.mynoteapps.adapter.database.persistence.persistenceObj.user.Member;

public class MemberPersisConv implements PersistenceConverter<Member, com.amrtm.mynoteapps.entity.model.user.member.impl.Member>{
    @Override
    public Member toFirst(com.amrtm.mynoteapps.entity.model.user.member.impl.Member from) {
        return new Member(
                from.getId(),
                from.getUsername(),
                from.getPassword(),
                from.getAvatar()
        );
    }

    @Override
    public com.amrtm.mynoteapps.entity.model.user.member.impl.Member toSecond(Member from) {
        return new com.amrtm.mynoteapps.entity.model.user.member.impl.Member(
                from.getId(),
                from.getUsername(),
                from.getPassword(),
                from.getAvatar()
        );
    }
}
