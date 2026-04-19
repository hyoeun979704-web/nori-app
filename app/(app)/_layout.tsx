import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/lib/auth-context";
import { useChild } from "@/lib/child-context";

export default function AppLayout() {
  const { session, loading: authLoading } = useAuth();
  const { child, loading: childLoading } = useChild();

  if (authLoading || childLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session) return <Redirect href="/(auth)/login" />;
  if (!child) return <Redirect href="/onboarding" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
