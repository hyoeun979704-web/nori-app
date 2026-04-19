import * as Linking from "expo-linking";

// Coupang Partners affiliate tag (optional). When unset, we fall back to a
// plain search URL. When set, we wrap the search URL through the Partners
// redirect so the purchase can be attributed.
const COUPANG_PARTNER_TAG = process.env.EXPO_PUBLIC_COUPANG_PARTNER_TAG;

export const COUPANG_DISCLOSURE =
  "이 앱은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.";

/**
 * A recipe's `materials` list looks like ["종이컵 10개", "스티커", "매직 2자루"].
 * Joining them all into one query produces noisy results ("종이컵 10개 스티커
 * 매직 2자루"). We keep only the noun part of each item (drop trailing counts
 * like "10개", "2자루") and cap at the two most likely-to-be-bought items.
 */
function distillMaterialQuery(materials: string[]): string {
  const cleaned = materials
    .map((raw) =>
      raw
        .replace(/\s*\d+\s*(개|장|자루|팩|세트|통|묶음|권|병)\s*$/u, "")
        .trim(),
    )
    .filter((s) => s.length > 0);
  return cleaned.slice(0, 2).join(" ");
}

export async function openCoupangSearch(
  queryOrMaterials: string | string[],
): Promise<void> {
  const raw = Array.isArray(queryOrMaterials)
    ? distillMaterialQuery(queryOrMaterials)
    : queryOrMaterials.trim();
  const q = encodeURIComponent(raw);
  if (!q) return;
  const searchUrl = `https://www.coupang.com/np/search?q=${q}`;
  const url = COUPANG_PARTNER_TAG
    ? `https://link.coupang.com/re/AFFSDP?lptag=${encodeURIComponent(
        COUPANG_PARTNER_TAG,
      )}&pageKey=${encodeURIComponent(searchUrl)}`
    : searchUrl;
  await Linking.openURL(url);
}

export async function openYouTubeSearch(query: string): Promise<void> {
  const q = encodeURIComponent(query.trim());
  if (!q) return;
  const appUrl = `youtube://results?search_query=${q}`;
  const webUrl = `https://www.youtube.com/results?search_query=${q}`;
  const canOpenApp = await Linking.canOpenURL(appUrl).catch(() => false);
  await Linking.openURL(canOpenApp ? appUrl : webUrl);
}
