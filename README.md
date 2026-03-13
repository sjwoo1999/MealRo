# MealRo

MealRo는 음식 사진을 분석하고, 남은 끼니 추천과 주변 탐색까지 이어지는 모바일 우선 식사 기록 MVP입니다.

현재 브랜치 기준 제품 상태는 `로그인 없는 베타 모드`입니다.

## 현재 MVP 범위

- `홈`: 카메라 중심 진입 허브, 식사 선택 후 바로 기록 시작
- `스캔`: 사진 업로드/분석/수정/저장
- `추천`: 기준 메뉴를 바탕으로 남은 끼니 조합 계산
- `주변 탐색`: 지도와 리스트 기반 식당 탐색
- `식당 상세`: 추천 후보의 거리/영업시간/가격대/메뉴 확인
- `도착 확인`: 탐색 이후 실제 방문 루프 확인
- `피드`: 공개 베타 피드
- `기록 보관함`: 저장된 기록 재조회
- `기록 상세`: 저장된 식사 기록 재조회
- `분석`: 베타 기록 기준 최소 리포트
- `마이`: 베타 허브, 온보딩/목표/연동 화면 진입, 익명 ID 초기화

## 현재 제품 모드

- 회원가입 없이 사용 가능
- 익명 ID 기반 저장
- 식사 기록은 클라우드 저장 우선
- 베타 피드에서 다른 테스터 기록 조회 가능
- 추천 저장 결과도 베타 피드에 노출 가능

## 핵심 플로우

1. `/`에서 식사 시간 선택
2. `/scan`에서 음식 사진 업로드
3. 분석 결과 확인 후 저장
4. 필요하면 `/meal`에서 추천 계산
5. `/nearby`에서 주변 식당 탐색
6. `/nearby/[id]`에서 식당 상세 확인
7. `/nearby/[id]/arrived`에서 도착 확인
8. `/feed` 또는 `/history`에서 피드/보관함 확인
9. `/history/[id]`에서 기록 상세 확인
10. `/insights`에서 최소 분석 리포트 확인

## 기술 스택

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Dexie.js
- OpenAI Vision 기반 분석 경로

## 디자인 시스템 기준

현재 UI는 완성형 브랜드 시스템보다 `MVP 운영용 디자인 시스템 v1` 기준으로 정리되어 있습니다.

- 문서: [docs/design-system-v1.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/design-system-v1.md)
- 보조 문서: [docs/mvp-design-system.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/mvp-design-system.md)

핵심 원칙:

- 모바일 우선
- 설명보다 행동
- 흑백 중심의 단순한 UI
- 공용 컴포넌트 우선 사용

## 실행 방법

### 1. 환경 변수

`.env.local`에 최소 아래 값이 필요합니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
OPENAI_API_KEY=...
```

선택:

```bash
NEXT_PUBLIC_KAKAO_MAPS_APP_KEY=...
```

### 2. 개발 서버

```bash
npm install
npm run dev
```

### 3. 프로덕션 빌드 확인

```bash
npm run build
npm run start
```

주의:

- `npm run start`는 기존 `.next` 빌드를 실행합니다.
- 코드 변경 반영 확인은 `npm run dev` 또는 `npm run build && npm run start`로 해야 합니다.

### 4. smoke test

```bash
npm run test:smoke
```

현재 smoke 범위:

- 홈
- 스캔
- 추천
- 주변 탐색
- 식당 상세
- 도착 확인
- 공개 피드
- 기록 보관함
- 분석
- 마이페이지

## 주요 경로

- `/`
- `/scan`
- `/meal`
- `/nearby`
- `/nearby/[id]`
- `/nearby/[id]/arrived`
- `/insights`
- `/history`
- `/feed`
- `/history/[id]`
- `/mypage`
- `/onboarding`

## 관련 문서

- [docs/refactor-prd.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/refactor-prd.md)
- [docs/design-system-v1.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/design-system-v1.md)
- [docs/mvp-gap-analysis.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/mvp-gap-analysis.md)
- [docs/woosungjong-wireframe-mode.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/woosungjong-wireframe-mode.md)

## 베타 운영 메모

- 기록 목록은 클라우드 기준으로 조회합니다.
- `/feed`는 공개 베타 피드입니다.
- `/history`는 저장 기록을 다시 보는 보관함입니다.
- 익명 ID는 브라우저 localStorage에 저장됩니다.
- `마이 > 테스터 ID 초기화`로 새 익명 테스터처럼 다시 시작할 수 있습니다.

베타 운영 전 체크리스트는 아래 문서를 참고합니다.

- [docs/beta-ops-checklist.md](/Users/_woo_s.j/Desktop/woo/workspace/MealRo/docs/beta-ops-checklist.md)
