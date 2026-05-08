package com.farmzonesnc.axtoy;

import java.util.Locale;
import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

import jakarta.annotation.PostConstruct;

/**
 * Spring Boot 메인 애플리케이션
 *
 * - @SpringBootApplication: 스프링 부트의 시작점. 이 어노테이션 하나로 자동 설정 + 컴포넌트 스캔이 활성화됨
 * - exclude = DataSourceAutoConfiguration: Spring Boot가 자동으로 DataSource를 만들지 않도록 제외
 *   → 왜? Multi Database 구조에서는 MySQLConfig에서 직접 DataSource를 만들기 때문
 *   → 이걸 안 하면 Spring Boot가 자동 설정과 수동 설정이 충돌해서 에러남
 * - @PostConstruct: 애플리케이션이 시작된 직후 한 번 실행되는 메서드
 *   → 서버 시간대와 언어를 한국으로 고정 (날짜/시간 처리 시 중요)
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class MainApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }

    /**
     * 애플리케이션 시작 시 표준 시간대/언어 설정
     *
     * - TimeZone.setDefault: JVM 전체의 기본 시간대를 Asia/Seoul로 설정
     *   → DB에서 날짜를 가져올 때, new Date()를 쓸 때 모두 한국 시간 기준
     * - Locale.setDefault: 숫자/날짜 포맷, 에러 메시지 등의 기본 언어를 한국어로 설정
     */
    @PostConstruct
    public void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
        Locale.setDefault(Locale.KOREA);
    }
    
}
