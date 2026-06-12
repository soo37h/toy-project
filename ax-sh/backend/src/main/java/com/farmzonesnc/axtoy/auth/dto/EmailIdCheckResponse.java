package com.farmzonesnc.axtoy.auth.dto;

public record EmailIdCheckResponse(
        String email,
        boolean valid,
        String message
) {

    public static EmailIdCheckResponse available(String email) {
        return new EmailIdCheckResponse(
                email,
                true,
                "사용 가능한 이메일입니다."
        );
    }

    public static EmailIdCheckResponse duplicated(String email) {
        return new EmailIdCheckResponse(
                email,
                false,
                "이미 사용 중인 이메일입니다."
        );
    }
}