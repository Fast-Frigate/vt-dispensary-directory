// Site-wide constants and launch-time configuration.
//
// The analytics IDs are read from build-time environment variables so the repo
// carries no account identifiers. Set them in the Cloudflare Pages project under
// Settings > Environment variables, then redeploy. Any that are left unset are
// simply not rendered, so the site works fine before they exist.

export const SITE_URL = "https://vtdispensarydirectory.com";
export const SITE_NAME = "VT Dispensary Directory";
export const CONTACT_EMAIL = "hello@vtdispensarydirectory.com";

// PUBLIC_GA4_ID           e.g. "G-XXXXXXXXXX"
// PUBLIC_CF_BEACON_TOKEN  from Cloudflare dashboard > Web Analytics
// PUBLIC_GSC_VERIFICATION the content value of Google's HTML-tag verification
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID ?? "";
export const CF_BEACON_TOKEN = import.meta.env.PUBLIC_CF_BEACON_TOKEN ?? "";
export const GSC_VERIFICATION = import.meta.env.PUBLIC_GSC_VERIFICATION ?? "";

// Vermont legalised adult-use retail sales; dispensaries are 21+.
export const MIN_AGE = 21;
