export const SUPPORT_CONTEXT_CACHE_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gemini-pro",
  "gemini-flash",
  "claude-3-5-sonnet",
];

export function checkHasContextCacheFunction(model: string) {
  return SUPPORT_CONTEXT_CACHE_MODELS.includes(model);
}
