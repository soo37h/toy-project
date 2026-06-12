package com.farmzonesnc.axtoy.app.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/** 
 * 비즈니스 로직에서 의도적으로 실패를 발생시킬 때 사용하는 예외 클래스
 * 
 */
@Getter
public class BusinessException extends RuntimeException {

    private final HttpStatus status; // 응답 HTTP 상태 코드

    public BusinessException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}