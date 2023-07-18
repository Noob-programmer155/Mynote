package com.amrtm.mynoteapps.entity.other;

public class ErrorCustom {
    private String message;

    public ErrorCustom() {
    }

    public ErrorCustom(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
