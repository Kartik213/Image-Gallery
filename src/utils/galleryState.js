const STORAGE_KEY = "image-gallery-view-state";

export function loadGalleryViewState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return {
      selectedCategories: Array.isArray(saved?.selectedCategories) ? saved.selectedCategories : [],
      sortField: typeof saved?.sortField === "string" ? saved.sortField : "",
      sortDirection: saved?.sortDirection === "desc" ? "desc" : "asc",
    };
  } catch {
    return { selectedCategories: [], sortField: "", sortDirection: "asc" };
  }
}

export function saveGalleryViewState({ selectedCategories, sortField, sortDirection }) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ selectedCategories, sortField, sortDirection }),
    );
  } catch {
    // Storage can be unavailable in private browsing; the gallery still works in memory.
  }
}
