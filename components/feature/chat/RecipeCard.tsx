import { Text, View } from "react-native";
import type { Recipe } from "@/types/recipe";

type Props = { recipe: Recipe };

export function RecipeCard({ recipe }: Props) {
  return (
    <View className="w-full">
      <Text className="text-lg font-bold text-slate-900">{recipe.title}</Text>
      <Text className="mt-1 text-xs text-slate-500">
        추천 연령 · {recipe.age_range}
      </Text>

      <View className="mt-4">
        <Text className="text-sm font-semibold text-slate-700">준비물</Text>
        <View className="mt-1 gap-0.5">
          {recipe.materials.map((m) => (
            <Text key={m} className="text-sm text-slate-700">
              · {m}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-sm font-semibold text-slate-700">이렇게 놀아요</Text>
        <View className="mt-1 gap-1">
          {recipe.steps.map((s, i) => (
            <Text key={s} className="text-sm leading-5 text-slate-700">
              {i + 1}. {s}
            </Text>
          ))}
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-slate-50 p-3">
        <Text className="text-sm text-slate-800">💡 {recipe.tip}</Text>
      </View>
      <View className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <Text className="text-sm text-amber-900">⚠️ {recipe.safety_note}</Text>
      </View>
    </View>
  );
}
