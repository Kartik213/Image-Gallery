import { useEffect, useRef, useState } from "react";

export default function GalleryControls({
  categories,
  selectedCategories,
  sortField,
  onReset,
  onSortFieldChange,
  onToggleCategory,
  totalCount,
  visibleCount,
}) {
  const categoryMenuRef = useRef(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const hasActiveControls = selectedCategories.size > 0 || sortField;
  const selectedCategoryCount = selectedCategories.size;

  useEffect(() => {
    const closeOnOutsideInteraction = (event) => {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsCategoryMenuOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutsideInteraction);
    document.addEventListener("focusin", closeOnOutsideInteraction);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideInteraction);
      document.removeEventListener("focusin", closeOnOutsideInteraction);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <section className="gallery-controls" aria-label="Gallery controls">
      <div className="filter-bar">
        <div className="filtering-controls">
          <details
            className="category-menu"
            onToggle={(event) => setIsCategoryMenuOpen(event.currentTarget.open)}
            open={isCategoryMenuOpen}
            ref={categoryMenuRef}
          >
            <summary aria-expanded={isCategoryMenuOpen}>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              <span>Categories</span>
              {selectedCategoryCount > 0 && <b>{selectedCategoryCount}</b>}
            </summary>

            <div className="category-menu-panel">
              <p>Choose one or more categories</p>
              <div className="filter-options">
                {categories.map((category) => (
                  <label className="filter-option" key={category}>
                    <input
                      checked={selectedCategories.has(category)}
                      onChange={() => onToggleCategory(category)}
                      type="checkbox"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </details>
          <label className="sort-select">
            <span className="visually-hidden">Sort images by</span>
            <select onChange={(event) => onSortFieldChange(event.target.value)} value={sortField}>
              <option value="">Sort</option>
              <option value="title">Title</option>
              <option value="category">Category</option>
              <option value="date">Date</option>
            </select>
          </label>
        </div>

        <button className="reset-button" disabled={!hasActiveControls} onClick={onReset} type="button">
          Reset all
        </button>
      </div>
      <p className="results-summary" aria-live="polite">
        Showing <strong>{visibleCount}</strong> of {totalCount} images
      </p>
    </section>
  );
}
