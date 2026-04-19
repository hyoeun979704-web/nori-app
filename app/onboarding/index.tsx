import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { INTERESTS } from "@/lib/interests";
import { createChildWithSurvey } from "@/lib/children";
import { useChild } from "@/lib/child-context";
import { formatDateISO } from "@/lib/age";

type Step = 0 | 1 | 2 | 3;

const STEP_LABELS = ["닉네임", "생년월일", "관심사", "특이사항"] as const;

export default function Onboarding() {
  const { refresh } = useChild();
  const [step, setStep] = useState<Step>(0);

  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [sensitivities, setSensitivities] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedNickname = nickname.trim();
  const canNextFromStep = useMemo(() => {
    if (step === 0)
      return trimmedNickname.length >= 1 && trimmedNickname.length <= 20;
    if (step === 1) return birthDate !== null;
    if (step === 2) return interests.length >= 1;
    return true;
  }, [step, trimmedNickname, birthDate, interests]);

  const toggleInterest = (value: string) => {
    setInterests((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const splitTags = (raw: string): string[] =>
    raw
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const onSubmit = async () => {
    if (!birthDate) return;
    setSubmitting(true);
    setError(null);
    try {
      await createChildWithSurvey({
        nickname: trimmedNickname,
        birth_date: formatDateISO(birthDate),
        interests,
        allergies: splitTags(allergies),
        sensitivities: splitTags(sensitivities),
        notes: notes.trim(),
      });
      await refresh();
      router.replace("/(app)");
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 중 오류가 발생했어요.");
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (step < 3) setStep((step + 1) as Step);
    else void onSubmit();
  };

  const goBack = () => {
    if (step > 0) setStep((step - 1) as Step);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="px-6 pt-6">
          <View className="flex-row items-center gap-2">
            {STEP_LABELS.map((label, idx) => (
              <View
                key={label}
                className={`h-1.5 flex-1 rounded-full ${
                  idx <= step ? "bg-slate-900" : "bg-slate-200"
                }`}
              />
            ))}
          </View>
          <Text className="mt-3 text-xs text-slate-500">
            {step + 1} / 4 · {STEP_LABELS[step]}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pt-6 pb-4"
          keyboardShouldPersistTaps="handled"
        >
          {step === 0 && (
            <View>
              <Text className="text-2xl font-bold text-slate-900">
                아이를 뭐라고 부를까요?
              </Text>
              <Text className="mt-2 text-sm text-slate-500">
                노리가 대화할 때 이 이름을 사용해요. 실명이 아니어도 좋아요.
              </Text>
              <TextInput
                value={nickname}
                onChangeText={setNickname}
                placeholder="예) 율이"
                placeholderTextColor="#94a3b8"
                maxLength={20}
                className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              />
              <Text className="mt-1 text-right text-xs text-slate-400">
                {trimmedNickname.length} / 20
              </Text>
            </View>
          )}

          {step === 1 && (
            <View>
              <Text className="text-2xl font-bold text-slate-900">
                생년월일을 알려주세요.
              </Text>
              <Text className="mt-2 text-sm text-slate-500">
                개월 수에 맞는 놀이를 추천하는 데에만 사용해요.
              </Text>

              <Pressable
                onPress={() => setShowPicker(true)}
                accessibilityRole="button"
                accessibilityLabel="생년월일 선택"
                className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 active:opacity-80"
              >
                <Text
                  className={`text-base ${
                    birthDate ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {birthDate ? formatDateISO(birthDate) : "날짜 선택"}
                </Text>
              </Pressable>

              {showPicker && (
                <View className="mt-4">
                  <DateTimePicker
                    value={birthDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    maximumDate={new Date()}
                    onChange={(event, selected) => {
                      if (Platform.OS !== "ios") setShowPicker(false);
                      if (event.type === "dismissed") return;
                      if (selected) setBirthDate(selected);
                    }}
                  />
                  {Platform.OS === "ios" ? (
                    <Pressable
                      onPress={() => setShowPicker(false)}
                      className="mt-2 items-center rounded-xl border border-slate-200 bg-white py-3 active:opacity-70"
                    >
                      <Text className="text-sm font-semibold text-slate-700">
                        확인
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              )}
            </View>
          )}

          {step === 2 && (
            <View>
              <Text className="text-2xl font-bold text-slate-900">
                어떤 놀이를 좋아하나요?
              </Text>
              <Text className="mt-2 text-sm text-slate-500">
                하나 이상 골라주세요. 언제든 바꿀 수 있어요.
              </Text>
              <View className="mt-6 flex-row flex-wrap gap-2">
                {INTERESTS.map((it) => {
                  const selected = interests.includes(it);
                  return (
                    <Pressable
                      key={it}
                      onPress={() => toggleInterest(it)}
                      className={`rounded-full border px-4 py-2 ${
                        selected
                          ? "border-slate-900 bg-slate-900"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Text
                        className={`text-sm ${
                          selected ? "text-white" : "text-slate-700"
                        }`}
                      >
                        {it}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 3 && (
            <View>
              <Text className="text-2xl font-bold text-slate-900">
                꼭 알려주고 싶은 게 있나요?
              </Text>
              <Text className="mt-2 text-sm text-slate-500">
                아이에게 더 안전한 놀이를 추천하기 위한 정보예요. 건너뛰어도
                됩니다.
              </Text>

              <View className="mt-6 gap-5">
                <View>
                  <Text className="text-sm text-slate-600">
                    알레르기 (쉼표로 구분)
                  </Text>
                  <TextInput
                    value={allergies}
                    onChangeText={setAllergies}
                    placeholder="예) 땅콩, 계란"
                    placeholderTextColor="#94a3b8"
                    className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
                  />
                </View>
                <View>
                  <Text className="text-sm text-slate-600">
                    민감하게 반응하는 것 (쉼표로 구분)
                  </Text>
                  <TextInput
                    value={sensitivities}
                    onChangeText={setSensitivities}
                    placeholder="예) 큰 소리, 끈적한 촉감"
                    placeholderTextColor="#94a3b8"
                    className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
                  />
                </View>
                <View>
                  <Text className="text-sm text-slate-600">그 외 메모</Text>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="노리가 참고하면 좋을 만한 이야기를 자유롭게 써 주세요."
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={4}
                    className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
                    style={{ minHeight: 100, textAlignVertical: "top" }}
                  />
                </View>
              </View>

              <Text className="mt-6 text-xs text-slate-400">
                입력한 내용은 놀이 추천을 위해서만 쓰이고, 앱 화면에는
                표시되지 않아요.
              </Text>
            </View>
          )}

          {error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : null}
        </ScrollView>

        <View className="flex-row gap-3 px-6 pb-6 pt-2">
          {step > 0 ? (
            <Pressable
              onPress={goBack}
              disabled={submitting}
              className="flex-1 items-center rounded-xl border border-slate-200 py-4 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-base font-semibold text-slate-700">
                이전
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={goNext}
            disabled={!canNextFromStep || submitting}
            className="flex-[2] items-center rounded-xl bg-slate-900 py-4 active:opacity-80 disabled:opacity-50"
          >
            {submitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">
                {step < 3 ? "다음" : "시작하기"}
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
