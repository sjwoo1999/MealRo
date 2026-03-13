# MealRo MVP 갭 분석

## 문서 목적

이 문서는 Figma 보드 `node 204:694`에서 읽히는 MVP 방향과 현재 코드베이스를 비교해서,

- 이미 구현된 것
- 부분적으로만 구현된 것
- 아직 거의 없는 것

을 구분하기 위한 문서다.

상태 표기는 아래 기준을 따른다.

- `구현됨`: 사용자 흐름이 실제로 동작한다.
- `부분 구현`: 화면 또는 일부 로직은 있으나 핵심 연결이 비어 있다.
- `미구현`: 페이지/흐름/데이터 연결이 사실상 없다.

## 요약

현재 코드베이스는 `분석`, `역추산 추천`, `익명 저장`, `이메일 인증`, `온보딩`까지는 MVP 형태가 존재한다.

반면, Figma 보드에서 중요하게 보이는 `지도 기반 추천`, `추천 상세`, `방문 확인`, `분석 대시보드 정식화`, `피드`는 아직 부분 구현 또는 미구현 상태가 많다.

## 기능별 비교

| 기능 영역 | Figma 의도 | 현재 상태 | 판정 | 근거 코드 | 다음 액션 |
| --- | --- | --- | --- | --- | --- |
| 식사 시간 선택 진입 | 아침/점심/저녁/간식 선택 후 입력 시작 | 추천 플로우에서는 끼니 선택 가능, 스캔 플로우에서는 분리된 전단계 UX가 약함 | 부분 구현 | `src/components/planner/MealSlotPicker.tsx`, `src/app/meal/page.tsx` | 스캔/추천 공통 시작점으로 재정리 |
| 카메라 FAB 중심 진입 | 하단 중앙 FAB로 빠른 입력 시작 | 하단 내비 중앙 FAB로 `/scan` 진입 가능 | 구현됨 | `src/components/layout/BottomNavigation.tsx`, `src/app/scan/page.tsx` | 홈과 FAB 진입 메시지 일관화 |
| 음식 촬영/업로드 | 촬영 후 바로 AI 분석 | 업로드/드래그 기반 분석과 저장 흐름 존재 | 구현됨 | `src/components/FoodScanner.tsx`, `src/app/api/analyze-image/route.ts` | 모바일 카메라 UX와 식사 시간 연결 강화 |
| AI 분석 결과 | 칼로리/영양 정보 결과 화면 | 결과 카드, 수정 바텀시트, 후보 선택 존재 | 구현됨 | `src/components/scan/FoodAnalysisResult.tsx`, `src/components/scan/FoodEditBottomSheet.tsx` | 결과 화면을 새로운 디자인 시스템으로 재정리 |
| 분석 후 저장/복구 | 기록 유지 및 계정 전환 | 게스트 저장, Dexie 복구, 로그인 전환 흐름 존재 | 부분 구현 | `src/components/FoodScanner.tsx`, `src/components/restore/RestoreManager.tsx`, `src/lib/db.ts` | 저장 성공/실패 UX와 서버 저장 경로 정식화 |
| 역추산 추천 | 현재 식사를 기준으로 나머지 끼니 추천 | 추천 API와 추천 UI 존재 | 구현됨 | `src/components/planner/PlannerForm.tsx`, `src/app/api/planner/recommend/route.ts`, `src/lib/reverse-calc.ts` | 저장과 히스토리 연결 마무리 |
| 사용자 목적 기반 추천 | 식단 목적별 추천 | 온보딩으로 목표 계산은 있으나 추천 로직과의 연결은 제한적 | 부분 구현 | `src/app/api/user/profile/route.ts`, `src/lib/kdri-calculator.ts`, `src/components/planner/PlannerForm.tsx` | 프로필 기반 추천 기준을 명시적으로 강화 |
| 위치 기반 식당 추천 | 지도에서 근처 추천 탐색 | 위치 권한, 지도, 근처 API는 있으나 mock fallback 의존 | 부분 구현 | `src/app/nearby/page.tsx`, `src/app/api/restaurants/nearby/route.ts` | 실제 추천 데이터/정렬 로직 정비 |
| 식당/메뉴 상세 | 후보 상세 정보 제공 | 일부 상세/브리지 페이지가 있으나 Figma 흐름 기준으로는 정리 부족 | 부분 구현 | `src/app/item/[id]/page.tsx`, `src/app/item/[id]/go/page.tsx` | 추천 상세 구조를 식당 상세 기준으로 재설계 |
| 방문 확인/도착 플로우 | "도착했나요?" 같은 행동 확인 | 명확한 방문 체크 핵심 흐름은 거의 없음 | 미구현 | 관련 Figma만 존재 | 위치/체크인 여부 결정 후 별도 기능화 |
| 분석 대시보드 | 주간/월간 리포트, 누적 분석 | 화면은 있으나 정적/목업 수준 | 부분 구현 | `src/app/insights/page.tsx` | 실제 데이터 기반 차트/요약으로 대체 |
| 식사 이력 | 누적 식사 확인 | 일부 이력 페이지와 로그 API 존재 | 부분 구현 | `src/app/history/page.tsx`, `src/app/api/food/history/route.ts`, `src/app/meal/history/page.tsx` | 분석/추천 이력을 하나의 정보 구조로 통합 |
| 피드/커뮤니티 | 다른 사용자/맛집 탐색 | 피드 페이지는 플레이스홀더 수준 | 미구현 | `src/app/feed/page.tsx` | MVP 후순위로 보류 또는 최소 카드형 목록만 구현 |
| 인증/로그인 전환 | 게스트에서 회원 전환 | 이메일 인증코드 기반 흐름 존재 | 구현됨 | `src/app/auth/page.tsx`, `src/app/api/auth/send-code/route.ts`, `src/app/api/auth/verify-code/route.ts` | UX 정리와 디자인 시스템 적용 |
| 온보딩 개인화 | 목표/기초정보 입력 후 맞춤화 | 프로그레시브 온보딩과 계산 로직 존재 | 부분 구현 | `src/components/onboarding/*`, `src/contexts/OnboardingContext.tsx` | 추천/분석과의 연결 고도화 |

## 구현 상태별 정리

## 이미 MVP 자산으로 활용 가능한 영역

- 카메라 진입
- 이미지 분석
- 분석 결과 UI
- 역추산 추천
- 이메일 인증
- 익명 저장과 일부 복구 구조

이 영역은 새로 만들기보다 리팩토링과 연결 정리가 우선이다.

## 기능은 있으나 MVP 흐름에 맞게 다시 묶어야 하는 영역

- 온보딩과 추천 연결
- 저장과 이력 연결
- 위치 기반 추천과 지도 연결
- 식당/메뉴 상세 화면 구조
- 대시보드 데이터화

이 영역은 "없다"기보다 "산재해 있다"에 가깝다.

## 현재는 후순위 또는 별도 트랙으로 보는 게 맞는 영역

- 피드/커뮤니티
- 방문 확인 플로우
- 완성형 소셜 경험

## 가장 큰 구조적 갭

### 1. Figma는 하나의 연속된 사용자 여정을 보여주지만, 현재 코드는 기능별 화면으로 쪼개져 있다.

- 분석
- 추천
- 지도
- 대시보드

각 영역은 존재하지만 연결 UX가 약하다.

### 2. MVP 핵심은 `분석 후 다음 행동 제안`인데, 현재는 `분석 완료`와 `추천/탐색`이 느슨하게 분리돼 있다.

즉, 기능은 있으나 제품 경험은 아직 하나로 묶이지 않았다.

### 3. 시각 시스템과 페이지 셸이 통일되지 않아, 같은 제품 안에서도 화면 성격이 다르게 보인다.

이 때문에 피그마 방향을 반영하려면 기능 구현 이전에 공통 셸과 프리미티브 정리가 필요하다.

## 리팩토링 우선순위 제안

1. `Capture + Decision`
   - 스캔
   - 분석 결과
   - 추천 진입 연결

2. `Recommendation + Explore`
   - 역추산 추천
   - 위치 기반 추천
   - 상세 화면

3. `Retention`
   - 이력
   - 대시보드
   - 계정 전환과 복구 UX

## 결론

현재 프로젝트는 완전히 빈 상태가 아니라, MVP의 핵심 기능 대부분이 이미 조각 형태로 들어가 있다.

따라서 앞으로의 작업은 "새로 다 만들기"보다 아래에 가깝다.

- 이미 있는 기능을 하나의 사용자 여정으로 재배치
- 시각 시스템과 셸 정리
- 부분 구현 영역을 제품 흐름 기준으로 완성
