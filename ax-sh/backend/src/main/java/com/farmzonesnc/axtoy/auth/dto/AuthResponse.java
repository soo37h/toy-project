package com.farmzonesnc.axtoy.auth.dto;

import com.farmzonesnc.axtoy.auth.domain.Member;

public record AuthResponse(
    Long memberId,
    String email,
    String nickname,
    String tokenType,
    String accessToken
) {
	/*
	 * 회원가입 성공 또는 로그인 성공 시 클라이언트에게 내려주는 응답 DTO
	 * 응답 예시
	 * {
		  "memberId": 1,
		  "email": "test@test.com",
		  "nickname": "테스터",
		  "tokenType": "Bearer",
		  "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
		}
	 */

    public static AuthResponse from(Member member, String accessToken) {
        return new AuthResponse(
            member.getId(),
            member.getEmail(),
            member.getNickname(),
            "Bearer",
            accessToken
        );
    }
}