package com.farmzonesnc.axtoy.app.exception;

import com.farmzonesnc.axtoy.app.dto.ApiResponse;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * @RestControllerAdvice 전역 예외 처리. 모든 Controller에서 발생한 예외를 이 클래스에서 공통으로 처리
 */

@RestControllerAdvice
public class GlobalExceptionHandler {

	// @Valid 검증 실패 처리
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Object>> handleValidationException(MethodArgumentNotValidException e) {
		// 첫 번째 에러 메시지 하나만 추출
		String message = e.getBindingResult()
				.getFieldErrors()
				.stream()
				.findFirst()
				.map(DefaultMessageSourceResolvable::getDefaultMessage)
				.orElse("요청 값이 올바르지 않습니다.");

		return fail(HttpStatus.BAD_REQUEST, message);
	}

	// JSON 형식 오류 처리
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ApiResponse<Object>> handleHttpMessageNotReadableException(
			HttpMessageNotReadableException e) {

		return fail(HttpStatus.BAD_REQUEST, "요청 형식이 올바르지 않습니다.");
	}

	// 직접 발생시키는 비즈니스 예외 처리
	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ApiResponse<Object>> handleBusinessException(BusinessException e) {
		return fail(e.getStatus(), e.getMessage());
	}

	// 기타 서버 오류 처리
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Object>> handleException(Exception e) {
		return fail(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.");
	}

	// 실패 응답 만드는 메서드
	private ResponseEntity<ApiResponse<Object>> fail(HttpStatus status, String message) {
		ErrorResponse errorResponse = ErrorResponse.of(status, message);

		return ResponseEntity.status(status).body(ApiResponse.fail(errorResponse));
	}
}