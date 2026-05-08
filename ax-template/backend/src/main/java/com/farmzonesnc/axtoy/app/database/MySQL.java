package com.farmzonesnc.axtoy.app.database;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * MySQL 데이터소스 마커 어노테이션
 *
 * - 커스텀 어노테이션: 자바에서 직접 만드는 어노테이션
 * - Multi Database 환경에서 "이 Mapper는 MySQL을 사용한다"고 표시하는 용도
 * - MySQLConfig의 @MapperScan(annotationClass = MySQL.class)와 연결됨
 *   → @MySQL이 붙은 Mapper만 MySQL DataSource로 연결
 *
 * - @Target(ElementType.TYPE): 클래스/인터페이스에만 붙일 수 있음
 * - @Retention(RetentionPolicy.RUNTIME): 런타임에도 어노테이션 정보가 유지됨
 *   → Spring이 실행 시점에 이 어노테이션을 읽어야 하므로 RUNTIME 필수
 * - @Documented: Javadoc에 이 어노테이션이 표시됨
 *
 * 사용법:
 *   @Mapper
 *   @MySQL
 *   public interface BoardMapper { ... }
 *
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface MySQL {
}
