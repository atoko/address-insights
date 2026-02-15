// src/history.test.ts
import { appendToHistory, deleteFromHistory, getHistory } from "./history";

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key: string) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("history", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("should return an empty array when history is empty", () => {
    expect(getHistory()).toEqual([]);
  });

  it("should append an item to the history", () => {
    const updatedHistory = appendToHistory("item1");
    expect(updatedHistory).toEqual(["item1"]);
    expect(getHistory()).toEqual(["item1"]);
  });

  it("should not append a duplicate item", () => {
    appendToHistory("item1");
    const updatedHistory = appendToHistory("item1");
    expect(updatedHistory).toEqual(["item1"]);
    expect(getHistory()).toEqual(["item1"]);
  });

  it("should append multiple items to the history", () => {
    appendToHistory("item1");
    const updatedHistory = appendToHistory("item2");
    expect(updatedHistory).toEqual(["item2", "item1"]);
    expect(getHistory()).toEqual(["item2", "item1"]);
  });

  it("should delete an item from the history by index", () => {
    appendToHistory("item1");
    appendToHistory("item2");
    const updatedHistory = deleteFromHistory(1);
    expect(updatedHistory).toEqual(["item2"]);
    expect(getHistory()).toEqual(["item2"]);
  });

  it("should not delete any item if index is out of bounds", () => {
    appendToHistory("item1");
    appendToHistory("item2");
    const updatedHistory = deleteFromHistory(2);
    expect(updatedHistory).toEqual(["item2", "item1"]);
    expect(getHistory()).toEqual(["item2", "item1"]);
  });
});
