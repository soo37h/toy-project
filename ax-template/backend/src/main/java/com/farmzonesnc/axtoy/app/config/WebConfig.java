package com.farmzonesnc.axtoy.app.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 웹 MVC 설정 — CORS 관리
 *
 * - CORS (Cross-Origin Resource Sharing):
 *   브라우저는 보안상 다른 도메인(origin)으로의 요청을 차단함
 *   → FE(localhost:3000)에서 BE(localhost:8081)로 요청하면 origin이 다르므로 차단됨
 *   → 서버에서 "이 origin은 허용한다"고 명시해줘야 함
 *
 * - @Value: application.yml의 값을 자바 변수에 주입
 *   → app.cors.allowed-origins 리스트를 allowedOrigins에 넣어줌
 *   → yml만 수정하면 코드 변경 없이 허용 URL 관리 가능
 *
 * - CorsConfigurationSource: Spring Security에서 CORS 설정을 읽어가는 빈
 *   → SecurityConfig에서 이 빈을 주입받아서 사용함
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * application.yml → app.cors.allowed-origins 리스트를 주입받음
     * yml의 리스트(- 형태)를 @Value로 읽으려면 SpEL의 #{'${...}'.split(',')} 를 쓰거나
     * 아래처럼 인덱스 기반으로 읽을 수 있지만, 가장 간단한 방법은
     * yml에서 콤마 구분 문자열로 쓰고 Spring이 자동 분리하게 하는 것
     */
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    /** 허용할 HTTP 메서드 — GET, POST, PUT, DELETE + OPTIONS(preflight) */
    private static final List<String> ALLOWED_METHODS = List.of("GET", "POST", "PUT", "DELETE", "OPTIONS");

    /** 허용할 요청 헤더 — Authorization(JWT 토큰), Content-Type(JSON) */
//    private static final List<String> ALLOWED_HEADERS = List.of("Authorization", "Content-Type");
    private static final List<String> ALLOWED_HEADERS = List.of("*");

    /**
     * CORS 설정 빈 등록
     *
     * - setAllowedOrigins: 허용할 FE 도메인 목록 (yml에서 읽어옴)
     * - setAllowedMethods: 허용할 HTTP 메서드
     * - setAllowedHeaders: 허용할 요청 헤더
     * - setAllowCredentials(true): 쿠키/인증 정보 포함 요청 허용
     * - setMaxAge(3600L): preflight 요청 캐시 시간 (1시간)
     *   → 브라우저가 OPTIONS 요청을 1시간 동안 캐시해서 매번 보내지 않음
     * - registerCorsConfiguration("/**"): 모든 API 경로에 적용
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(allowedOrigins));
        config.setAllowedMethods(ALLOWED_METHODS);
        config.setAllowedHeaders(ALLOWED_HEADERS);
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
