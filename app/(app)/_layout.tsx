import { Redirect, Stack } from "expo-router";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useAuth } from "@/lib/auth-context";
import { useChild } from "@/lib/child-context";

export default function AppLayout() {
  const { session, loading: authLoading } = useAuth();
  const { child, loading: childLoading } = useChild();

  if (authLoading || childLoading) return <LoadingScreen />;
  if (!session) return <Redirect href="/(auth)/login" />;
  if (!child) return <Redirect href="/onboarding" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
