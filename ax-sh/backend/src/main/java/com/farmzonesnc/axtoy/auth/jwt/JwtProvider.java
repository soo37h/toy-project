package com.farmzonesnc.axtoy.auth.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.farmzonesnc.axtoy.auth.domain.Member;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {
	/*
	 * JWT 토큰을 생성하는 클래스
	 * 로그인 또는 회원가입 성공 후 JWT 문자열을 만든다.
	 * JWT 정보
	 *  | 항목         | 값       |
		| ---------- | ------   |
		| subject    | 회원 id   |
		| email      | 회원 이메일 |
		| nickname   | 회원 닉네임 |
		| issuedAt   | 발급 시간  |
		| expiration | 만료 시간  |
		
	 * TODO
	 * 요청 헤더의 JWT 검증
	 * 로그인 사용자 정보 추출
	 * 인증 필요한 API 보호
	 */

    private final SecretKey secretKey;
    private final long accessTokenExpirationMillis;

    public JwtProvider(
            @Value("${app.jwt.secret:local-jwt-secret-key-for-dev-env-1234567890}") String secret,
            @Value("${app.jwt.access-token-expiration-millis:3600000}") long accessTokenExpirationMillis
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationMillis = accessTokenExpirationMillis;
    }

    public String createAccessToken(Member member) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + accessTokenExpirationMillis);

        return Jwts.builder()
                .subject(String.valueOf(member.getId()))
                .claim("email", member.getEmail())
                .claim("nickname", member.getNickname())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(secretKey, Jwts.SIG.HS256)
                .compact();
    }
}