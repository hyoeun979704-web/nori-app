// Map raw errors (from supabase-js, Edge Function responses, thrown
// exceptions) to a single user-facing Korean string. Keeps screens free of
// error-parsing clutter and guarantees we never leak library internals
// ("FunctionsHttpError", "TypeError: Network request failed") to the UI.

type FunctionsErrorish = {
  message?: string;
  status?: number;
  context?: { status?: number; response?: { status?: number } };
};

const GENERIC = "문제가 생겼어요. 잠시 후 다시 시도해 주세요.";

export function friendlyError(err: unknown, fallback = GENERIC): string {
  if (!err) return fallback;
  if (typeof err === "string") return err.length > 0 ? err : fallback;

  if (err instanceof Error) {
    const msg = err.message ?? "";
    if (/network|failed to fetch|ECONNRESET|timeout|timed out/i.test(msg)) {
      return "네트워크가 불안정한 것 같아요. 연결을 확인하고 다시 시도해 주세요.";
    }
    if (/rate_limited|429/.test(msg)) {
      return "짧은 시간에 너무 많이 요청했어요. 잠시 쉬었다가 다시 시도해 주세요.";
    }
    if (/unauthorized|401|invalid.*jwt|jwt.*expired/i.test(msg)) {
      return "로그인 정보가 만료됐어요. 다시 로그인해 주세요.";
    }
    if (/invalid login credentials/i.test(msg)) {
      return "이메일이나 비밀번호가 올바르지 않아요.";
    }
    if (/email not confirmed/i.test(msg)) {
      return "가입 확인 메일의 링크를 먼저 눌러 주세요.";
    }
    if (/user already registered/i.test(msg)) {
      return "이미 가입된 이메일이에요. 로그인해 주세요.";
    }
    if (/password.*short|weak|at least/i.test(msg)) {
      return "비밀번호는 8자 이상으로 설정해 주세요.";
    }
    if (/upstream_unavailable|504|upstream_error|502|empty_response|invalid_json_from_model|invalid_recipe_shape/i.test(msg)) {
      return "노리가 잠깐 생각을 정리하지 못했어요. 다시 한 번 말씀해 주세요.";
    }
    if (msg.trim().length > 0 && msg.trim().length < 80 && !/\b(Error|TypeError)\b/i.test(msg)) {
      return msg;
    }
  }

  // Supabase functions-js error shape
  const fe = err as FunctionsErrorish;
  const status = fe.status ?? fe.context?.status ?? fe.context?.response?.status;
  if (status === 429) {
    return "짧은 시간에 너무 많이 요청했어요. 잠시 쉬었다가 다시 시도해 주세요.";
  }
  if (status === 401) return "로그인 정보가 만료됐어요. 다시 로그인해 주세요.";
  if (status && status >= 500) {
    return "노리가 잠깐 생각을 정리하지 못했어요. 다시 한 번 말씀해 주세요.";
  }
  return fallback;
}
