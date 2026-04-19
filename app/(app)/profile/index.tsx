import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BirthDateField } from "@/components/feature/child/BirthDateField";
import { InterestChips } from "@/components/feature/child/InterestChips";
import { FormField } from "@/components/ui/FormField";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { deleteMyAccount } from "@/lib/account";
import { formatAgeKo, formatDateISO } from "@/lib/age";
import { useAuth } from "@/lib/auth-context";
import { useChild } from "@/lib/child-context";
import { getMySurvey, updateChildWithSurvey } from "@/lib/children";
import { friendlyError } from "@/lib/error-messages";
import { splitTags } from "@/lib/form-utils";

export default function Profile() {
  const { child, refresh } = useChild();
  const { signOut } = useAuth();

  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [sensitivities, setSensitivities] = useState("");
  const [notes, setNotes] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!child) return;
    setNickname(child.nickname);
    setBirthDate(new Date(`${child.birth_date}T00:00:00`));
    setInterests(child.interests);
    void (async () => {
      try {
        const s = await getMySurvey(child.id);
        setAllergies(s?.allergies.join(", ") ?? "");
        setSensitivities(s?.sensitivities.join(", ") ?? "");
        setNotes(s?.notes ?? "");
      } catch (e) {
        setError(friendlyError(e));
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [child]);

  const trimmedNickname = nickname.trim();
  const canSave = useMemo(
    () =>
      !!child &&
      trimmedNickname.length >= 1 &&
      trimmedNickname.length <= 20 &&
      birthDate !== null &&
      interests.length >= 1,
    [child, trimmedNickname, birthDate, interests],
  );

  const onSave = useCallback(async () => {
    if (!child || !birthDate) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await updateChildWithSurvey(child.id, {
        nickname: trimmedNickname,
        birth_date: formatDateISO(birthDate),
        interests,
        allergies: splitTags(allergies),
        sensitivities: splitTags(sensitivities),
        notes: notes.trim(),
      });
      await refresh();
      setSaved(true);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }, [child, birthDate, trimmedNickname, interests, allergies, sensitivities, notes, refresh]);

  const onDeleteAccount = useCallback(() => {
    Alert.alert(
      "정말 계정을 삭제할까요?",
      "자녀 프로필·대화 내역·받은 레시피를 포함해 모든 데이터가 즉시 사라지고 되돌릴 수 없어요.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "모두 삭제",
          style: "destructive",
          onPress: async () => {
            setDeleting(true);
            try {
              await deleteMyAccount();
              await signOut();
              router.replace("/(auth)/login");
            } catch (e) {
              setDeleting(false);
              Alert.alert("삭제 실패", friendlyError(e));
            }
          },
        },
      ],
    );
  }, [signOut]);

  if (!child || initialLoading) return <LoadingScreen />;

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
          프로필 관리
        </Text>
        <View className="w-8" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-xs text-slate-500">
            {birthDate ? formatAgeKo(formatDateISO(birthDate)) : ""}
          </Text>

          <View className="mt-4 gap-5">
            <FormField
              label="닉네임"
              value={nickname}
              onChangeText={setNickname}
              maxLength={20}
              accessibilityLabel="자녀 닉네임"
            />

            <View>
              <Text className="mb-1 text-sm text-slate-600">생년월일</Text>
              <BirthDateField
                value={birthDate}
                onChange={setBirthDate}
                visible={showPicker}
                setVisible={setShowPicker}
              />
            </View>

            <View>
              <Text className="mb-2 text-sm text-slate-600">관심사</Text>
              <InterestChips value={interests} onChange={setInterests} />
            </View>

            <FormField
              label="알레르기 (쉼표로 구분)"
              value={allergies}
              onChangeText={setAllergies}
              placeholder="예) 땅콩, 계란"
            />
            <FormField
              label="민감 반응 (쉼표로 구분)"
              value={sensitivities}
              onChangeText={setSensitivities}
              placeholder="예) 큰 소리, 끈적한 촉감"
            />
            <FormField
              label="그 외 메모"
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          {error ? (
            <Text className="mt-4 text-sm text-red-600">{error}</Text>
          ) : null}
          {saved ? (
            <Text className="mt-4 text-sm text-emerald-700">저장했어요.</Text>
          ) : null}

          <Pressable
            onPress={onSave}
            disabled={!canSave || saving}
            accessibilityRole="button"
            accessibilityLabel="프로필 저장"
            className="mt-8 items-center rounded-xl bg-slate-900 py-4 active:opacity-80 disabled:opacity-40"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-base font-semibold text-white">저장</Text>
            )}
          </Pressable>

          <View className="mt-12 border-t border-slate-100 pt-6">
            <Text className="text-sm font-semibold text-slate-700">도움말</Text>
            <Pressable
              onPress={() => router.push("/legal/privacy")}
              className="mt-2 active:opacity-70"
            >
              <Text className="text-sm text-slate-500">· 개인정보 처리방침</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/legal/terms")}
              className="mt-1 active:opacity-70"
            >
              <Text className="text-sm text-slate-500">· 이용약관</Text>
            </Pressable>
          </View>

          <View className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-4">
            <Text className="text-sm font-semibold text-red-800">계정 삭제</Text>
            <Text className="mt-1 text-xs leading-5 text-red-700">
              자녀 프로필, 대화 내역, 받은 레시피를 포함해 모든 데이터가 즉시
              사라지고 되돌릴 수 없어요.
            </Text>
            <Pressable
              onPress={onDeleteAccount}
              disabled={deleting}
              accessibilityRole="button"
              accessibilityLabel="계정 삭제"
              className="mt-3 items-center rounded-xl border border-red-300 bg-white py-3 active:opacity-70 disabled:opacity-40"
            >
              {deleting ? (
                <ActivityIndicator />
              ) : (
                <Text className="text-sm font-semibold text-red-700">
                  계정 삭제
                </Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
