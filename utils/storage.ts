export interface HistoryItem {
  id: string;
  emoji: string;
  timestamp: number;
  preview: string;
}

const STORAGE_KEY = 'emojicrypt_history_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const saveToHistory = (emojiOutput: string, originalText: string) => {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      emoji: emojiOutput,
      timestamp: Date.now(),
      preview: originalText.slice(0, 20) + (originalText.length > 20 ? '...' : '')
    };
    
    // Keep last 10 items
    const updated = [newItem, ...history].slice(0, 10);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save history", e);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};