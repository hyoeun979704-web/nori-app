import { Pressable, Text, View } from "react-native";
import { INTERESTS } from "@/lib/interests";
import { toggleArrayValue } from "@/lib/form-utils";

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
};

export function InterestChips({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-2">
      {INTERESTS.map((it) => {
        const selected = value.includes(it);
        return (
          <Pressable
            key={it}
            onPress={() => onChange(toggleArrayValue(value, it))}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
            accessibilityLabel={it}
            className={`rounded-full border px-4 py-2 ${
              selected
                ? "border-slate-900 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <Text
              className={`text-sm ${selected ? "text-white" : "text-slate-700"}`}
            >
              {it}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
