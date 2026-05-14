package com.farmzonesnc.axtoy.auth.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.farmzonesnc.axtoy.auth.domain.User;
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

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .name(request.name())
                .deptName(request.deptName())
                .build();

        authMapper.insertUser(user);

        String accessToken = jwtProvider.createAccessToken(user);

        return AuthResponse.from(user, accessToken);
    }

    public AuthResponse login(LoginRequest request) {
        User user = authMapper.findByEmail(request.email());

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        boolean isPasswordMatched = passwordEncoder.matches(
                request.password(),
                user.getPassword()
        );

        if (!isPasswordMatched) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "이메일 또는 비밀번호가 올바르지 않습니다."
            );
        }

        String accessToken = jwtProvider.createAccessToken(user);

        return AuthResponse.from(user, accessToken);
    }
}