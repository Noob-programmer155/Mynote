package com.amrtm.mynoteapps.backend.configuration;

import com.amrtm.mynoteapps.adapter.storage.GroupStorageImpl;
import com.amrtm.mynoteapps.usecase.repository.relation.GroupMemberRepoRelation;
import com.amrtm.mynoteapps.usecase.repository.user.GroupRepoImpl;
import com.amrtm.mynoteapps.usecase.user.GroupService;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class ServiceAll {
    private final GroupRepoImpl groupRepo;
    private final GroupMemberRepoRelation groupMemberRepoRelation;
    @Bean
    public GroupService<GroupStorageImpl> groupService() {
        return new GroupService<>()
    }
}
