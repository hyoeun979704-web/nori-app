import { requireUserId } from "./auth-utils";
import { supabase } from "./supabase";
import type { Child, ChildSurvey } from "@/types/child";

export type ChildWithSurveyInput = {
  nickname: string;
  birth_date: string;
  interests: string[];
  allergies: string[];
  sensitivities: string[];
  notes: string;
};

export async function getMyChild(): Promise<Child | null> {
  const { data, error } = await supabase
    .from("children")
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Child | null;
}

export async function getMySurvey(childId: string): Promise<ChildSurvey | null> {
  const { data, error } = await supabase
    .from("child_surveys")
    .select("child_id, allergies, sensitivities, notes, updated_at")
    .eq("child_id", childId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as ChildSurvey | null) ?? null;
}

export async function createChildWithSurvey(
  input: ChildWithSurveyInput,
): Promise<Child> {
  const user_id = await requireUserId();
  const { data: child, error: childErr } = await supabase
    .from("children")
    .insert({
      user_id,
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

export async function updateChildWithSurvey(
  childId: string,
  input: ChildWithSurveyInput,
): Promise<Child> {
  const { data: child, error: childErr } = await supabase
    .from("children")
    .update({
      nickname: input.nickname,
      birth_date: input.birth_date,
      interests: input.interests,
    })
    .eq("id", childId)
    .select()
    .single();
  if (childErr) throw new Error(childErr.message);

  // Upsert so the 1:1 row recovers even if an earlier survey insert failed.
  const { error: surveyErr } = await supabase
    .from("child_surveys")
    .upsert(
      {
        child_id: childId,
        allergies: input.allergies,
        sensitivities: input.sensitivities,
        notes: input.notes,
      },
      { onConflict: "child_id" },
    );
  if (surveyErr) throw new Error(surveyErr.message);

  return child as Child;
}
