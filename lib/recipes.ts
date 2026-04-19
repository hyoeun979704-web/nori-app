import { requireUserId } from "./auth-utils";
import { supabase } from "./supabase";
import type { Recipe } from "@/types/recipe";

export type StoredRecipe = Recipe & {
  id: string;
  created_at: string;
};

const COLUMNS =
  "id, title, age_range, materials, steps, tip, safety_note, created_at";

type Row = StoredRecipe;

export async function insertRecipe(recipe: Recipe): Promise<StoredRecipe> {
  const user_id = await requireUserId();
  const { data, error } = await supabase
    .from("recipes")
    .insert({ user_id, ...recipe })
    .select(COLUMNS)
    .single();
  if (error) throw new Error(error.message);
  return data as Row;
}

export async function loadRecentRecipes(limit = 5): Promise<StoredRecipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Row[];
}

export async function getRecipeById(id: string): Promise<StoredRecipe | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as Row | null) ?? null;
}
