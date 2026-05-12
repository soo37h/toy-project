package com.farmzonesnc.axtoy.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
	/*
	 * 회원가입 요청으로 들어오는 JSON 데이터를 받는 DTO
	 * 프론트에서 JSON을 보내면, Spring이 자동으로 SignupRequest에 담아준다.
	 * 검증 @Valid 
	 */

    @NotBlank(message = "이메일은 필수입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    String email,

    @NotBlank(message = "비밀번호는 필수입니다.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    String password,

    @NotBlank(message = "이름은 필수입니다.")
    String nickname
) {
}