import { forwardRef } from "react";
import { Text, TextInput, type TextInputProps, View } from "react-native";

type Props = Omit<TextInputProps, "placeholderTextColor"> & {
  label?: string;
  hint?: string;
  error?: string | null;
};

export const FormField = forwardRef<TextInput, Props>(function FormField(
  { label, hint, error, className, style, multiline, ...rest },
  ref,
) {
  const multilineStyle = multiline
    ? { minHeight: 100, textAlignVertical: "top" as const }
    : undefined;
  return (
    <View>
      {label ? (
        <Text className="mb-1 text-sm text-slate-600">{label}</Text>
      ) : null}
      <TextInput
        ref={ref}
        multiline={multiline}
        placeholderTextColor="#94a3b8"
        className={`rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 ${className ?? ""}`}
        style={[multilineStyle, style]}
        {...rest}
      />
      {hint ? <Text className="mt-1 text-xs text-slate-400">{hint}</Text> : null}
      {error ? <Text className="mt-1 text-sm text-red-600">{error}</Text> : null}
    </View>
  );
});
