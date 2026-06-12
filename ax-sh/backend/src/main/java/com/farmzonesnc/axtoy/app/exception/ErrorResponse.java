package com.farmzonesnc.axtoy.app.exception;

import org.springframework.http.HttpStatus;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;

/**
 * errors 객체 정의
 */

@Getter
@JsonInclude(JsonInclude.Include.ALWAYS)
public class ErrorResponse {
	private final int code;
	private final String status;
	private final String message;
	
	private ErrorResponse(int code, String status, String message) {
		this.code = code;
		this.status = status;
		this.message = message;
	}
	
	public static ErrorResponse of(HttpStatus status, String message) {
		return new ErrorResponse(
			status.value(),
			status.name(),
			message
		);
	}
	
}