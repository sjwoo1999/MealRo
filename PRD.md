{
  "task": "MealRo PRD/IA/User Flow/UI System 구체화 및 실행 가능한 개발 산출물 생성",
  "context": {
    "service_name": "MealRo",
    "current_state": {
      "data_pipeline": "전처리/정규화/라벨링 완료(분석 불가 항목은 제외 정책 적용). 음식군 평균 영양값 매핑 기반.",
      "constraints": [
        "MVP는 로그인 없이 사용 가능(익명 사용).",
        "아침/점심/저녁 포함.",
        "기술 스택은 Supabase 사용.",
        "쿠팡 링크/편의점 재고 등 외부 연동은 법적 리스크를 고려해 '안전한 범위'에서만 설계."
      ]
    },
    "non_goals": [
      "카메라 기반 음식 인식(Phase 2로 보류)",
      "음성 입력(Phase 2로 보류)",
      "정밀 EER/탄단지 개인화(Phase 2로 보류)",
      "편의점 실시간 재고 조회(공식 API/제휴 없으면 보류)"
    ],
    "data_notes": {
      "nutrition_source_policy": "음식군 평균 영양값 기반 추정치이며 실제와 다를 수 있음. UI에 추정/면책 문구 필요.",
      "excluded_examples": [
        "seafood_sashimi (모둠회/사시미 등 구성 불명)",
        "korean_meat_raw (원재료/생고기 계열 중 섭취 형태/중량 불명)"
      ],
      "open_question": "영양값 단위(per 100g vs per serving)는 파일 기준을 확인해 확정해야 함."
    }
  },
  "deliverables": {
    "A_PRD": {
      "format": "Markdown",
      "must_include_sections": [
        "1. Problem / Target Users (설문 233명 인사이트를 '의도-행동 간극', '입력 마찰' 중심으로 정리)",
        "2. Goals & Non-Goals (정량 KPI는 '추측' 표시 가능)",
        "3. MVP Scope (In/Out)",
        "4. Core User Journeys (로그인 없이 3끼 추천→선택→외부 링크→복귀)",
        "5. Functional Requirements (추천/필터/등급/브릿지 페이지/고지/이벤트 로깅)",
        "6. Non-Functional Requirements (성능/접근성/보안/프라이버시 최소수집)",
        "7. Data Model (Supabase tables/views, 익명 user id, events schema)",
        "8. Compliance Checklist (확실하지 않음 표시 포함: 제휴 고지/의료적 면책/표시광고 리스크)",
        "9. Analytics Plan (필수 이벤트 6~10개, 퍼널 정의)",
        "10. Release Plan (Sprint 1~2, 리스크/의존성/게이트)",
        "11. Open Questions (단위/등급규칙/링크 방식/재고 연동 여부)"
      ]
    },
    "B_IA": {
      "format": "Text + Mermaid",
      "must_include": [
        "사이트맵(최소): / (Home), /meal (아침/점심/저녁), /item/:id (옵션), /disclaimer, /about",
        "내비게이션 원칙: 탭 vs 세그먼트 구분",
        "상태: 로딩/에러/빈 상태 정의"
      ]
    },
    "C_UserFlow": {
      "format": "Mermaid sequence + bullet steps",
      "must_include_flows": [
        "Flow 1: 첫 방문(익명) → 끼니 선택 → 추천 리스트",
        "Flow 2: 카드 클릭 → 브릿지 페이지(고지/면책) → 외부 링크 오픈(인앱 브라우저) → 복귀",
        "Flow 3: 필터 적용/해제",
        "Flow 4: 제외 항목 처리(사용자에겐 노출 최소화, 내부 로깅만)"
      ]
    },
    "D_UI_System": {
      "format": "Design tokens + component specs (Tailwind 기준)",
      "must_include": [
        "8pt 그리드 기반 spacing scale",
        "typography scale(웹 rem 기준)",
        "color tokens(접근성: 색상만 의존 금지, dual-coding 원칙)",
        "핵심 컴포넌트: MealTabs, RecoCard, GradeBadge, FilterChips, BridgeModal/Page, SkeletonCard, Snackbar",
        "상태/변형: default/hover/disabled/loading"
      ]
    },
    "E_Engineering_Package": {
      "format": "Bullet + pseudo code + SQL",
      "must_include": [
        "Supabase schema SQL 초안(tables: menu_items, nutrition_group_avg, events)",
        "grade 산정 함수(서버/edge) pseudo-code",
        "추천 쿼리(끼니별/필터별) 예시",
        "익명 사용자 id 생성/저장 방식",
        "외부 링크 처리 방식(브릿지 페이지, UTM, affiliate disclosure 위치)"
      ]
    }
  },
  "implementation_constraints": {
    "privacy": [
      "MVP는 건강 관련 민감정보를 수집하지 않음(프로필/체중/질환 등 미수집).",
      "이벤트 로그는 익명 ID 기반."
    ],
    "legal": [
      "제휴 링크 고지 문구/위치는 최신 공정위 가이드 원문 확인 필요(확실하지 않음).",
      "의료적 면책 문구 필요(확실하지 않음: 정확 문구는 법무/정책 검토).",
      "편의점 재고/배달앱 데이터는 크롤링 금지(제휴/공식 API 없으면 보류)."
    ]
  },
  "output_style": {
    "language": "Korean",
    "tone": "무미건조, 사실 중심",
    "uncertainty_policy": "근거 불충분 시 '확실하지 않음' 또는 '추측입니다'로 명시",
    "tables": "가능한 곳은 표로 정리"
  },
  "questions_to_answer_in_output": [
    "MVP에서 '추천 품질'을 무엇으로 정의하고 측정할 것인가?",
    "음식군 평균 영양값 기반에서 발생하는 오차를 UX로 어떻게 관리할 것인가?",
    "로그인 없는 구조에서 리텐션을 어떻게 관찰/개선할 것인가?",
    "쿠팡 링크는 어떤 방식(검색 링크 vs 상품 링크)이 MVP에 적합한가?",
    "분석 불가 10~15% 항목은 어떤 기준으로 축소/확장할 것인가?"
  ]
}
