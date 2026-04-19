import { Text, View } from "react-native";
import type { ReactNode } from "react";
import type { ChatRole } from "@/types/chat";

type Props = {
  role: ChatRole;
  children: ReactNode;
};

export function MessageBubble({ role, children }: Props) {
  const isUser = role === "user";
  return (
    <View
      className={`mb-3 flex-row ${isUser ? "justify-end" : "justify-start"}`}
    >
      <View
        className={`max-w-[82%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-slate-900"
            : "border border-slate-200 bg-white"
        }`}
      >
        {typeof children === "string" ? (
          <Text
            className={`text-base ${isUser ? "text-white" : "text-slate-900"}`}
          >
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}
