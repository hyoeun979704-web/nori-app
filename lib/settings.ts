import AsyncStorage from "@react-native-async-storage/async-storage";

const VOICE_CONTINUOUS_KEY = "nori.voice.continuous";

export async function getVoiceContinuous(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(VOICE_CONTINUOUS_KEY);
  return raw === "true";
}

export async function setVoiceContinuous(value: boolean): Promise<void> {
  await AsyncStorage.setItem(VOICE_CONTINUOUS_KEY, value ? "true" : "false");
}
