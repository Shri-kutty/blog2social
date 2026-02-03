import { GeneratedContent } from "./parseAIResponse";

export interface HistoryEntry {
  id: string;
  blogExcerpt: string;
  generatedContent: GeneratedContent;
  createdAt: string;
}

const HISTORY_KEY = "repurpose-ai-history";
const MAX_HISTORY_ITEMS = 20;

export const getHistory = (): HistoryEntry[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveToHistory = (
  blogText: string,
  generatedContent: GeneratedContent
): HistoryEntry => {
  const entry: HistoryEntry = {
    id: crypto.randomUUID(),
    blogExcerpt: blogText.slice(0, 150) + (blogText.length > 150 ? "..." : ""),
    generatedContent,
    createdAt: new Date().toISOString(),
  };

  const history = getHistory();
  const updated = [entry, ...history].slice(0, MAX_HISTORY_ITEMS);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

  return entry;
};

export const deleteFromHistory = (id: string): void => {
  const history = getHistory();
  const updated = history.filter((entry) => entry.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};
