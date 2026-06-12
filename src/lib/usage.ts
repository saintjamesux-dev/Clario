import { FREE_CRITIQUES_PER_DAY } from "./constants";

const STORAGE_KEY = "clario_usage";

interface UsageData {
  date: string;
  count: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function read(): UsageData {
  if (typeof window === "undefined") {
    return { date: today(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: today(), count: 0 };
    const data = JSON.parse(raw) as UsageData;
    if (data.date !== today()) return { date: today(), count: 0 };
    return data;
  } catch {
    return { date: today(), count: 0 };
  }
}

function write(data: UsageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getRemainingCritiques(): number {
  const data = read();
  return Math.max(0, FREE_CRITIQUES_PER_DAY - data.count);
}

export function canCritique(): boolean {
  return getRemainingCritiques() > 0;
}

export function recordCritique(): void {
  const data = read();
  write({ date: today(), count: data.count + 1 });
}