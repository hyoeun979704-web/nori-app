# Nori (노리) - 우리 아이 맞춤형 성장 놀이 AI 🧸

## 📖 프로젝트 소개
'노리'는 0~7세 영유아 부모를 위한 맞춤형 놀이 레시피 및 음성 가이드 앱(MVP)입니다. 평균 발달 비교의 스트레스를 배제하고, 오직 아이의 현재 상태에 집중한 긍정적이고 실용적인 놀이 가이드를 제공합니다.

## 🚀 MVP 핵심 기능
1. **온보딩 & 자녀 프로필:** 생년월일, 관심사, 발달 특이사항 정보 수집 및 관리.
2. **놀이 친구 AI 대화 (음성/텍스트):** "노리야, 종이컵으로 할 수 있는 놀이 찾아줘" 등의 일상적 질의응답 기능.
3. **맞춤형 놀이 레시피 결과 제공:** 놀이 순서, 주의사항, 관련 영상 가이드(YouTube 연동 등).
4. **원스톱 커머스 연동:** 레시피에 필요한 교구/준비물을 바로 구매할 수 있는 외부 아웃바운드 링크 노출.
5. **Red Flag (위험 신호) 안전 가이드:** 의료법 준수를 위해, 발달 위험 키워드 감지 시 AI의 추측을 차단하고 하드코딩된 '전문가 상담 권고' 컴포넌트 렌더링.

## 💻 Tech Stack (MVP)
* **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Shadcn UI
* **Backend/DB:** Supabase (Authentication, PostgreSQL, Row Level Security)
* **AI API:** Google Gemini API (대화 엔진 및 레시피 생성)
* **Voice API:** Web Speech API (MVP 단계에서의 빠른 STT/TTS 구현)

## ⚙️ 환경 변수 세팅 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
