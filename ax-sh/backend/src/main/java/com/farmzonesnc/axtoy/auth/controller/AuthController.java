package com.farmzonesnc.axtoy.auth.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.farmzonesnc.axtoy.auth.dto.AuthResponse;
import com.farmzonesnc.axtoy.auth.dto.EmailIdCheckRequest;
import com.farmzonesnc.axtoy.auth.dto.EmailIdCheckResponse;
import com.farmzonesnc.axtoy.auth.dto.LoginRequest;
import com.farmzonesnc.axtoy.auth.dto.SignupRequest;
import com.farmzonesnc.axtoy.auth.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/email-id/check")
    public ResponseEntity<EmailIdCheckResponse> checkEmailId(
            @Valid @RequestBody EmailIdCheckRequest request
    ) {
        EmailIdCheckResponse response = authService.checkEmailId(request.email());

        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(
            @Valid @RequestBody SignupRequest request
    ) {
        AuthResponse response = authService.signup(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }
    
}