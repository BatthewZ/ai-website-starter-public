/**
 * A short, human label for a session's user-agent ("Chrome on Android"), for
 * the Settings page's session list. Good enough to tell your own devices
 * apart; not a full UA parser, and deliberately dependency-free.
 *
 * ORDER IS THE WHOLE TRICK, and it is why this has tests. User-agent strings
 * claim to be other things for compatibility:
 *   - iPhone/iPad UAs contain "like Mac OS X", so iOS must be tested before macOS;
 *   - Android UAs contain "Linux", so Android must be tested before Linux;
 *   - Edge and Opera UAs contain "Chrome", and every Chromium UA contains
 *     "Safari", so the most specific browser token is tested first;
 *   - Chrome and Firefox on iOS say "CriOS" / "FxiOS", not "Chrome" / "Firefox";
 *   - headless Chrome (automation, Playwright) says "HeadlessChrome", with no
 *     word boundary before "Chrome".
 */
export function describeUserAgent(ua: string | null | undefined): string {
  if (!ua) return "Unknown device";
  return `${browserName(ua)} on ${osName(ua)}`;
}

function browserName(ua: string): string {
  if (/\bEdg(e|A|iOS)?\//.test(ua)) return "Edge";
  if (/\b(OPR|Opera)\//.test(ua)) return "Opera";
  if (/\bSamsungBrowser\//.test(ua)) return "Samsung Internet";
  if (/\b(Firefox|FxiOS)\//.test(ua)) return "Firefox";
  if (/\b(Headless)?(Chrome|CriOS|Chromium)\//.test(ua)) return "Chrome";
  if (/\bSafari\//.test(ua)) return "Safari";
  return "Unknown browser";
}

function osName(ua: string): string {
  if (/\b(iPhone|iPad|iPod)\b/.test(ua)) return "iOS";
  if (/\bAndroid\b/.test(ua)) return "Android";
  if (/\bWindows\b/.test(ua)) return "Windows";
  if (/\bCrOS\b/.test(ua)) return "ChromeOS";
  if (/\bMac OS X\b|\bMacintosh\b/.test(ua)) return "macOS";
  if (/\bLinux\b/.test(ua)) return "Linux";
  return "Unknown OS";
}
