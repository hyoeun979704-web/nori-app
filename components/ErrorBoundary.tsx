import { Component, type ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    // Logging hook — this is the single place where we'd forward to an
    // error-monitoring service if one were wired up.
    console.error("UI error boundary caught", error);
  }

  reset = () => this.setState({ error: null });

  override render() {
    if (!this.state.error) return this.props.children;
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-xl font-bold text-slate-900">
          앱에 문제가 생겼어요
        </Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          잠시 후에 다시 시도해 주세요. 문제가 계속되면 앱을 다시 시작해 주세요.
        </Text>
        <Pressable
          onPress={this.reset}
          className="mt-8 rounded-xl bg-slate-900 px-6 py-3 active:opacity-80"
        >
          <Text className="text-sm font-semibold text-white">다시 시도</Text>
        </Pressable>
      </View>
    );
  }
}
