const galleryDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export function formatGalleryDate(dateString) {
  return galleryDateFormatter.format(new Date(`${dateString}T00:00:00`));
}
