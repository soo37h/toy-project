package com.farmzonesnc.axtoy.auth.dto;

import com.farmzonesnc.axtoy.auth.domain.Member;

public record AuthResponse(
    Long memberId,
    String email,
    String nickname,
    String tokenType,
    String accessToken
) {

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