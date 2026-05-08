# Database

이 폴더에 직접 DDL과 테스트 데이터를 작성하세요.

```
database/
├── schema/          ← 테이블 생성 DDL (.sql)
├── seed/            ← 테스트 데이터 INSERT (.sql)
└── README.md
```

## 규칙

- 테이블/컬럼명: `snake_case`
- PK: `[테이블명]_id` BIGINT AUTO_INCREMENT
- 생성일: `created_at` DATETIME DEFAULT NOW()
- 수정일: `updated_at` DATETIME DEFAULT NOW() ON UPDATE NOW()
- 작성자/수정자: `created_by`, `updated_by` VARCHAR(50)
- 사용여부: `status` VARCHAR(1) — 'y'(사용), 'n'(미사용), 'd'(삭제)
- Boolean 성격: `[name]_yn` VARCHAR(1) — 'y' 또는 'n'
- 엔진: InnoDB, 인코딩: utf8mb4
- COMMENT 필수 (테이블, 컬럼 모두)

상세 가이드는 `database-sql-guide` Skill 참조.
