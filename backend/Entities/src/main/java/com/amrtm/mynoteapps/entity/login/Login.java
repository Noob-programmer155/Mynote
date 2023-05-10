package com.amrtm.mynoteapps.entity.login;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("login")
public class Login implements LoginInterface {
    @Id
    @Column("member")
    UUID member;
    @Column("token")
    String token;

    public Login() {
    }

    public Login(UUID member, String token) {
        this.member = member;
        this.token = token;
    }

    @Override
    public UUID getMember() {
        return member;
    }

    @Override
    public void setMember(UUID member) {
        this.member = member;
    }

    @Override
    public String getToken() {
        return token;
    }

    @Override
    public void setToken(String token) {
        this.token = token;
    }

    public static class builder {
        private UUID member;
        private String token;

        public builder member(UUID member) {
            this.member = member;
            return this;
        }

        public builder token(String token) {
            this.token = token;
            return this;
        }

        public Login build() {
            return new Login(member, token);
        }
    }
}
