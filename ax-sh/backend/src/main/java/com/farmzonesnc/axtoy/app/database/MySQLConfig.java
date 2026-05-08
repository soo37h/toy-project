package com.farmzonesnc.axtoy.app.database;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

/**
 * MySQL 데이터소스 설정 (Multi Database 구조)
 */
@Configuration
@MapperScan(
		basePackages = "com.farmzonesnc.axtoy", 
		annotationClass = MySQL.class, 
		sqlSessionFactoryRef = "mysqlSqlSessionFactory"
)
@EnableTransactionManagement
public class MySQLConfig {

    /**
     * HikariCP 설정
     * application-database.yml의 datasource.mysql 아래 값들이 자동으로 주입됨
     * (driverClassName, jdbcUrl, username, password, maximum-pool-size 등)
     */
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "datasource.mysql")
    public HikariConfig mysqlHikariConfig() {
        return new HikariConfig();
    }

    /**
     * DataSource 생성 — DB 커넥션 풀
     * HikariCP가 DB 연결을 미리 만들어놓고 요청마다 재사용함 (성능 최적화)
     */
    @Bean
    @Primary
    @Qualifier("mysqlDataSource")
    public DataSource mysqlDataSource(@Qualifier("mysqlHikariConfig") HikariConfig mysqlHikariConfig) {
        return new HikariDataSource(mysqlHikariConfig);
    }

    /**
     * SqlSessionFactory — MyBatis의 핵심
     * - mybatis-config.xml: MyBatis 공통 설정 (camelCase 변환, NULL 처리 등)
     * - mapperLocations: SQL이 작성된 XML 파일 위치 (mapper/mysql/** 하위 전부)
     */
    @Bean
    @Primary
    @Qualifier("mysqlSqlSessionFactory")
    public SqlSessionFactory mysqlSqlSessionFactory(@Qualifier("mysqlDataSource") DataSource mysqlDataSource) throws Exception {
        final SqlSessionFactoryBean sessionFactoryBean = new SqlSessionFactoryBean();
        sessionFactoryBean.setDataSource(mysqlDataSource);

        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        sessionFactoryBean.setConfigLocation(resolver.getResource("classpath:mybatis-config.xml"));
        sessionFactoryBean.setMapperLocations(resolver.getResources("classpath:mapper/mysql/**/*.xml"));

        return sessionFactoryBean.getObject();
    }

    /**
     * SqlSessionTemplate — 트랜잭션이 관리되는 SqlSession
     * Service에서 @Transactional을 쓸 수 있는 이유가 이 빈 덕분
     */
    @Bean
    @Primary
    @Qualifier("mysqlSqlSessionTemplate")
    public SqlSessionTemplate mysqlSqlSessionTemplate(@Qualifier("mysqlSqlSessionFactory") SqlSessionFactory mysqlSqlSessionFactory) {
        return new SqlSessionTemplate(mysqlSqlSessionFactory);
    }

}
