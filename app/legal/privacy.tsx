import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Privacy() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-slate-100 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="뒤로"
          className="px-2 py-1"
        >
          <Text className="text-base text-slate-600">←</Text>
        </Pressable>
        <Text className="text-base font-semibold text-slate-900">
          개인정보 처리방침
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerClassName="px-6 py-6 gap-4">
        <Text className="text-xs text-slate-400">
          시행일: 2026-04-19 · 최신 개정일: 2026-04-19
        </Text>

        <Section title="1. 수집하는 정보">
          <P>· 계정 정보: 이메일, 암호화된 비밀번호</P>
          <P>· 자녀 정보: 닉네임, 생년월일, 관심사</P>
          <P>
            · 자녀 특이사항(비공개): 알레르기, 민감 반응, 자유 메모 — 놀이
            추천을 위해서만 사용되며 앱 어디에도 노출되지 않습니다.
          </P>
          <P>
            · 대화 및 레시피: 사용자가 입력한 문장과 노리가 생성한 레시피
          </P>
          <P>
            · 기기/환경 정보: OS 종류, 앱 버전 (장애 대응을 위해 로그에만
            일부 기록)
          </P>
        </Section>

        <Section title="2. 이용 목적">
          <P>
            · 맞춤형 놀이 추천 생성, 위험 신호 감지 시 전문가 상담 안내
          </P>
          <P>
            · 계정 인증, 비밀번호 재설정, 부정 이용(과도한 요청) 방지
          </P>
          <P>· 서비스 장애 대응 및 품질 개선</P>
        </Section>

        <Section title="3. 제3자 제공 및 처리 위탁">
          <P>
            · Google Gemini API: 놀이 추천 생성을 위해 부모의 질문과 자녀
            연령·관심사·특이사항 요약이 전송됩니다. Google의 정책에 따라
            처리되며 모델 학습에는 사용되지 않도록 설정되어 있습니다.
          </P>
          <P>
            · Supabase (인증·DB): 계정 및 입력 데이터의 저장소 역할을
            합니다.
          </P>
          <P>
            · 쿠팡·YouTube: 앱 내에서 외부 검색 링크를 열 때만 사용되며,
            링크를 열기 전에는 어떠한 정보도 전송되지 않습니다.
          </P>
        </Section>

        <Section title="4. 보관 기간">
          <P>
            계정이 유지되는 동안 보관하며, 계정 삭제 시 모든 관련 데이터가
            즉시 파기됩니다. 법령상 보관이 요구되는 경우에는 해당 기간까지
            최소 범위로만 보관합니다.
          </P>
        </Section>

        <Section title="5. 이용자의 권리">
          <P>
            · 내 프로필 조회·수정: [프로필 관리] 화면에서 언제든 가능
          </P>
          <P>· 계정·데이터 삭제: [프로필 관리 → 계정 삭제]</P>
          <P>
            · 기타 열람·정정·처리정지 요청은 support@nori.app(준비 중)으로
            연락 주시면 접수 후 7일 이내에 응답드립니다.
          </P>
        </Section>

        <Section title="6. 만 14세 미만 아동의 개인정보">
          <P>
            노리는 부모/보호자가 본인 자녀의 정보를 직접 입력하는 구조로
            운영됩니다. 본 서비스의 이용 주체는 보호자이며, 본 약관에 동의함으로써
            자녀 정보 처리에 대한 법정대리인 동의가 이루어진 것으로 봅니다.
          </P>
        </Section>

        <Section title="7. 문의">
          <P>support@nori.app (준비 중)</P>
        </Section>

        <Text className="mt-6 text-[11px] leading-5 text-slate-400">
          * 본 방침은 MVP 단계의 초안이며, 상용 출시 전 개인정보보호법
          (PIPA) 전문가 검토를 통해 최종본으로 대체됩니다.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-sm font-semibold text-slate-900">{title}</Text>
      <View className="mt-1 gap-0.5">{children}</View>
    </View>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return (
    <Text className="text-sm leading-6 text-slate-700">{children}</Text>
  );
}
