import { supabase } from "./supabase";
import type { ChatMessage } from "@/types/chat";
import type { Recipe } from "@/types/recipe";

type Row = {
  id: string;
  user_id: string;
  role: "user" | "nori";
  kind: "text" | "recipe";
  text: string | null;
  recipe: Recipe | null;
  created_at: string;
};

function rowToMessage(row: Row): ChatMessage | null {
  const createdAt = new Date(row.created_at).getTime();
  if (row.kind === "text" && row.text) {
    if (row.role === "user") {
      return { id: row.id, role: "user", kind: "text", text: row.text, createdAt };
    }
    return { id: row.id, role: "nori", kind: "text", text: row.text, createdAt };
  }
  if (row.kind === "recipe" && row.recipe && row.role === "nori") {
    return {
      id: row.id,
      role: "nori",
      kind: "recipe",
      recipe: row.recipe,
      createdAt,
    };
  }
  return null;
}

export async function loadRecentMessages(limit = 50): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, user_id, role, kind, text, recipe, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  const rows = (data ?? []) as Row[];
  return rows.reverse().map(rowToMessage).filter((m): m is ChatMessage => !!m);
}

export async function insertUserText(text: string): Promise<ChatMessage> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ user_id: userId, role: "user", kind: "text", text })
    .select("id, user_id, role, kind, text, recipe, created_at")
    .single();
  if (error) throw new Error(error.message);
  const msg = rowToMessage(data as Row);
  if (!msg) throw new Error("Failed to hydrate inserted message");
  return msg;
}

export async function insertNoriText(text: string): Promise<ChatMessage> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ user_id: userId, role: "nori", kind: "text", text })
    .select("id, user_id, role, kind, text, recipe, created_at")
    .single();
  if (error) throw new Error(error.message);
  const msg = rowToMessage(data as Row);
  if (!msg) throw new Error("Failed to hydrate inserted message");
  return msg;
}

export async function insertNoriRecipe(recipe: Recipe): Promise<ChatMessage> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error("Not authenticated");
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ user_id: userId, role: "nori", kind: "recipe", recipe })
    .select("id, user_id, role, kind, text, recipe, created_at")
    .single();
  if (error) throw new Error(error.message);
  const msg = rowToMessage(data as Row);
  if (!msg) throw new Error("Failed to hydrate inserted message");
  return msg;
}
