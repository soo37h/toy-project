package com.farmzonesnc.axtoy.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 설정
 *
 * - @EnableWebSecurity: Spring Security를 활성화
 * - SecurityFilterChain: HTTP 요청이 들어올 때 거치는 보안 필터 체인을 정의
 * - Customizer.withDefaults(): WebConfig에 등록된 CorsConfigurationSource 빈을 자동으로 찾아서 적용
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 보안 필터 체인 설정
     *
     * - cors(Customizer.withDefaults()): WebConfig의 CORS 설정 빈을 자동 탐색해서 적용
     * - csrf().disable(): REST API는 JWT 기반이므로 CSRF 불필요
     * - sessionManagement(STATELESS): 세션 미사용 (JWT가 상태를 대신 전달)
     * - authorizeHttpRequests: URL별 접근 권한 설정
     *   → 현재는 전부 permitAll (Phase 2에서 인증 적용 예정)
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/**").permitAll()  // Phase 1: 전부 허용
//                .requestMatchers("/auth/**").permitAll()  // Phase 2: 인증 API만 허용
//                .anyRequest().authenticated()             // Phase 2: 나머지는 인증 필요
            );

        return http.build();
    }

    /**
     * 비밀번호 암호화 (BCrypt)
     *
     * - BCrypt: 단방향 해시 알고리즘 — 암호화는 되지만 복호화는 안 됨
     * - 같은 비밀번호를 암호화해도 매번 다른 결과가 나옴 (salt 때문)
     * - 로그인 시 비교: passwordEncoder.matches("입력값", "DB저장값")
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
