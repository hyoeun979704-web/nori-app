import { supabase } from "./supabase";

/**
 * Requests server-side deletion of the signed-in user and every row that
 * references them (via ON DELETE CASCADE on auth.users). The Edge Function
 * runs with the service-role key; the client never sees it.
 */
export async function deleteMyAccount(): Promise<void> {
  const { data, error } = await supabase.functions.invoke("delete-account", {
    body: {},
  });
  if (error) throw new Error(error.message);
  if (!data || typeof data !== "object" || !(data as { ok?: boolean }).ok) {
    const payload = data as { error?: string } | null;
    throw new Error(payload?.error ?? "계정 삭제에 실패했어요.");
  }
}
