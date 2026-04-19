import * as Linking from "expo-linking";

// Coupang Partners affiliate tag (optional). When unset, we fall back to a
// plain search URL. When set, we wrap the search URL through the Partners
// redirect so the purchase can be attributed.
const COUPANG_PARTNER_TAG = process.env.EXPO_PUBLIC_COUPANG_PARTNER_TAG;

export const COUPANG_DISCLOSURE =
  "이 앱은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받을 수 있습니다.";

export async function openCoupangSearch(query: string): Promise<void> {
  const q = encodeURIComponent(query.trim());
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
