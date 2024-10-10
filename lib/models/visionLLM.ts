export const SUPPORT_VISION_MODELS = [
  "gpt-4o-mini",
  "gpt-4o",
  "gemini-pro",
  "gemini-flash",
  "claude-3-5-sonnet",
  "meta-llama/Llama-3.2-11B-Vision-Instruct",
  "meta-llama/Llama-3.2-90B-Vision-Instruct",
];

export function checkHasVisionFunction(model: string) {
  return SUPPORT_VISION_MODELS.includes(model);
}
