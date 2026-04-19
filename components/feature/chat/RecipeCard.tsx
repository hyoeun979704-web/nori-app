import { Pressable, Text, View } from "react-native";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import {
  COUPANG_DISCLOSURE,
  openCoupangSearch,
  openYouTubeSearch,
} from "@/lib/deeplinks";
import type { Recipe } from "@/types/recipe";

type Props = { recipe: Recipe };

export function RecipeCard({ recipe }: Props) {
  const tts = useTextToSpeech("ko-KR");
  const isSpeaking = tts.status === "speaking";
  const isPaused = tts.status === "paused";

  const youtubeQuery = `${recipe.title} 아이 놀이`;

  const onTogglePlay = () => {
    if (isSpeaking) tts.pause();
    else if (isPaused) tts.resume();
    else tts.speakSteps(recipe.steps);
  };

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
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-slate-700">
            이렇게 놀아요
          </Text>
          <Pressable
            onPress={onTogglePlay}
            disabled={recipe.steps.length === 0}
            className="flex-row items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 active:opacity-70 disabled:opacity-40"
          >
            <Text className="text-xs text-slate-700">
              {isSpeaking ? "⏸ 일시정지" : isPaused ? "▶ 이어 읽기" : "🔊 읽어주기"}
            </Text>
          </Pressable>
        </View>
        <View className="mt-1 gap-1">
          {recipe.steps.map((s, i) => {
            const active = tts.currentIndex === i && (isSpeaking || isPaused);
            return (
              <View
                key={s}
                className={`rounded-lg px-2 py-1 ${
                  active ? "bg-slate-900" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-sm leading-5 ${
                    active ? "text-white" : "text-slate-700"
                  }`}
                >
                  {i + 1}. {s}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View className="mt-4 rounded-xl bg-slate-50 p-3">
        <Text className="text-sm text-slate-800">💡 {recipe.tip}</Text>
      </View>
      <View className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <Text className="text-sm text-amber-900">⚠️ {recipe.safety_note}</Text>
      </View>

      <View className="mt-4 flex-row gap-2">
        <Pressable
          onPress={() => void openCoupangSearch(recipe.materials)}
          disabled={recipe.materials.length === 0}
          accessibilityRole="button"
          accessibilityLabel="쿠팡에서 준비물 검색"
          className="flex-1 items-center rounded-xl border border-slate-200 bg-white py-3 active:opacity-70 disabled:opacity-40"
        >
          <Text className="text-sm font-semibold text-slate-700">
            🛒 준비물 찾기
          </Text>
        </Pressable>
        <Pressable
          onPress={() => void openYouTubeSearch(youtubeQuery)}
          accessibilityRole="button"
          accessibilityLabel="YouTube에서 놀이 영상 검색"
          className="flex-1 items-center rounded-xl border border-slate-200 bg-white py-3 active:opacity-70"
        >
          <Text className="text-sm font-semibold text-slate-700">
            📺 영상 찾기
          </Text>
        </Pressable>
      </View>

      <Text className="mt-3 text-[10px] leading-4 text-slate-400">
        {COUPANG_DISCLOSURE}
      </Text>
    </View>
  );
}
