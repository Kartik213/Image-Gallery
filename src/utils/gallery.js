const collator = new Intl.Collator(undefined, { sensitivity: "base" });

export function getCategories(images) {
  return [...new Set(images.map((image) => image.category))].sort(collator.compare);
}

export function prepareImages(images) {
  return images.map((image, originalIndex) => ({
    ...image,
    originalIndex,
    timestamp: Date.parse(image.date),
  }));
}

export function filterAndSortImages(images, selectedCategories, sortField, sortDirection = "asc") {
  const filteredImages = images.filter(
    (image) => selectedCategories.size === 0 || selectedCategories.has(image.category),
  );

  if (!sortField) return filteredImages;

  const direction = sortDirection === "desc" ? -1 : 1;
  return filteredImages.toSorted((a, b) => {
    const comparison =
      sortField === "date"
        ? a.timestamp - b.timestamp
        : collator.compare(a[sortField], b[sortField]);
    return comparison === 0 ? a.originalIndex - b.originalIndex : comparison * direction;
  });
}
