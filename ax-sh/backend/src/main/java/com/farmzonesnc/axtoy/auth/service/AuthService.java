package com.farmzonesnc.axtoy.auth.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.farmzonesnc.axtoy.auth.domain.Member;
import com.farmzonesnc.axtoy.auth.dto.AuthResponse;
import com.farmzonesnc.axtoy.auth.dto.LoginRequest;
import com.farmzonesnc.axtoy.auth.dto.SignupRequest;
import com.farmzonesnc.axtoy.auth.jwt.JwtProvider;
import com.farmzonesnc.axtoy.auth.mapper.AuthMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private final AuthMapper authMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        int emailCount = authMapper.countByEmail(request.email());

        if (emailCount > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 사용 중인 이메일입니다."
            );
        }

        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        authMapper.insertMember(member);

        String accessToken = jwtProvider.createAccessToken(member);

        return AuthResponse.from(member, accessToken);
    }

    public AuthResponse login(LoginRequest request) {
        Member member = authMapper.findByEmail(request.email());

        if (member == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        boolean isPasswordMatched = passwordEncoder.matches(
                request.password(),
                member.getPassword()
        );

        if (!isPasswordMatched) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        String accessToken = jwtProvider.createAccessToken(member);

        return AuthResponse.from(member, accessToken);
    }
}