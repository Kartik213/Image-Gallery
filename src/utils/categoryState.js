const CATEGORY_STORAGE_KEY = "image-gallery-categories";

export function loadCategories(initialCategories) {
  try {
    const saved = JSON.parse(localStorage.getItem(CATEGORY_STORAGE_KEY) ?? "[]");
    const storedCategories = Array.isArray(saved)
      ? saved.filter((category) => typeof category === "string")
      : [];
    return [...new Set([...initialCategories, ...storedCategories])].sort((a, b) =>
      a.localeCompare(b),
    );
  } catch {
    return [...initialCategories];
  }
}

export function saveCategories(categories) {
  try {
    localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // The in-memory category list remains usable if storage is unavailable.
  }
}
