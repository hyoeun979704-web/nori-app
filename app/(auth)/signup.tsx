import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormField } from "@/components/ui/FormField";
import { useAuth } from "@/lib/auth-context";
import { friendlyError } from "@/lib/error-messages";

export default function SignUp() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setInfo(null);
    const { error: err } = await signUp(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(friendlyError(new Error(err)));
      return;
    }
    setInfo("가입 확인 메일을 보냈어요. 메일함에서 인증 링크를 눌러 주세요.");
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
            노리 가입
          </Text>
          <Text className="mt-2 text-base text-slate-500">
            아이와 함께 놀 준비, 지금 시작해요.
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
            />
            <FormField
              label="비밀번호 (8자 이상)"
              value={password}
              onChangeText={setPassword}
              autoComplete="password-new"
              secureTextEntry
              placeholder="••••••••"
              accessibilityLabel="비밀번호 입력"
              error={error}
            />

            {info ? (
              <Text className="text-sm text-emerald-700">{info}</Text>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="가입하기"
              className="mt-2 items-center rounded-xl bg-slate-900 py-4 active:opacity-80 disabled:opacity-50"
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  가입하기
                </Text>
              )}
            </Pressable>
          </View>

          <Text className="mt-6 text-center text-[11px] leading-5 text-slate-400">
            가입하면{" "}
            <Link href="/legal/terms" className="text-slate-500 underline">
              이용약관
            </Link>
            과{" "}
            <Link href="/legal/privacy" className="text-slate-500 underline">
              개인정보 처리방침
            </Link>
            에 동의하신 것으로 간주됩니다. 자녀 정보 처리에 대한 법정대리인
            동의를 함께 포함합니다.
          </Text>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-500">이미 계정이 있으신가요? </Text>
            <Link href="/(auth)/login" className="font-semibold text-slate-900">
              로그인
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
