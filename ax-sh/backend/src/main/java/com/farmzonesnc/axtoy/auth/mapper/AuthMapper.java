package com.farmzonesnc.axtoy.auth.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.farmzonesnc.axtoy.app.database.MySQL;
import com.farmzonesnc.axtoy.auth.domain.Member;

@Mapper
@MySQL
public interface AuthMapper {
	/*
	 * Java 코드에서 DB SQL을 호출하기 위한 인터페이스
	 * 각 메서드는 AuthMapper.xml 의 SQL과 연결된다.
	 */

    int countByEmail(String email);

    Member findByEmail(String email);

    int insertMember(Member member);
}