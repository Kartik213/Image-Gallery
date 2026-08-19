export function getCategories(images) {
  return [...new Set(images.map((image) => image.category))];
}

export function prepareImages(images) {
  return images.map((image, originalIndex) => ({
    ...image,
    originalIndex,
    timestamp: Date.parse(image.date),
  }));
}

export function filterAndSortImages(images, selectedCategories, sortField) {
  const filteredImages = images.filter(
    (image) =>
      selectedCategories.size === 0 ||
      selectedCategories.has(image.category),
  );

  if (!sortField) return filteredImages;

  return filteredImages.toSorted((a, b) =>
    sortField === "date"
      ? a.timestamp - b.timestamp
      : a[sortField].localeCompare(b[sortField]),
  );
}