import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { session, signOut } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        <View className="flex-row items-start justify-between">
          <View>
            <Text className="text-sm text-slate-500">환영합니다 👋</Text>
            <Text
              className="mt-1 text-xl font-semibold text-slate-900"
              numberOfLines={1}
            >
              {session?.user.email ?? ""}
            </Text>
          </View>
          <Pressable
            onPress={signOut}
            className="rounded-full border border-slate-200 px-3 py-1.5 active:opacity-70"
          >
            <Text className="text-xs text-slate-600">로그아웃</Text>
          </Pressable>
        </View>

        <View className="mt-12 items-center">
          <View className="h-40 w-40 items-center justify-center rounded-full bg-slate-100">
            <Text className="text-5xl">🎙️</Text>
          </View>
          <Text className="mt-6 text-center text-base text-slate-500">
            곧 이 버튼으로 음성 놀이 요청을{"\n"}보낼 수 있게 됩니다. (Phase 3)
          </Text>
        </View>

        <View className="mt-auto pb-4">
          <Text className="text-xs text-slate-400">
            Phase 1 · 인증 스캐폴드
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
