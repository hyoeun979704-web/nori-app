# Nori (노리) - 우리 아이 맞춤형 성장 놀이 AI 🧸

## 📖 프로젝트 소개
'노리'는 0~7세 영유아 부모를 위한 맞춤형 놀이 레시피 · 음성 가이드 **네이티브 앱(iOS/Android)** MVP입니다.
또래 평균과 비교하는 스트레스를 배제하고, 오직 우리 아이의 현재 상태에 집중해 "지금 당장 할 수 있는 놀이"를 10초 안에 음성으로 제안합니다.

> 배포 타깃은 **iOS/Android 네이티브 앱 전용**입니다. 웹 배포는 하지 않습니다.

## 🚀 MVP 핵심 기능
1. **온보딩 & 자녀 프로필**: 생년월일, 관심사, 발달 특이사항(보호자 미노출) 수집.
2. **AI 대화 (음성/텍스트)**: "노리야, 종이컵으로 할 수 있는 놀이 찾아줘" 같은 자연어 질의.
3. **맞춤 놀이 레시피**: 준비물 · 단계 · 주의사항 + YouTube 검색 딥링크.
4. **커머스 아웃바운드**: 쿠팡 파트너스 검색 딥링크 (광고 표기 고지 준수).
5. **Red Flag 안전장치**: 위험 키워드 감지 시 AI 추측을 차단하고 전문가 상담 안내 컴포넌트 표시.

## 💻 기술 스택 (확정)
- **App**: Expo SDK 52+, React Native 0.76+, TypeScript strict, **expo-router v4** (파일 기반 라우팅)
- **UI**: NativeWind v4 (Tailwind for React Native)
- **Backend/DB**: Supabase (Auth + PostgreSQL + Row Level Security)
- **세션 저장**: `@react-native-async-storage/async-storage` (Supabase JS 공식 권장)
- **AI 엔진**: Google Gemini API — **Supabase Edge Functions에서 서버 사이드 호출**(키 노출 방지)
- **Voice**: `expo-speech-recognition` (STT), `expo-speech` (TTS)
- **외부 연결**: `expo-linking` (쿠팡 · YouTube 검색 딥링크)

## 🗂 디렉터리 규약
```
app/                 # expo-router (파일 기반 라우팅)
  (auth)/            # 비로그인 전용 그룹
  (app)/             # 로그인 필요 그룹
components/
  ui/                # 범용 UI 프리미티브
  feature/           # 도메인 feature 컴포넌트
lib/                 # supabase 클라이언트, auth context 등
hooks/               # 커스텀 훅
types/               # 전역 타입
supabase/
  migrations/        # SQL 마이그레이션
  functions/<name>/  # Edge Functions (Gemini 호출 등)
```

## ⚙️ 환경 변수 (`.env`)

클라이언트에 노출되는 값은 **`EXPO_PUBLIC_`** 접두어만 허용합니다. Gemini 키 등 시크릿은 **Edge Function 환경 변수**로만 설정하고 앱 번들에 절대 포함하지 않습니다.

```env
# 앱 클라이언트 (번들에 포함됨)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# Supabase Edge Function secret (앱에는 절대 포함 금지)
# supabase secrets set GEMINI_API_KEY=...
GEMINI_API_KEY=
```

## 🧪 로컬 실행
```bash
npm install
npx expo start
# i: iOS 시뮬레이터, a: Android 에뮬레이터, 또는 Expo Go 앱에서 QR 스캔
```

## 🔐 Supabase 정책
- 모든 테이블 RLS 기본 활성화.
- `user_id = auth.uid()` 기반 본인 데이터 전용 접근 정책.
- DB 스키마 변경은 반드시 `supabase/migrations/` SQL 파일로 남깁니다.

## 📌 Phase 로드맵
- **Phase 1**: Expo scaffold + Supabase 인증 + 보호 라우트 ← *현재*
- **Phase 2**: 온보딩 & 자녀 프로필 (`children`, `child_surveys`)
- **Phase 3**: 음성 입력 + 채팅 UI (더미 응답)
- **Phase 4**: Gemini Edge Function + Red Flag 이중 검증
- **Phase 5**: 레시피 카드 + 쿠팡/YouTube 딥링크 + TTS
