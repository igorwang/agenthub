import dayjs from "dayjs";

export function formatDate(date?: number) {
  return date ? dayjs(date).format("YYYY-MM-DD") : "-";
}

export function formatTime(date?: number) {
  return date ? dayjs(date).format("YYYY-MM-DD  HH:mm:ss") : "-";
}

export function formatDurationByMinutes(duration: number) {
  const hours = Math.floor(duration / 60);
  return `${hours} 小时 ${duration - hours * 60} 分钟`;
}
