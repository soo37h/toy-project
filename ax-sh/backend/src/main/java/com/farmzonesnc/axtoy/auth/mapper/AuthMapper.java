package com.farmzonesnc.axtoy.auth.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.farmzonesnc.axtoy.app.database.MySQL;
import com.farmzonesnc.axtoy.auth.domain.Member;

@Mapper
@MySQL
public interface AuthMapper {

    int countByEmail(String email);

    Member findByEmail(String email);

    int insertMember(Member member);
}