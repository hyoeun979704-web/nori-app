import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MessageBubble } from "@/components/feature/chat/MessageBubble";
import { RecipeCard } from "@/components/feature/chat/RecipeCard";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useChild } from "@/lib/child-context";
import {
  insertNoriRecipe,
  insertNoriText,
  insertUserText,
  loadRecentMessages,
} from "@/lib/chat";
import { askForRecipe } from "@/lib/recipe-api";
import { containsRedFlag, RED_FLAG_MESSAGE } from "@/lib/red-flags";
import { getVoiceContinuous, setVoiceContinuous } from "@/lib/settings";
import type { ChatMessage } from "@/types/chat";

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Chat() {
  const { child } = useChild();
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [continuous, setContinuous] = useState(false);
  const stt = useSpeechToText({ lang: "ko-KR", continuous });

  useEffect(() => {
    void (async () => {
      const stored = await getVoiceContinuous();
      setContinuous(stored);
    })();
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const loaded = await loadRecentMessages(50);
        if (loaded.length === 0 && child) {
          setMessages([
            {
              id: "greet",
              role: "nori",
              kind: "text",
              text: `안녕하세요! ${child.nickname}와 오늘 뭐 하고 놀까요? 말하거나 써서 알려주세요.`,
              createdAt: Date.now(),
            },
          ]);
        } else {
          setMessages(loaded);
        }
      } catch (e) {
        setLoadError(
          e instanceof Error ? e.message : "대화 내역을 불러오지 못했어요.",
        );
      } finally {
        setInitialLoading(false);
      }
    })();
  }, [child]);

  useEffect(() => {
    if (stt.transcript) setInput(stt.transcript);
  }, [stt.transcript]);

  useEffect(() => {
    const id = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      50,
    );
    return () => clearTimeout(id);
  }, [messages.length]);

  const toggleContinuous = useCallback(async () => {
    const next = !continuous;
    setContinuous(next);
    await setVoiceContinuous(next);
  }, [continuous]);

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      setInput("");
      stt.reset();

      let userMsg: ChatMessage;
      try {
        userMsg = await insertUserText(text);
      } catch {
        userMsg = {
          id: uid(),
          role: "user",
          kind: "text",
          text,
          createdAt: Date.now(),
        };
      }
      const typingId = uid();
      const typing: ChatMessage = {
        id: typingId,
        role: "nori",
        kind: "typing",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg, typing]);

      // Client-side Red Flag — short-circuit before hitting the server.
      if (containsRedFlag(text)) {
        try {
          const saved = await insertNoriText(RED_FLAG_MESSAGE);
          setMessages((prev) =>
            prev.filter((m) => m.id !== typingId).concat([saved]),
          );
        } catch {
          setMessages((prev) =>
            prev
              .filter((m) => m.id !== typingId)
              .concat([
                {
                  id: uid(),
                  role: "nori",
                  kind: "text",
                  text: RED_FLAG_MESSAGE,
                  createdAt: Date.now(),
                },
              ]),
          );
        }
        return;
      }

      try {
        const res = await askForRecipe(text);
        if (res.type === "red_flag") {
          const saved = await insertNoriText(res.message).catch(() => null);
          setMessages((prev) =>
            prev.filter((m) => m.id !== typingId).concat([
              saved ?? {
                id: uid(),
                role: "nori",
                kind: "text",
                text: res.message,
                createdAt: Date.now(),
              },
            ]),
          );
          return;
        }
        const intro = await insertNoriText("이런 놀이 어때요?").catch(() => null);
        const card = await insertNoriRecipe(res.recipe).catch(() => null);
        setMessages((prev) =>
          prev.filter((m) => m.id !== typingId).concat(
            [
              intro ?? {
                id: uid(),
                role: "nori",
                kind: "text",
                text: "이런 놀이 어때요?",
                createdAt: Date.now(),
              },
              card ?? {
                id: uid(),
                role: "nori",
                kind: "recipe",
                recipe: res.recipe,
                createdAt: Date.now(),
              },
            ] as ChatMessage[],
          ),
        );
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "잠깐 문제가 생겼어요. 다시 한 번 말씀해 주실래요?";
        setMessages((prev) =>
          prev
            .filter((m) => m.id !== typingId)
            .concat([
              {
                id: uid(),
                role: "nori",
                kind: "text",
                text: message,
                createdAt: Date.now(),
              },
            ]),
        );
      }
    },
    [stt],
  );

  const toggleMic = useCallback(async () => {
    if (stt.status === "listening") stt.stop();
    else await stt.start();
  }, [stt]);

  const isListening = stt.status === "listening";
  const isProcessing = stt.status === "processing";
  const canSend = input.trim().length > 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between border-b border-slate-100 px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="px-2 py-1"
        >
          <Text className="text-base text-slate-600">←</Text>
        </Pressable>
        <Text className="text-base font-semibold text-slate-900">
          노리와 대화
        </Text>
        <View className="w-8" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {initialLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerClassName="px-4 py-4"
            renderItem={({ item }) => {
              if (item.kind === "typing") {
                return (
                  <MessageBubble role="nori">
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" />
                      <Text className="text-sm text-slate-500">
                        노리가 생각하고 있어요…
                      </Text>
                    </View>
                  </MessageBubble>
                );
              }
              if (item.kind === "recipe") {
                return (
                  <MessageBubble role="nori">
                    <RecipeCard recipe={item.recipe} />
                  </MessageBubble>
                );
              }
              return <MessageBubble role={item.role}>{item.text}</MessageBubble>;
            }}
            onContentSizeChange={() =>
              listRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        {loadError ? (
          <View className="mx-4 mb-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-sm text-red-700">{loadError}</Text>
          </View>
        ) : null}
        {stt.error ? (
          <View className="mx-4 mb-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-sm text-red-700">{stt.error}</Text>
          </View>
        ) : null}

        <View className="flex-row items-center gap-2 px-4 pt-1">
          <Pressable
            onPress={toggleContinuous}
            className={`flex-row items-center gap-1 rounded-full border px-3 py-1 ${
              continuous
                ? "border-slate-900 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <Text
              className={`text-xs ${
                continuous ? "text-white" : "text-slate-600"
              }`}
            >
              {continuous ? "🐢 긴 말 듣기" : "🐇 짧게 듣기"}
            </Text>
          </Pressable>
          <Text className="text-[11px] text-slate-400">
            {continuous
              ? "노리가 계속 듣고 있어요. 다 말하면 탭해서 끝내요."
              : "한 문장씩 듣고 자동으로 끝나요."}
          </Text>
        </View>

        <View className="flex-row items-end gap-2 border-t border-slate-100 px-4 py-3 mt-1">
          <View className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder={
                isListening ? "듣고 있어요…" : "무슨 놀이가 좋을까요?"
              }
              placeholderTextColor="#94a3b8"
              multiline
              className="max-h-28 text-base text-slate-900"
              style={{ minHeight: 36, textAlignVertical: "center" }}
              editable={!isListening}
            />
          </View>

          <Pressable
            onPress={toggleMic}
            disabled={isProcessing}
            className={`h-11 w-11 items-center justify-center rounded-full ${
              isListening ? "bg-red-500" : "border border-slate-200 bg-white"
            } active:opacity-80 disabled:opacity-50`}
          >
            <Text
              className={`text-xl ${
                isListening ? "text-white" : "text-slate-700"
              }`}
            >
              🎙️
            </Text>
          </Pressable>

          <Pressable
            onPress={() => void send(input)}
            disabled={!canSend}
            className="h-11 w-11 items-center justify-center rounded-full bg-slate-900 active:opacity-80 disabled:opacity-40"
          >
            <Text className="text-lg text-white">→</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
