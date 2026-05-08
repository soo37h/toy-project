package com.farmzonesnc.axtoy.board.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.farmzonesnc.axtoy.board.mapper.BoardMapper;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardMapper boardMapper;

    
}
