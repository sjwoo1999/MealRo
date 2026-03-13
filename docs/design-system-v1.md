# MealRo Design System v1

## 목적

이 문서는 MealRo의 **현재 개발 기준이 되는 공식 디자인 시스템 v1**이다.

대상은 베타/MVP이며, 목표는 아래 두 가지다.

1. 공통 UI 규칙을 고정한다
2. 새 화면을 만들 때 같은 언어로 빠르게 만든다

브랜드 확장이나 마케팅 사이트용 시스템이 아니라, **제품 UI 운영용 시스템**으로 본다.

## Source Of Truth

우선순위는 아래 순서로 본다.

1. [design-system-v1.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/design-system-v1.md)
2. [mvp-design-system.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/mvp-design-system.md)
3. [globals.css](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/styles/globals.css)
4. 공용 primitive 구현

## 디자인 원칙

### 1. Action First

- 설명보다 행동이 먼저 보여야 한다
- 한 화면의 주 행동은 1개를 우선한다
- 읽게 만드는 UI보다 누르게 만드는 UI를 택한다

### 2. Mobile First

- 모바일 1열이 기본이다
- 데스크톱은 확장일 뿐, 별도 제품으로 만들지 않는다
- BottomNav + FAB 구조를 유지한다

### 3. Reduced Surface Language

- 흰 배경
- 검정 border
- 약한 회색 보조 배경
- shadow 최소화
- primary CTA만 강하게

### 4. Short Copy

- 문장은 짧게
- 상태 문구는 1줄
- 안내는 최소화

## 토큰 v1

기준 파일:

- [globals.css](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/styles/globals.css)

### Color Roles

- `bg/base`: white
- `bg/subtle`: `#f7f7f7`
- `border/base`: `#111111`
- `text/base`: slate-900 계열
- `text/subtle`: slate-500 계열
- `action/primary`: black
- `action/primary-text`: white

### Radius

- `radius/control`: 14px ~ 16px
- `radius/card`: 20px
- `radius/sheet`: 28px
- `radius/pill`: 999px

### Space

- `space/page-y`: 24px
- `space/section`: 20px
- `space/block`: 16px
- `space/item`: 12px
- `space/tight`: 8px

### Typography

- page title: `text-3xl`, semibold
- section title: `text-xl` or `text-2xl`, semibold
- body: `text-sm`
- meta: `text-xs`

### Elevation

- 기본: 없음
- 예외: modal/sheet만 약하게 허용

## 공식 Primitive v1

이 목록 밖의 공통 컴포넌트는 아직 공식 primitive가 아니다.

### 1. Button

기준 파일:

- [Button.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/Button.tsx)

variant:

- `primary`
- `secondary`
- `outline`
- `ghost`

규칙:

- primary = 검정 배경
- secondary = 흰 배경 + 검정 테두리
- outline = 흰 배경 + 검정 테두리
- ghost = 최소 사용

### 2. Card

기준 파일:

- [Card.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/Card.tsx)

규칙:

- 흰 배경
- 검정 테두리
- 20px 라운드
- shadow 없음

### 3. PageShell

기준 파일:

- [PageShell.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/PageShell.tsx)

width:

- `narrow`
- `default`
- `wide`

규칙:

- 모바일 중심 화면은 `narrow`
- 목록/탐색 성격은 `default`
- 지도/대시보드형만 `wide`

### 4. BottomNavigation

기준 파일:

- [BottomNavigation.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/layout/BottomNavigation.tsx)

규칙:

- 모바일 전용
- 중앙 FAB는 스캔 진입
- 라벨은 짧게
- active 강조는 약하게

### 5. Dialog

기준 파일:

- [dialog.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/ui/dialog.tsx)

하위 구성:

- `Dialog`
- `DialogContent`
- `DialogHeader`
- `DialogTitle`
- `DialogDescription`
- `DialogFooter`

사용 대상:

- 확인 모달
- 복구 모달
- 경고 모달

### 6. Sheet

기준 파일:

- [sheet.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/ui/sheet.tsx)

하위 구성:

- `Sheet`
- `SheetContent`
- `SheetHeader`
- `SheetTitle`
- `SheetDescription`
- `SheetFooter`

사용 대상:

- 모바일 수정 시트
- 하단 액션 패널

### 7. Input / Select

기준 파일:

- [Input.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/Input.tsx)
- [Select.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/Select.tsx)

규칙:

- 단일 입력 목적만
- 장식형 필드 금지
- border는 검정 또는 강한 중립색

## 공식 화면 패턴 v1

### Home Entry

구성:

- 질문 1개
- 식사 시간 선택 4개
- 기록 CTA 1개

### Scan

구성:

- 뒤로가기
- 식사 선택
- 업로드 영역

### Result

구성:

- 총 칼로리
- 음식 목록
- 수정
- 저장

### Feed

구성:

- 최신순 리스트
- 음식명
- 시간
- 칼로리
- 식사 타입

### Coming Soon

구성:

- 제목
- 짧은 설명
- 홈 / 기록하기 버튼

## 카피 가이드 v1

좋은 예:

- `어떤 식사인가요?`
- `기록 시작`
- `수정하기`
- `저장하기`
- `불러오는 중...`
- `추후 개발될 예정이에요`

나쁜 예:

- “현재 MVP 기준으로…”
- “이 화면은 다음과 같은 흐름으로…”
- “사용자는 이 단계를 통해…”

## 사용 규칙

새 컴포넌트나 새 화면을 만들 때:

1. 먼저 기존 primitive로 조합 가능한지 본다
2. 안 되면 새 primitive가 아니라 로컬 컴포넌트로 만든다
3. 같은 패턴이 3번 이상 반복될 때만 primitive 승격을 검토한다

## 금지 사항

- raw hex 남발
- shadow-heavy 카드
- gradient 남발
- 설명 카드 다수 배치
- 동일 역할 버튼 variant 혼용
- 모바일에서 2개 이상의 핵심 CTA 동시 강조

## 다음 단계

v1 이후 바로 해야 할 일:

1. `SimpleSnackbar`를 toast primitive로 승격
2. `Input`, `Select`, `Header`를 v1 기준으로 추가 정리
3. 피드/추천/탐색 화면에 같은 패턴 강제

## 결론

MealRo 디자인 시스템 v1은 “예쁜 시스템”이 아니라 “흔들리지 않는 개발 기준”이다.

지금부터는:

- 토큰은 `globals.css`
- primitive는 `common/` + `ui/`
- 화면은 이 문서 패턴

이 기준으로만 확장하는 것이 맞다.
