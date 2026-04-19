import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { RecipeCard } from "@/components/feature/chat/RecipeCard";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { friendlyError } from "@/lib/error-messages";
import { getRecipeById, type StoredRecipe } from "@/lib/recipes";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<StoredRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    void (async () => {
      try {
        const r = await getRecipeById(id);
        if (!r) setError("레시피를 찾을 수 없어요.");
        else setRecipe(r);
      } catch (e) {
        setError(friendlyError(e, "레시피를 불러오지 못했어요."));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
          놀이 레시피
        </Text>
        <View className="w-8" />
      </View>

      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm text-red-600">{error}</Text>
        </View>
      ) : recipe ? (
        <ScrollView contentContainerClassName="px-5 py-6">
          <RecipeCard recipe={recipe} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}
