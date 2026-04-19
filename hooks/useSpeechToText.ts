import { useCallback, useState } from "react";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";

export type SttStatus =
  | "idle"
  | "requesting-permission"
  | "listening"
  | "processing"
  | "error"
  | "unsupported";

export type UseSpeechToTextOptions = {
  lang?: string;
  continuous?: boolean;
};

export type UseSpeechToText = {
  status: SttStatus;
  transcript: string;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
};

export function useSpeechToText(
  options: UseSpeechToTextOptions = {},
): UseSpeechToText {
  const { lang = "ko-KR", continuous = false } = options;
  const [status, setStatus] = useState<SttStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  useSpeechRecognitionEvent("result", (event) => {
    const first = event.results?.[0];
    if (first?.transcript) setTranscript(first.transcript);
  });

  useSpeechRecognitionEvent("error", (event) => {
    setError(event.message ?? "음성 인식 중 문제가 생겼어요.");
    setStatus("error");
  });

  useSpeechRecognitionEvent("end", () => {
    setStatus((prev) =>
      prev === "error" || prev === "unsupported" ? prev : "idle",
    );
  });

  const start = useCallback(async () => {
    setError(null);
    setTranscript("");
    setStatus("requesting-permission");
    try {
      const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!perm.granted) {
        setError("마이크와 음성 인식 권한이 필요해요. 설정에서 허용해 주세요.");
        setStatus("error");
        return;
      }
      setStatus("listening");
      ExpoSpeechRecognitionModule.start({
        lang,
        interimResults: true,
        continuous,
        requiresOnDeviceRecognition: false,
        addsPunctuation: true,
      });
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "음성 인식을 시작하지 못했어요.";
      setError(
        message.includes("native")
          ? "이 빌드에서는 음성 인식을 사용할 수 없어요. 개발 클라이언트를 다시 빌드해 주세요."
          : message,
      );
      setStatus("unsupported");
    }
  }, [lang, continuous]);

  const stop = useCallback(() => {
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch {
      // already stopped
    }
    setStatus((prev) => (prev === "listening" ? "processing" : prev));
  }, []);

  const reset = useCallback(() => {
    setTranscript("");
    setError(null);
    setStatus("idle");
  }, []);

  return { status, transcript, error, start, stop, reset };
}
