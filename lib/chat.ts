import { requireUserId } from "./auth-utils";
import { supabase } from "./supabase";
import type { ChatMessage } from "@/types/chat";
import type { Recipe } from "@/types/recipe";

type Row = {
  id: string;
  role: "user" | "nori";
  kind: "text" | "recipe";
  text: string | null;
  recipe: Recipe | null;
  created_at: string;
};

const COLUMNS = "id, role, kind, text, recipe, created_at";

function rowToMessage(row: Row): ChatMessage | null {
  const createdAt = new Date(row.created_at).getTime();
  if (row.kind === "text" && row.text) {
    return row.role === "user"
      ? { id: row.id, role: "user", kind: "text", text: row.text, createdAt }
      : { id: row.id, role: "nori", kind: "text", text: row.text, createdAt };
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
    .select(COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return ((data ?? []) as Row[])
    .reverse()
    .map(rowToMessage)
    .filter((m): m is ChatMessage => m !== null);
}

async function insertMessage(
  payload: {
    role: "user" | "nori";
    kind: "text" | "recipe";
    text?: string;
    recipe?: Recipe;
  },
): Promise<ChatMessage> {
  const user_id = await requireUserId();
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ user_id, ...payload })
    .select(COLUMNS)
    .single();
  if (error) throw new Error(error.message);
  const msg = rowToMessage(data as Row);
  if (!msg) throw new Error("Failed to hydrate inserted message");
  return msg;
}

export function insertUserText(text: string): Promise<ChatMessage> {
  return insertMessage({ role: "user", kind: "text", text });
}

export function insertNoriText(text: string): Promise<ChatMessage> {
  return insertMessage({ role: "nori", kind: "text", text });
}

export function insertNoriRecipe(recipe: Recipe): Promise<ChatMessage> {
  return insertMessage({ role: "nori", kind: "recipe", recipe });
}
