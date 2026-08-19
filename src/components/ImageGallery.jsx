import { useMemo, useState } from "react";
import images from "../initial-dataset.json";
import GalleryHeader from "./GalleryHeader";
import ImageCard from "./ImageCard";
import GalleryControls from "./GalleryControls";
import { filterAndSortImages, getCategories, prepareImages } from "../utils/gallery";
import Lightbox from "./Lightbox";

const categories = getCategories(images);
const preparedImages = prepareImages(images);

export default function ImageGallery() {
  const [selectedCategories, setSelectedCategories] = useState(() => new Set());
  const [sortField, setSortField] = useState("");
  const [lightboxImageId, setLightboxImageId] = useState(null);

  const visibleImages = useMemo(
    () => filterAndSortImages(preparedImages, selectedCategories, sortField),
    [selectedCategories, sortField],
  );
  const lightboxIndex = visibleImages.findIndex((image) => image.id === lightboxImageId);
  const lightboxImage = lightboxIndex >= 0 ? visibleImages[lightboxIndex] : null;

  const toggleCategory = (category) => {
    setSelectedCategories((currentCategories) => {
      const nextCategories = new Set(currentCategories);

      if (nextCategories.has(category)) {
        nextCategories.delete(category);
      } else {
        nextCategories.add(category);
      }

      return nextCategories;
    });
  };

  const resetControls = () => {
    setSelectedCategories(new Set());
    setSortField("");
  };

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <GalleryHeader imageCount={images.length} />
      </header>

      <GalleryControls
        categories={categories}
        selectedCategories={selectedCategories}
        sortField={sortField}
        totalCount={images.length}
        visibleCount={visibleImages.length}
        onReset={resetControls}
        onSortFieldChange={setSortField}
        onToggleCategory={toggleCategory}
      />

      {visibleImages.length > 0 ? (
        <section className="gallery" aria-label="Image gallery">
          {visibleImages.map((image) => (
            <ImageCard
              image={image}
              key={image.id}
              onOpen={() => setLightboxImageId(image.id)}
            />
          ))}
        </section>
      ) : (
        <section className="empty-gallery" aria-live="polite">
          <h2>No images found</h2>
          <p>Try choosing a different category or reset the gallery controls.</p>
        </section>
      )}

      {lightboxImage && (
        <Lightbox
          currentIndex={lightboxIndex}
          image={lightboxImage}
          onClose={() => setLightboxImageId(null)}
          onNext={() => setLightboxImageId(visibleImages[lightboxIndex + 1]?.id)}
          onPrevious={() => setLightboxImageId(visibleImages[lightboxIndex - 1]?.id)}
          totalImages={visibleImages.length}
        />
      )}
    </main>
  );
}
