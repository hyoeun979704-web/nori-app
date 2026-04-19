import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/lib/auth-context";

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  if (session) return <Redirect href="/(app)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
