package com.amrtm.mynoteapps.entity.login;

import java.util.UUID;

public class Login implements LoginInterface {
    UUID member;
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
