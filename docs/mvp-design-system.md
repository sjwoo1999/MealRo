# MealRo MVP Design System

## 목적

이 문서는 MealRo의 **베타/MVP 단계에서 바로 사용할 최소 디자인 시스템**을 정의한다.

지금 단계의 목표는 완성형 브랜드 가이드가 아니라 아래 두 가지다.

1. 화면을 빠르게 추가해도 스타일이 흔들리지 않게 하기
2. 홈 -> 스캔 -> 결과 -> 피드 흐름을 일관된 규칙으로 유지하기

## 적용 범위

현재 이 문서의 기준이 직접 적용되는 영역:

- 홈
- 스캔
- 분석 결과
- 베타 피드
- Coming Soon 화면
- Bottom Navigation
- 공통 버튼 / 카드 / 시트 / 입력창

## 핵심 원칙

### 1. 설명보다 행동

- 한 화면에는 가능한 한 하나의 주 행동만 둔다
- 긴 설명 블록보다 버튼, 선택지, 입력 영역이 먼저 보여야 한다
- 사용자는 읽는 사람이 아니라 바로 누르는 사람으로 본다

### 2. 모바일 우선

- 모든 핵심 화면은 모바일 1열 기준으로 설계한다
- 데스크톱은 2열 확장만 허용하고, 구조 자체를 새로 만들지 않는다
- BottomNav와 FAB 중심 구조를 유지한다

### 3. 단순한 시각 언어

- 흰 배경
- 검정 border
- 제한된 회색 배경
- 강한 primary CTA만 검정 배경
- 장식용 gradient, 과한 badge, 과한 shadow는 MVP에서 최소화한다

### 4. 상태는 짧게

- `불러오는 중...`
- `저장 중입니다.`
- `추후 개발될 예정이에요.`

이 정도 수준의 짧은 문구만 사용한다.

## 디자인 토큰

현재 기준 토큰 소스:

- [globals.css](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/styles/globals.css)

### Color

- `--color-bg`: 앱 전체 배경
- `--color-surface`: 기본 카드/패널 배경
- `--color-surface-muted`: 보조 블록 배경
- `--color-border`: 기본 경계선
- `--color-text`: 기본 텍스트
- `--color-text-muted`: 보조 텍스트
- `--color-primary`: 포인트 컬러
- `--color-primary-soft`: 약한 강조 배경

MVP 화면에서는 실제 사용 기준을 아래처럼 단순화한다.

- 기본 배경: 흰색 또는 매우 옅은 회색
- 기본 선: 검정
- 기본 텍스트: 진한 검정
- 보조 텍스트: 중간 회색
- 핵심 버튼: 검정 배경 / 흰 글자

### Radius

- `--radius-sm`: 12px
- `--radius-md`: 16px
- `--radius-lg`: 20px
- pill: 999px

MVP 권장 규칙:

- 버튼/입력: 14~16px
- 카드: 20~28px
- FAB: 원형

### Shadow

MVP에서는 shadow를 거의 쓰지 않는다.

- 기본 카드: `shadow-none`
- 모달/시트: 필요한 경우만 약하게 사용

## Typography

- 기본 폰트: Pretendard Variable
- 화면 제목: `text-3xl` 전후, semibold
- 섹션 제목: `text-xl` 또는 `text-2xl`, semibold
- 본문: `text-sm`
- 메타 정보/보조 라벨: `text-xs`

규칙:

- 제목은 짧게
- 본문은 2줄 이내 우선
- 상태 문구는 1줄 우선

## 레이아웃 규칙

### 공통 페이지

- 모바일 기준 `max-w-md` 또는 `PageShell width="narrow"`
- 섹션 간 간격: `space-y-4` 또는 `space-y-5`
- 한 카드 안의 콘텐츠 간격: `gap-3`, `gap-4`

### 데스크톱 확장

- 홈/스캔/결과는 필요할 때만 2열
- 모바일 구조가 깨지지 않는 범위에서만 확장

## 컴포넌트 규칙

### Button

기준 파일:

- [Button.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/Button.tsx)

사용 규칙:

- Primary: 검정 배경 / 흰 글자 / 핵심 CTA
- Outline: 흰 배경 / 검정 border / 보조 행동
- Ghost: MVP에선 최소 사용

버튼 문구 규칙:

- `기록 시작`
- `저장하기`
- `수정하기`
- `홈`

처럼 짧게 쓴다.

### Card

기준 파일:

- [Card.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/Card.tsx)

사용 규칙:

- 기본 카드: 흰 배경 + 검정 border
- 정보 정리용 카드만 허용
- 카드 안에 또 카드가 필요한 경우는 최소화

### Bottom Navigation

기준 파일:

- [BottomNavigation.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/layout/BottomNavigation.tsx)

규칙:

- 모바일에서만 표시
- 슬롯 최대 5개
- 가운데 FAB는 스캔 진입
- active 상태는 가볍게만 표시
- 설명 캡션 금지

### Bottom Sheet

기준 파일:

- [FoodEditBottomSheet.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/scan/FoodEditBottomSheet.tsx)

규칙:

- 수정 가능한 필드는 최소화
- 현재는 `이름`, `섭취량`, `저장`
- 설명 문구는 한 줄만

### Coming Soon

기준 파일:

- [ComingSoonPage.tsx](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/src/components/common/ComingSoonPage.tsx)

규칙:

- 미구현 화면은 길게 설명하지 않는다
- `추후 개발될 예정이에요` 수준으로 끝낸다
- 다음 행동은 `기록하기` 또는 `홈`

## 화면 패턴

### 홈

구성:

- 질문 1개
- 식사 시간 선택 4개
- 기록 시작 CTA 1개

금지:

- 플로우 설명 보드
- 긴 안내 문구
- 상태 설명용 카드 다수

### 스캔

구성:

- 뒤로가기
- 식사 시간 선택
- 업로드 영역

금지:

- 단계 설명 여러 개
- 업로드 안내 장문

### 결과

구성:

- 총 칼로리
- 음식 목록
- 수정하기
- 저장하기

금지:

- 체크리스트 카드
- 복잡한 상태 설명
- 장문 reasoning 노출

### 베타 피드

구성:

- 최신 기록 리스트
- 음식명
- 시간
- 칼로리
- 식사 타입

금지:

- 개인화 전제 UX
- 복잡한 필터
- 소셜 인터랙션

## 카피 규칙

좋은 예:

- `어떤 식사인가요?`
- `기록 시작`
- `저장하기`
- `불러오는 중...`
- `추후 개발될 예정이에요`

피해야 할 예:

- “이 화면에서는 사용자가 다음과 같은 흐름으로...”
- “현재 MVP 기준으로 이후 분기가...”
- “본 서비스는 ... 하기 위해 설계되었습니다”

## 구현 우선순위

### 1차

- 홈
- 스캔
- 결과
- BottomNav

### 2차

- 베타 피드
- Coming Soon 템플릿
- 마이페이지/추천/탐색 placeholder 통일

### 3차

- 추천
- 탐색
- 개인 기록/설정

## 리뷰 체크리스트

새 화면을 만들 때 아래를 확인한다.

1. 이 화면의 주 행동이 1개로 보이는가
2. 첫 화면에서 설명보다 버튼/선택지가 먼저 보이는가
3. 모바일 1열 기준으로 바로 쓸 수 있는가
4. 버튼 문구가 짧은가
5. 카드 수가 과하지 않은가
6. 미구현 기능을 길게 설명하고 있지 않은가
7. BottomNav가 콘텐츠보다 더 눈에 띄지 않는가

## 결론

MealRo MVP 디자인 시스템의 핵심은 “예쁘게 통일”이 아니라 “빠르게, 짧게, 행동 중심으로 통일”이다.

지금 단계에서는 이 문서를 기준으로:

- 설명을 줄이고
- 공통 규칙을 고정하고
- 스캔 중심 플로우를 빠르게 확장하는 것이 맞다.
