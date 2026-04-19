import { supabase } from "./supabase";
import type { Recipe } from "@/types/recipe";

export type StoredRecipe = Recipe & {
  id: string;
  created_at: string;
};

type Row = {
  id: string;
  title: string;
  age_range: string;
  materials: string[];
  steps: string[];
  tip: string;
  safety_note: string;
  created_at: string;
};

function rowToStored(row: Row): StoredRecipe {
  return {
    id: row.id,
    title: row.title,
    age_range: row.age_range,
    materials: row.materials,
    steps: row.steps,
    tip: row.tip,
    safety_note: row.safety_note,
    created_at: row.created_at,
  };
}

export async function insertRecipe(recipe: Recipe): Promise<StoredRecipe> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: userId,
      title: recipe.title,
      age_range: recipe.age_range,
      materials: recipe.materials,
      steps: recipe.steps,
      tip: recipe.tip,
      safety_note: recipe.safety_note,
    })
    .select("id, title, age_range, materials, steps, tip, safety_note, created_at")
    .single();
  if (error) throw new Error(error.message);
  return rowToStored(data as Row);
}

export async function loadRecentRecipes(limit = 5): Promise<StoredRecipe[]> {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, age_range, materials, steps, tip, safety_note, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => rowToStored(r as Row));
}

export async function getRecipeById(id: string): Promise<StoredRecipe | null> {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, title, age_range, materials, steps, tip, safety_note, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? rowToStored(data as Row) : null;
}
