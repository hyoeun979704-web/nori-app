import { supabase } from "./supabase";
import type { Child } from "@/types/child";

export async function getMyChild(): Promise<Child | null> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Child | null;
}

export type CreateChildInput = {
  nickname: string;
  birth_date: string;
  interests: string[];
  allergies: string[];
  sensitivities: string[];
  notes: string;
};

export async function createChildWithSurvey(
  input: CreateChildInput,
): Promise<Child> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");

  const { data: child, error: childErr } = await supabase
    .from("children")
    .insert({
      user_id: userId,
      nickname: input.nickname,
      birth_date: input.birth_date,
      interests: input.interests,
    })
    .select()
    .single();
  if (childErr) throw new Error(childErr.message);

  const { error: surveyErr } = await supabase.from("child_surveys").insert({
    child_id: (child as Child).id,
    allergies: input.allergies,
    sensitivities: input.sensitivities,
    notes: input.notes,
  });
  if (surveyErr) throw new Error(surveyErr.message);

  return child as Child;
}
