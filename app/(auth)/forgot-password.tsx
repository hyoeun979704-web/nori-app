import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FormField } from "@/components/ui/FormField";
import { useAuth } from "@/lib/auth-context";
import { friendlyError } from "@/lib/error-messages";

export default function ForgotPassword() {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!email.trim()) {
      setError("이메일을 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setInfo(null);
    const { error: err } = await sendPasswordReset(email.trim());
    setSubmitting(false);
    if (err) {
      setError(friendlyError(new Error(err)));
      return;
    }
    setInfo(
      "가입하신 메일로 비밀번호 재설정 링크를 보냈어요. 메일함을 확인해 주세요.",
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-16">
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="뒤로"
          >
            <Text className="text-sm text-slate-500">← 뒤로</Text>
          </Pressable>

          <Text className="mt-6 text-3xl font-bold text-slate-900">
            비밀번호 찾기
          </Text>
          <Text className="mt-2 text-base text-slate-500">
            가입하신 이메일 주소를 알려주세요. 재설정 링크를 보내드려요.
          </Text>

          <View className="mt-10 gap-4">
            <FormField
              label="이메일"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              placeholder="you@example.com"
              accessibilityLabel="이메일 입력"
              error={error}
            />

            {info ? (
              <Text className="text-sm text-emerald-700">{info}</Text>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="재설정 메일 보내기"
              className="mt-2 items-center rounded-xl bg-slate-900 py-4 active:opacity-80 disabled:opacity-50"
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  재설정 메일 보내기
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
