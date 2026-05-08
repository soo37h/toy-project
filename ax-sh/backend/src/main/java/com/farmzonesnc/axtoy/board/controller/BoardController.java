package com.farmzonesnc.axtoy.board.controller;

import org.springframework.web.bind.annotation.*;

import com.farmzonesnc.axtoy.board.service.BoardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

}
