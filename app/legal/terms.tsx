import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Terms() {
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
        <Text className="text-base font-semibold text-slate-900">이용약관</Text>
        <View className="w-8" />
      </View>

      <ScrollView contentContainerClassName="px-6 py-6 gap-4">
        <Text className="text-xs text-slate-400">시행일: 2026-04-19</Text>

        <Section title="1. 목적">
          <P>
            이 약관은 "노리"(이하 서비스)의 이용 조건과 절차, 이용자와
            운영자의 권리·의무 및 책임 사항을 규정하는 것을 목적으로 합니다.
          </P>
        </Section>
        <Section title="2. 서비스의 성격">
          <P>
            · 노리는 영유아(0~7세) 부모를 위한 놀이 아이디어를 제안하는
            도구입니다.
          </P>
          <P>
            · 본 서비스의 내용은 의학적 진단, 치료, 상담을 대체할 수 없으며,
            아이의 건강·발달과 관련된 우려가 있을 경우 반드시 소아청소년과
            등 전문가의 상담을 받아 주세요.
          </P>
          <P>
            · 추천되는 놀이의 안전 여부는 최종적으로 보호자의 판단과
            감독에 따릅니다.
          </P>
        </Section>
        <Section title="3. 계정과 책임">
          <P>
            · 이용자는 본인 소유의 이메일로 계정을 만들고, 비밀번호 관리
            책임을 집니다.
          </P>
          <P>
            · 이용자는 타인의 개인정보를 입력하거나, 법령·공공질서에
            위배되는 용도로 서비스를 이용할 수 없습니다.
          </P>
        </Section>
        <Section title="4. 쿠팡 파트너스 고지">
          <P>
            노리는 준비물 검색 시 쿠팡 파트너스 링크를 사용할 수 있으며,
            이를 통한 구매 시 일정액의 수수료를 제공받을 수 있습니다.
            수수료 여부는 추천되는 놀이의 내용 선정에 영향을 주지 않습니다.
          </P>
        </Section>
        <Section title="5. 서비스 변경 및 중단">
          <P>
            운영자는 서비스 품질 향상이나 기술적 사유로 서비스 일부·전부의
            내용을 변경하거나 일시 중단할 수 있으며, 중요한 변경은 앱 내
            공지를 통해 안내합니다.
          </P>
        </Section>
        <Section title="6. 면책">
          <P>
            노리는 추천된 놀이를 수행하는 과정에서 발생한 사고·부상에 대해
            법령에서 허용하는 범위 내에서 책임을 지지 않습니다. 보호자는
            놀이 전 준비물과 환경을 반드시 점검해 주세요.
          </P>
        </Section>
        <Section title="7. 약관의 변경">
          <P>
            운영자는 필요 시 본 약관을 개정할 수 있으며, 개정 내용은 앱 내
            고지 및 개정일 이후 첫 로그인 시 공지합니다.
          </P>
        </Section>
        <Section title="8. 문의">
          <P>support@nori.app (준비 중)</P>
        </Section>

        <Text className="mt-6 text-[11px] leading-5 text-slate-400">
          * 본 약관은 MVP 단계의 초안이며, 상용 출시 전 법률 검토를 통해
          최종본으로 대체됩니다.
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
  return <Text className="text-sm leading-6 text-slate-700">{children}</Text>;
}
