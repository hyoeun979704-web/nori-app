import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/lib/auth-context";

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
      setError(err);
      return;
    }
    setInfo(
      "가입 확인 메일을 보냈어요. 메일함에서 인증 링크를 눌러 주세요.",
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-16">
          <Pressable onPress={() => router.back()}>
            <Text className="text-sm text-slate-500">← 뒤로</Text>
          </Pressable>

          <Text className="mt-6 text-3xl font-bold text-slate-900">
            노리 가입
          </Text>
          <Text className="mt-2 text-base text-slate-500">
            아이와 함께 놀 준비, 지금 시작해요.
          </Text>

          <View className="mt-10 gap-4">
            <View>
              <Text className="mb-1 text-sm text-slate-600">이메일</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                placeholder="you@example.com"
                placeholderTextColor="#94a3b8"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              />
            </View>
            <View>
              <Text className="mb-1 text-sm text-slate-600">
                비밀번호 (8자 이상)
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                autoComplete="password-new"
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              />
            </View>

            {error ? (
              <Text className="text-sm text-red-600">{error}</Text>
            ) : null}
            {info ? (
              <Text className="text-sm text-emerald-700">{info}</Text>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={submitting}
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

          <View className="mt-8 flex-row justify-center">
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
