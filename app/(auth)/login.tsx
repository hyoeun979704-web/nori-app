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

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해 주세요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const { error: err } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    router.replace("/(app)");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-16">
          <Text className="text-3xl font-bold text-slate-900">노리</Text>
          <Text className="mt-2 text-base text-slate-500">
            오늘의 놀이를 10초 안에 시작해요.
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
              <Text className="mb-1 text-sm text-slate-600">비밀번호</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                autoComplete="password"
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#94a3b8"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900"
              />
            </View>

            {error ? (
              <Text className="text-sm text-red-600">{error}</Text>
            ) : null}

            <Pressable
              onPress={onSubmit}
              disabled={submitting}
              accessibilityRole="button"
              accessibilityLabel="로그인"
              className="mt-2 items-center rounded-xl bg-slate-900 py-4 active:opacity-80 disabled:opacity-50"
            >
              {submitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  로그인
                </Text>
              )}
            </Pressable>
          </View>

          <View className="mt-6 items-center">
            <Link
              href="/(auth)/forgot-password"
              className="text-sm text-slate-500"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </View>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-slate-500">계정이 없으신가요? </Text>
            <Link href="/(auth)/signup" className="font-semibold text-slate-900">
              가입하기
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
