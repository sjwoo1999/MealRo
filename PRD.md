
# MealRo PRD/IA/User Flow/UI System (v2.0)

**Version:** 2.0.0 (Post-Auth Implementation)
**Status:** In Progress
**Context:** MVP/Demo for Technical Verification

## 1. Problem / Target Users
- **Problem:** 기존 식단 기록 앱들의 "가입 강제"와 "복잡한 입력 절차"로 인한 사용자 이탈.
- **Target Users:** 건강/식단 관리에 관심이 있지만, 매번 입력하는 귀찮음을 싫어하는 2030 세대.
- **Goal:** **"가장 빠른 식단 기록"**. 익명으로 즉시 사용 가능하며, 필요할 때만 가입하여 데이터를 영구 저장.

## 2. Key Features (Core Features)

### 1) AI Food Lens
- 음식 사진을 촬영/업로드하면 수 초 내에 음식명과 영양 정보 추정.
- **Top-N Candidates**: AI 확신(Confidence)이 80% 미만일 경우, **Top-3 후보군**을 제시하여 사용자 선택 유도.

### 2) 2-Tier Authentication System
익명(Anonymous) 탐색 후 이메일 인증(Verified)을 통한 계정 업그레이드 방식의 인증 시스템.

*   **Anonymous Tier**
    *   **Identifier**: `device_id` (localStorage UUID)
    *   **Capabilities**: 메뉴 스캔 체험, AI 분석 결과 조회 (임시), 주변 음식점 탐색, 메뉴 추천 조회.
    *   **Limitations**: 데이터 영구 저장 불가, 대시보드/히스토리 접근 불가.

*   **Verified Tier**
    *   **Identifier**: 이메일 인증 + JWT
    *   **Capabilities**: 모든 Anonymous 기능, 스캔 결과 영구 저장, 식단 히스토리, 영양 대시보드, 다기기 동기화.

*   **Auth Method**
    *   Email OTP (Passwordless via SendGrid).
    *   6-digit code, 3-minute expiry, max 5 attempts.
    *   Security: SHA256 해시 저장, HttpOnly JWT 쿠키.

### 3) Public Feed (Opt-in)
- 사용자가 동의한 기록만 익명으로 집계하여 "다른 사람들의 식단" 공유.
- **Timezone**: 모든 기록은 **한국 표준시(KST)** 기준으로 저장 및 표시.

### 4) Privacy by Design
- 업로드된 이미지는 분석 즉시 메모리에서 소멸 (No Storage).

## 3. Information Architecture (Sitemap)

### Public Routes
*   **`/` (Home/Scan)**: 🏠 메인 화면, 음식 스캔 진입점.
*   **`/meal` (Meal Recommend)**: 🍽️ AI 기반 메뉴 추천.
*   **`/nearby` (Nearby Map)**: 🗺️ 주변 음식점 지도.
*   **`/auth` (Authentication)**: 🔐 로그인/회원가입 (이메일 OTP).
*   **`/item/:id` (Item Detail)**: 📄 음식 상세 정보.
*   **`/disclaimer` (Disclaimer)**: ⚠️ 면책 조항.

### Protected Routes (Verified Only)
*   **`/dashboard` (Dashboard)**: 📊 영양 통계 대시보드. (Redirect to `/auth`)
*   **`/history` (History Log)**: 📜 식단 기록 히스토리. (Redirect to `/auth`)
*   **`/onboarding` (Onboarding)**: 🎯 초기 설정 (TDEE, 목표).

### Modal Triggers
*   **Upgrade Prompt Modal**: Anonymous 사용자가 '저장' 버튼 클릭 시 발생 → 회원가입/로그인 유도.
*   **Analysis Result Modal**: AI 분석 완료 시 결과 표시.

## 4. User Flows

### Flow 1: Anonymous → Verified Upgrade Flow
비로그인 사용자가 데이터 저장 시도 시 계정 업그레이드 유도.
1.  사용자가 음식 스캔 후 '저장' 버튼 클릭.
2.  시스템이 인증 상태 확인 (`isAuthenticated === false`).
3.  **UpgradePromptModal** 표시.
4.  사용자가 '회원가입' 또는 '로그인' 선택.
5.  `/auth` 페이지로 이동 (`returnUrl` 파라미터 포함).
6.  이메일 입력 → OTP 발송 → OTP 입력 → 검증.
7.  검증 성공 시:
    *   **신규**: User Profile 생성 + `claim_anonymous_data` 실행.
    *   **기존**: 로그인 처리.
8.  `returnUrl`로 리다이렉트 또는 `/dashboard`로 이동.

### Flow 2: Session Management Flow
JWT 기반 세션 관리 흐름.
1.  앱 시작 시 `AuthContext` 초기화.
2.  `/api/auth/me` 호출하여 세션 복원 시도.
3.  **성공**: Authenticated 상태, User 정보 저장.
4.  **실패 (401)**: Unauthenticated 상태, 쿠키 삭제.
5.  **로그아웃**: `/api/auth/logout` 호출, 상태 초기화.

### Flow 3: Data Claim Flow
Anonymous 데이터를 Verified 계정에 연결.
1.  회원가입 완료 시 (`purpose === 'signup'`).
2.  클라이언트에서 `device_id` (localStorage) 전송.
3.  서버에서 `claim_anonymous_data_by_email` RPC 호출.
4.  `image_analysis_logs`, `meal_plans` 등의 소유권을 익명 ID에서 새 Profile ID로 이전.
5.  `user_profiles.device_ids`에 기기 ID 추가.

## 5. UI System / Navigation

### Bottom Navigation
하단 고정 네비게이션 바, 인증 상태에 따라 동적 변경.
*   **Anonymous**: [스캔, 추천, 주변, (Lock)대시보드, (Lock)기록]. Locked 아이템 클릭 시 Upgrade Modal 표시.
*   **Verified**: [스캔, 추천, 주변, 대시보드, 기록]. 모든 메뉴 접근 가능.
*   **Design**: Fixed bottom, 64px height, Active navigator (Green).

### Header Navigation
상단 헤더, 인증 상태 표시.
*   **Anonymous**: 우측 "로그인" 버튼.
*   **Verified**: 우측 "사용자 이메일" + "로그아웃" 버튼.

### UI Components (Auth)
*   **VerificationCodeInput**: 6자리 OTP 입력 (Auto-focus, Paste support).
*   **UpgradePromptModal**: 업그레이드 유도 모달 ("데이터를 잃지 마세요!").
*   **AuthGuard**: Protected Route 래퍼. 미인증 시 리다이렉트.

## 6. Data Model / Database Schema

### New Tables
*   **`email_verifications`**: 이메일 인증번호 관리.
    *   `id` (UUID), `email` (Text), `purpose` (signup/login), `code_hash` (SHA256), `expires_at`, `consumed_at`.

### Updated Tables
*   **`user_profiles`**:
    *   Added: `email`, `email_verified`, `auth_method`, `device_ids`, `last_login_at`.

### New Functions
*   **`claim_anonymous_data_by_email`**: 익명 데이터 소유권 이전.
*   **`cleanup_expired_verifications`**: 만료된 인증 데이터 정리.

## 7. API Reference (Auth)

*   **`POST /api/auth/send-code`**: 이메일 인증번호(OTP) 발송.
*   **`POST /api/auth/verify-code`**: 인증번호 검증 및 JWT 세션 발급. (Set-Cookie).
*   **`GET /api/auth/me`**: 현재 세션 사용자 정보 조회.
*   **`POST /api/auth/logout`**: 로그아웃 (쿠키 삭제).

## 8. Compliance & Security
*   **Security**: JWT는 HttpOnly 쿠키로 관리되어 XSS로부터 안전. OTP는 SHA256 해싱되어 DB 탈취 시에도 안전.
*   **Privacy**: 이미지는 저장하지 않음. 민감 정보 최소 수집.
*   **Compliance**: "생성형 AI" 사용 고지 완료.
