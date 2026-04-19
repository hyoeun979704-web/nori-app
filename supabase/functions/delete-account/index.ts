// Account deletion Edge Function.
//
// Supabase `auth.users` cannot be removed through the anon key — it needs
// the service-role client. This function verifies the caller's JWT, then
// uses the service-role client to call `auth.admin.deleteUser`, which in
// turn cascades the user-owned rows through our `on delete cascade`
// foreign keys on `children`, `child_surveys`, `chat_messages`, `recipes`,
// and `recipe_call_log`.
//
// Env vars (supabase secrets):
//   SUPABASE_URL
//   SUPABASE_ANON_KEY            (to verify the caller's JWT)
//   SUPABASE_SERVICE_ROLE_KEY    (to execute admin.deleteUser)
//
// Deploy:
//   supabase functions deploy delete-account

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.47.10";
import { corsHeaders } from "../_shared/cors.ts";

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "missing authorization" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anonKey || !serviceKey) {
    console.error("missing env var");
    return json({ error: "server misconfigured" }, 500);
  }

  const userClient = createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userErr } = await userClient.auth.getUser();
  if (userErr || !user) return json({ error: "unauthorized" }, 401);

  const adminClient = createClient(url, serviceKey);
  const { error } = await adminClient.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("delete user failed", {
      user: user.id.slice(0, 8),
      reason: error.message,
    });
    return json({ error: "delete_failed" }, 500);
  }

  return json({ ok: true });
});
