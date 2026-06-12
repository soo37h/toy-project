package com.farmzonesnc.axtoy.app.dto;

import com.farmzonesnc.axtoy.app.exception.ErrorResponse;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

/**
 * API 응답 JSON 형태를 통일하기 위한 공통 응답 클래스
 *
 * - @Getter: getter 메서드들을 자동으로 생성
 * - @JsonInclude: Java 객체를 JSON으로 변환
 * - (JsonInclude.Include.ALWAYS): 클래스가 JSON으로 변환될 때 null 값도 포함
 */
@Getter
@JsonInclude(JsonInclude.Include.ALWAYS) 
public class ApiResponse<T> { 
	private final boolean res;           // 응답 성공 여부
	private final T resData;             // 실제 응답 데이터를 담는 필드
 	private final ErrorResponse errors;  // 실패 정보
	private final PageMeta meta;         // 페이징 정보
	private final String timestamp;      // 응답이 만들어진 시간 
	
	private ApiResponse(boolean res, T resData, ErrorResponse errors, PageMeta meta) {
		this.res = res;
		this.resData = resData;
		this.errors = errors;
		this.meta = meta;
		this.timestamp = now(); // 응답이 만들어질 때 자동으로 시간 생성
	}
	
	// 성공 응답 메서드
	public static <T> ApiResponse<T> success(T resData) {
		return new ApiResponse<>(true, resData, null, null);
	}
	
	// 성공 응답 + meta
	public static <T> ApiResponse<T> success(T resData, PageMeta meta) {
		return new ApiResponse<>(true, resData, null, meta);
	}
	
	// 실패 응답
	public static ApiResponse<Object> fail(ErrorResponse errors) {
		return new ApiResponse<>(false, null, errors, null);
	}
	
	// 현재 시간 생성
	private static String now() {
		return LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
	}
	
	
}
