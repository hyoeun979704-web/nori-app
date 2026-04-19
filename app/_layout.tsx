import "../global.css";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "@/lib/auth-context";
import { ChildProvider } from "@/lib/child-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ChildProvider>
          <StatusBar style="dark" />
          <Slot />
        </ChildProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
