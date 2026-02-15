// src/history.ts

const HISTORY_KEY = "address-insights-history";

/**
 * Retrieves the history from localStorage.
 * @returns The history as an array of strings, or an empty array if not available.
 */
export function getHistory(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const history = localStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading history from localStorage", error);
    return [];
  }
}

/**
 * Saves the history to localStorage.
 * @param history The history to save.
 */
export function setHistory(history: string[]): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving history to localStorage", error);
  }
}

/**
 * Appends an item to the history.
 * @param item The item to append.
 * @returns The updated history.
 */
export function appendToHistory(item: string): string[] {
  const history = getHistory();
  // Avoid duplicates
  if (history.includes(item)) {
    return history;
  }
  const updatedHistory = [item, ...history];
  setHistory(updatedHistory);
  return updatedHistory;
}

/**
 * Deletes an item from the history at a specific index.
 * @param index The index of the item to delete.
 * @returns The updated history.
 */
export function deleteFromHistory(index: number): string[] {
  const history = getHistory();
  const updatedHistory = history.filter((_, i) => i !== index);
  setHistory(updatedHistory);
  return updatedHistory;
}
