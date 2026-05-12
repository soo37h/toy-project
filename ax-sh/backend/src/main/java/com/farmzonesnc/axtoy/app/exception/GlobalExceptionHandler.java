package com.farmzonesnc.axtoy.app.exception;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * DTO 검증 실패 처리
     *
     * 예:
     * - @NotBlank 실패
     * - @Email 실패
     * - @Size 실패
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        List<FieldErrorResponse> errors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(this::toFieldErrorResponse)
                .toList();

        ErrorResponse response = ErrorResponse.of(
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                "요청값이 올바르지 않습니다.",
                errors
        );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    /**
     * ResponseStatusException 처리
     *
     * 예:
     * - 이메일 중복 409
     * - 로그인 실패 401
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(
            ResponseStatusException exception
    ) {
        int status = exception.getStatusCode().value();

        ErrorResponse response = ErrorResponse.of(
                status,
                "BUSINESS_ERROR",
                exception.getReason()
        );

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(response);
    }

    /**
     * 그 외 예상하지 못한 서버 에러 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception exception
    ) {
        ErrorResponse response = ErrorResponse.of(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "INTERNAL_SERVER_ERROR",
                "서버 내부 오류가 발생했습니다."
        );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }

    private FieldErrorResponse toFieldErrorResponse(FieldError fieldError) {
        return FieldErrorResponse.of(
                fieldError.getField(),
                fieldError.getDefaultMessage()
        );
    }
}