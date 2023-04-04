package com.amrtm.mynoteapps.backend.integration_testing;

import com.amrtm.mynoteapps.backend.model.user.member.impl.MemberDTO;
import com.amrtm.mynoteapps.backend.service.model.user.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import reactor.test.StepVerifier;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Slf4j
public class IntegrationTestingService implements IntegrationTesting {
    @Autowired MemberService memberService;
    @Test
    @Override
    public void testMember() {
        MemberDTO user1 = MemberDTO.builder()
                .username("user1")
                .password("password1")
                .build();
        memberService.signup(user1,null)
                .as(StepVerifier::create)
                .expectComplete()
                .log();
    }

    @Override
    public void testTheme() {

    }

    @Override
    public void testGroup() {

    }

    @Override
    public void testSubtype() {

    }

    @Override
    public void testNote() {

    }
}
