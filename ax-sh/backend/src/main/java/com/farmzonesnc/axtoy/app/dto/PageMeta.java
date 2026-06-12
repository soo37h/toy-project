package com.farmzonesnc.axtoy.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Getter;

/**
 *  목록 조회 API에서 페이징 정보를 응답에 담기 위한 클래스
 */

@Getter
@JsonInclude
public class PageMeta {
    private final int page;          // 현재 페이지
    private final int totalPages;    // 전체 페이지 수
    private final int pageSize;      // 한 페이지에 보여줄 데이터 개수
    private final long totalItems;   // 전체 데이터 개수

    private PageMeta(int page, int totalPages, int pageSize, long totalItems) {
        this.page = page;              
        this.totalPages = totalPages;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
    }

    public static PageMeta of(int page, int pageSize, long totalItems) {
        int totalPages = pageSize <= 0
                ? 0
                : (int) Math.ceil((double) totalItems / pageSize);

        return new PageMeta(page, totalPages, pageSize, totalItems);
    }
}