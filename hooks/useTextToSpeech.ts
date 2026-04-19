import { useCallback, useEffect, useRef, useState } from "react";
import * as Speech from "expo-speech";

export type TtsStatus = "idle" | "speaking" | "paused";

export type UseTextToSpeech = {
  status: TtsStatus;
  currentIndex: number | null;
  speakSteps: (steps: string[]) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
};

/**
 * Reads an array of steps one after another. Pause works across platforms
 * by stop-and-remember-index (Android doesn't support native pause reliably),
 * so resume() restarts the current step from the beginning.
 */
export function useTextToSpeech(lang = "ko-KR"): UseTextToSpeech {
  const [status, setStatus] = useState<TtsStatus>("idle");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const stepsRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const activeRef = useRef(false);

  useEffect(() => {
    return () => {
      activeRef.current = false;
      void Speech.stop();
    };
  }, []);

  const speakCurrent = useCallback(() => {
    const i = indexRef.current;
    const step = stepsRef.current[i];
    if (!step) {
      activeRef.current = false;
      setStatus("idle");
      setCurrentIndex(null);
      return;
    }
    setCurrentIndex(i);
    Speech.speak(step, {
      language: lang,
      onDone: () => {
        if (!activeRef.current) return;
        indexRef.current = i + 1;
        if (indexRef.current >= stepsRef.current.length) {
          activeRef.current = false;
          setStatus("idle");
          setCurrentIndex(null);
          return;
        }
        speakCurrent();
      },
      onError: () => {
        activeRef.current = false;
        setStatus("idle");
        setCurrentIndex(null);
      },
    });
  }, [lang]);

  const speakSteps = useCallback(
    (steps: string[]) => {
      void Speech.stop();
      stepsRef.current = steps;
      indexRef.current = 0;
      activeRef.current = true;
      setStatus("speaking");
      speakCurrent();
    },
    [speakCurrent],
  );

  const pause = useCallback(() => {
    activeRef.current = false;
    void Speech.stop();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (stepsRef.current.length === 0) return;
    if (indexRef.current >= stepsRef.current.length) return;
    activeRef.current = true;
    setStatus("speaking");
    speakCurrent();
  }, [speakCurrent]);

  const stop = useCallback(() => {
    activeRef.current = false;
    void Speech.stop();
    indexRef.current = 0;
    setStatus("idle");
    setCurrentIndex(null);
  }, []);

  return { status, currentIndex, speakSteps, pause, resume, stop };
}
