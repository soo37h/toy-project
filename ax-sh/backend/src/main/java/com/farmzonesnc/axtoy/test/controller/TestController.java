package com.farmzonesnc.axtoy.test.controller;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

	@GetMapping
	public Map<String, Object> initialize() {
		
		Map<String, Object> returnMap = new LinkedHashMap<>();
		returnMap.put("result", true);
		returnMap.put("resultMsg", "HELLO WORLD");
		returnMap.put("timestamp", LocalDateTime.now());
		
		return returnMap;

	}
	
}
