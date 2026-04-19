import { useCallback, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { useChild } from "@/lib/child-context";
import { formatAgeKo } from "@/lib/age";
import { loadRecentRecipes, type StoredRecipe } from "@/lib/recipes";

export default function Home() {
  const { signOut } = useAuth();
  const { child } = useChild();
  const [recent, setRecent] = useState<StoredRecipe[]>([]);

  const refreshRecipes = useCallback(async () => {
    try {
      const rows = await loadRecentRecipes(5);
      setRecent(rows);
    } catch {
      // ignore — home keeps showing previous list
    }
  }, []);

  // useFocusEffect covers both initial mount and every subsequent focus,
  // so an extra useEffect would double-fetch on the first render.
  useFocusEffect(
    useCallback(() => {
      void refreshRecipes();
    }, [refreshRecipes]),
  );

  if (!child) return null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
        <View className="flex-row items-start justify-between">
          <View className="flex-1 pr-4">
            <Text className="text-sm text-slate-500">오늘도 함께 놀아요</Text>
            <Text
              className="mt-1 text-2xl font-bold text-slate-900"
              numberOfLines={1}
            >
              {child.nickname}
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              {formatAgeKo(child.birth_date)}
            </Text>
          </View>
          <View className="flex-row gap-1.5">
            <Pressable
              onPress={() => router.push("/(app)/profile")}
              accessibilityRole="button"
              accessibilityLabel="프로필 관리"
              className="rounded-full border border-slate-200 px-3 py-1.5 active:opacity-70"
            >
              <Text className="text-xs text-slate-600">⚙️ 프로필</Text>
            </Pressable>
            <Pressable
              onPress={signOut}
              accessibilityRole="button"
              accessibilityLabel="로그아웃"
              className="rounded-full border border-slate-200 px-3 py-1.5 active:opacity-70"
            >
              <Text className="text-xs text-slate-600">로그아웃</Text>
            </Pressable>
          </View>
        </View>

        {child.interests.length > 0 ? (
          <View className="mt-4 flex-row flex-wrap gap-2">
            {child.interests.map((it) => (
              <View key={it} className="rounded-full bg-slate-100 px-3 py-1">
                <Text className="text-xs text-slate-600">{it}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="mt-10 items-center">
          <Pressable
            onPress={() => router.push("/(app)/chat")}
            accessibilityRole="button"
            accessibilityLabel="노리에게 놀이 물어보기"
            className="h-40 w-40 items-center justify-center rounded-full bg-slate-900 active:opacity-80"
          >
            <Text className="text-5xl">🎙️</Text>
          </Pressable>
          <Text className="mt-6 text-center text-base text-slate-500">
            이 버튼을 눌러{"\n"}노리에게 놀이를 물어보세요.
          </Text>
        </View>

        <View className="mt-12">
          <Text className="text-sm font-semibold text-slate-700">
            최근 놀이 레시피
          </Text>

          {recent.length === 0 ? (
            <View className="mt-3 items-center rounded-2xl border border-dashed border-slate-200 py-10">
              <Text className="text-sm text-slate-400">
                아직 받은 레시피가 없어요.
              </Text>
            </View>
          ) : (
            <View className="mt-3 gap-2">
              {recent.map((r) => (
                <Pressable
                  key={r.id}
                  onPress={() => router.push(`/(app)/recipe/${r.id}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${r.title} 자세히 보기`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 active:opacity-70"
                >
                  <Text
                    className="text-base font-semibold text-slate-900"
                    numberOfLines={1}
                  >
                    {r.title}
                  </Text>
                  <Text className="mt-1 text-xs text-slate-500">
                    {r.age_range} · 준비물 {r.materials.length}개
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
