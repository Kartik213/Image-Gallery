import { useEffect, useRef, useState } from "react";

function SortMenu({ label, value, options, onChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <details
      className={`sort-menu${disabled ? " is-disabled" : ""}`}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
      open={isOpen && !disabled}
    >
      <summary
        aria-disabled={disabled}
        onClick={(event) => {
          if (disabled) event.preventDefault();
        }}
      >
        <span>{value ? options.find((option) => option.value === value)?.label : label}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="m7 10 5 5 5-5" />
        </svg>
      </summary>
      <div className="sort-menu-panel">
        {options.map((option) => (
          <button
            className={option.value === value ? "is-selected" : ""}
            key={option.value}
            onClick={() => {
              onChange(option.value);
              setIsOpen(false);
            }}
            type="button"
          >
            {option.label}
            {option.value === value && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
    </details>
  );
}

export default function GalleryControls({
  categories,
  selectedCategories,
  sortField,
  sortDirection,
  onReset,
  onUpload,
  onSortFieldChange,
  onSortDirectionChange,
  onToggleCategory,
  totalCount,
  visibleCount,
}) {
  const categoryMenuRef = useRef(null);
  const sortFieldMenuRef = useRef(null);
  const sortDirectionMenuRef = useRef(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const hasActiveControls = selectedCategories.size > 0 || sortField;
  const selectedCategoryCount = selectedCategories.size;

  useEffect(() => {
    const closeOnOutsideInteraction = (event) => {
      if (!categoryMenuRef.current?.contains(event.target)) {
        setIsCategoryMenuOpen(false);
      }
      [sortFieldMenuRef, sortDirectionMenuRef].forEach((menuRef) => {
        if (!menuRef.current?.contains(event.target)) {
          const details = menuRef.current?.querySelector("details");
          if (details?.open) details.open = false;
        }
      });
    };
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsCategoryMenuOpen(false);
      [sortFieldMenuRef, sortDirectionMenuRef].forEach((menuRef) => {
        const details = menuRef.current?.querySelector("details");
        if (details?.open) details.open = false;
      });
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
          <div className="sort-select" ref={sortFieldMenuRef}>
            <SortMenu
              label="Sort"
              onChange={onSortFieldChange}
              options={[
                { value: "title", label: "Title" },
                { value: "category", label: "Category" },
                { value: "date", label: "Date" },
              ]}
              value={sortField}
            />
          </div>
          <div className="sort-select" ref={sortDirectionMenuRef}>
            <SortMenu
              disabled={!sortField}
              label="Direction"
              onChange={onSortDirectionChange}
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
              value={sortDirection}
            />
          </div>
        </div>

        <button className="upload-button" onClick={onUpload} type="button">
          <span aria-hidden="true">＋</span> Add image
        </button>

        <button
          className="reset-button"
          disabled={!hasActiveControls}
          onClick={onReset}
          type="button"
        >
          Reset all
        </button>
      </div>
      <p className="results-summary" aria-live="polite">
        Showing <strong>{visibleCount}</strong> of {totalCount} images
      </p>
    </section>
  );
}
