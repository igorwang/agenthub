export function formatTokenLimit(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else {
    return Math.floor(num / 1000) + "k";
  }
}
