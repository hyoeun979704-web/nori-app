import { Platform, Pressable, Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDateISO } from "@/lib/age";

type Props = {
  value: Date | null;
  onChange: (next: Date) => void;
  visible: boolean;
  setVisible: (next: boolean) => void;
  placeholder?: string;
};

export function BirthDateField({
  value,
  onChange,
  visible,
  setVisible,
  placeholder = "날짜 선택",
}: Props) {
  return (
    <View>
      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="생년월일 선택"
        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 active:opacity-80"
      >
        <Text
          className={`text-base ${
            value ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {value ? formatDateISO(value) : placeholder}
        </Text>
      </Pressable>

      {visible ? (
        <View className="mt-2">
          <DateTimePicker
            value={value ?? new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            maximumDate={new Date()}
            onChange={(event, selected) => {
              if (Platform.OS !== "ios") setVisible(false);
              if (event.type === "dismissed") return;
              if (selected) onChange(selected);
            }}
          />
          {Platform.OS === "ios" ? (
            <Pressable
              onPress={() => setVisible(false)}
              className="mt-2 items-center rounded-xl border border-slate-200 bg-white py-3 active:opacity-70"
            >
              <Text className="text-sm font-semibold text-slate-700">확인</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
