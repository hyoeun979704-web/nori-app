import { supabase } from "./supabase";
import type { Recipe } from "@/types/recipe";

export type RecipeResponse =
  | { type: "recipe"; recipe: Recipe }
  | { type: "red_flag"; message: string };

export async function askForRecipe(prompt: string): Promise<RecipeResponse> {
  const { data, error } = await supabase.functions.invoke("recipe", {
    body: { prompt },
  });
  if (error) throw new Error(error.message);
  if (!data || typeof data !== "object") {
    throw new Error("서버 응답이 비어 있어요.");
  }
  const payload = data as RecipeResponse | { error: string };
  if ("error" in payload) throw new Error(payload.error);
  return payload;
}
