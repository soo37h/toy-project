package com.farmzonesnc.axtoy.auth.dto;

import com.farmzonesnc.axtoy.auth.domain.User;

public record AuthResponse(
    String email,
    String name,
    String access_token
) {
	/**
	 * 회원가입 성공 또는 로그인 성공 시 클라이언트에게 내려주는 응답 DTO
	 */

    public static AuthResponse from(User user, String access_token) {
        return new AuthResponse(
            user.getEmail(),
            user.getName(),
            access_token
        );
    }
}
