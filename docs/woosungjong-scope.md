# 우성종 파트 범위 정의

## 목적

이 문서는 현재 협업 맥락에서 `우성종 파트`를 어떤 제품 범위로 해석하고 작업할지 정리한 문서다.

현재 Figma `node 204:694`와 코드베이스 상태를 기준으로 보면, 우선순위상 가장 먼저 다뤄야 할 영역은 MVP의 `Capture` 구간이다.

따라서 우성종 파트는 당분간 아래 범위를 담당하는 것으로 정의한다.

추가로, 이 범위를 실제로 구현할 때의 세부 기준은 `docs/woosungjong-wireframe-mode.md`를 따른다.

- 범위 정의는 이 문서
- 구현 기준은 `woosungjong-wireframe-mode.md`

## 담당 범위

### 1. Home Entry

- 홈에서 사용자가 무엇을 먼저 해야 하는지 이해하는 영역
- 카메라/FAB 또는 분석 시작 CTA
- 식사 시간 선택 진입 맥락
- 저장 중이던 기록 복구 진입

### 2. Scan Entry

- 스캔 페이지 진입
- 식사 시간 컨텍스트 표시
- 촬영/업로드 시작 UX
- 스캔 전 안내와 기대값 정리

### 3. Capture Flow

- 사진 업로드/촬영
- AI 분석 시작
- 분석 중 상태
- 분석 완료까지의 첫 구간 UX

### 4. Capture Recovery

- 게스트 상태 저장
- 로그인 전 기록 복구
- 재진입 시 이어하기 UX

## 현재 코드 기준 소유 파일

### 직접 소유

- `src/app/page.tsx`
- `src/app/scan/page.tsx`
- `src/components/FoodScanner.tsx`
- `src/components/home/HomeOnboardingSection.tsx`
- `src/components/home/RestorePendingMeal.tsx`
- `src/components/layout/BottomNavigation.tsx`

### 인접 연동

- `src/components/scan/FoodAnalysisResult.tsx`
- `src/components/scan/FoodEditBottomSheet.tsx`
- `src/app/api/analyze-image/route.ts`
- `src/components/restore/RestoreManager.tsx`
- `src/lib/userId.ts`
- `src/lib/db.ts`

## 이 파트의 성공 기준

- 홈에서 사용자가 3초 안에 "지금 뭘 해야 하는지" 이해할 수 있다.
- 사용자가 식사 시간 맥락과 함께 스캔으로 진입할 수 있다.
- 분석 시작부터 결과 확인까지의 UX가 한 덩어리로 느껴진다.
- 게스트 저장/복구 흐름이 홈과 스캔 경험을 방해하지 않고 이어진다.
- 기존 화면을 손본 수준이 아니라, 우성종 와이어프레임 구조를 우선한 화면으로 보인다.

## 이 파트에서 당장 하지 않는 것

- 역추산 추천 로직 고도화
- 식당 상세/지도 탐색
- 피드/커뮤니티
- 주간/월간 분석 대시보드

이 영역은 각각 `Decision`, `Explore`, `Retention` 트랙에서 후속으로 다룬다.
