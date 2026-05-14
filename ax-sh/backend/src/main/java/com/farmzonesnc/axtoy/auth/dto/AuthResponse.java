package com.farmzonesnc.axtoy.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import com.farmzonesnc.axtoy.auth.domain.User;

public record AuthResponse(
    @JsonProperty("user_id") Long userId,
    String email,
    String name,
    @JsonProperty("dept_name") String deptName,
    String tokenType,
    String accessToken
) {
	/*
	 * 회원가입 성공 또는 로그인 성공 시 클라이언트에게 내려주는 응답 DTO
	 */

    public static AuthResponse from(User user, String accessToken) {
        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getDeptName(),
            "Bearer",
            accessToken
        );
    }
}
