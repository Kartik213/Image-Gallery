import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import images from "../initial-dataset.json";
import GalleryHeader from "./GalleryHeader";
import ImageCard from "./ImageCard";
import GalleryControls from "./GalleryControls";
import { filterAndSortImages, getCategories, prepareImages } from "../utils/gallery";
import Lightbox from "./Lightbox";
import ImageUploader from "./ImageUploader";
import DeleteDialog from "./DeleteDialog";
import {
  loadDeletedImageIds,
  loadUserImages,
  markImageDeleted,
  removeUserImage,
  saveUserImage,
} from "../utils/imageStore";
import { loadGalleryViewState, saveGalleryViewState } from "../utils/galleryState";
import { loadCategories, saveCategories } from "../utils/categoryState";

export default function ImageGallery() {
  const [allImages, setAllImages] = useState(images);
  const [categories, setCategories] = useState(() => loadCategories(getCategories(images)));
  const [selectedCategories, setSelectedCategories] = useState(
    () => new Set(loadGalleryViewState().selectedCategories),
  );
  const [sortField, setSortField] = useState(() => loadGalleryViewState().sortField);
  const [sortDirection, setSortDirection] = useState(() => loadGalleryViewState().sortDirection);
  const [lightboxImageId, setLightboxImageId] = useState(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const userObjectUrlsRef = useRef(new Map());

  useEffect(() => {
    Promise.all([loadUserImages(), loadDeletedImageIds()])
      .then(([storedImages, deletedIds]) => {
        setAllImages((current) => {
          const mergedImages = new Map(
            current.filter((image) => !deletedIds.has(image.id)).map((image) => [image.id, image]),
          );
          storedImages.forEach((image) => {
            mergedImages.set(image.id, image);
            if (image.image_url) userObjectUrlsRef.current.set(image.id, image.image_url);
          });
          return [...mergedImages.values()];
        });
        setCategories((current) => {
          const next = [
            ...new Set([...current, ...storedImages.map((image) => image.category)]),
          ].sort((a, b) => a.localeCompare(b));
          saveCategories(next);
          return next;
        });
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const objectUrls = userObjectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  useEffect(() => {
    saveGalleryViewState({ selectedCategories: [...selectedCategories], sortField, sortDirection });
  }, [selectedCategories, sortDirection, sortField]);

  const preparedImages = useMemo(() => prepareImages(allImages), [allImages]);

  const visibleImages = useMemo(
    () => filterAndSortImages(preparedImages, selectedCategories, sortField, sortDirection),
    [preparedImages, selectedCategories, sortDirection, sortField],
  );
  const lightboxIndex = visibleImages.findIndex((image) => image.id === lightboxImageId);
  const lightboxImage = lightboxIndex >= 0 ? visibleImages[lightboxIndex] : null;

  const toggleCategory = useCallback((category) => {
    setSelectedCategories((currentCategories) => {
      const nextCategories = new Set(currentCategories);

      if (nextCategories.has(category)) {
        nextCategories.delete(category);
      } else {
        nextCategories.add(category);
      }

      return nextCategories;
    });
  }, []);

  const resetControls = useCallback(() => {
    setSelectedCategories(new Set());
    setSortField("");
    setSortDirection("asc");
  }, []);

  const addImage = useCallback(async ({ file, title, category, date }) => {
    const id = `user-${crypto.randomUUID()}`;
    const image = { id, title, category, date, alt_text: title, file, userImage: true };
    await saveUserImage(image);
    const imageUrl = URL.createObjectURL(file);
    userObjectUrlsRef.current.set(id, imageUrl);
    setAllImages((current) => [...current, { ...image, image_url: imageUrl }]);
    setCategories((current) => {
      if (current.includes(category)) return current;
      const next = [...current, category].sort((a, b) => a.localeCompare(b));
      saveCategories(next);
      return next;
    });
    setIsUploaderOpen(false);
  }, []);

  const deleteImage = useCallback(async () => {
    if (!deleteCandidate) return;
    if (deleteCandidate.userImage) await removeUserImage(deleteCandidate.id);
    else await markImageDeleted(deleteCandidate.id);
    const objectUrl = userObjectUrlsRef.current.get(deleteCandidate.id);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      userObjectUrlsRef.current.delete(deleteCandidate.id);
    }
    const remainingImages = allImages.filter((image) => image.id !== deleteCandidate.id);
    setAllImages(remainingImages);
    if (lightboxImageId === deleteCandidate.id) setLightboxImageId(null);
    setDeleteCandidate(null);
  }, [allImages, deleteCandidate, lightboxImageId]);

  const openImage = useCallback((imageId) => {
    setLightboxImageId(imageId);
  }, []);

  const requestDelete = useCallback(
    (imageId) => {
      setDeleteCandidate(allImages.find((image) => image.id === imageId) ?? null);
    },
    [allImages],
  );

  const closeLightbox = useCallback(() => {
    setLightboxImageId(null);
  }, []);

  const goToNextImage = useCallback(() => {
    setLightboxImageId(visibleImages[lightboxIndex + 1]?.id);
  }, [lightboxIndex, visibleImages]);

  const goToPreviousImage = useCallback(() => {
    setLightboxImageId(visibleImages[lightboxIndex - 1]?.id);
  }, [lightboxIndex, visibleImages]);

  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <GalleryHeader imageCount={allImages.length} />
      </header>

      <GalleryControls
        categories={categories}
        selectedCategories={selectedCategories}
        sortField={sortField}
        sortDirection={sortDirection}
        onUpload={() => setIsUploaderOpen(true)}
        totalCount={allImages.length}
        visibleCount={visibleImages.length}
        onReset={resetControls}
        onSortFieldChange={setSortField}
        onSortDirectionChange={setSortDirection}
        onToggleCategory={toggleCategory}
      />

      {visibleImages.length > 0 ? (
        <section className="gallery" aria-label="Image gallery">
          {visibleImages.map((image) => (
            <ImageCard image={image} key={image.id} onDelete={requestDelete} onOpen={openImage} />
          ))}
        </section>
      ) : (
        <section className="empty-gallery" aria-live="polite">
          <h2>No images found</h2>
          <p>Try choosing a different category or reset the filtering controls.</p>
        </section>
      )}

      {lightboxImage && (
        <Lightbox
          currentIndex={lightboxIndex}
          image={lightboxImage}
          onClose={closeLightbox}
          onNext={goToNextImage}
          onPrevious={goToPreviousImage}
          totalImages={visibleImages.length}
        />
      )}
      {isUploaderOpen && (
        <ImageUploader
          categories={categories}
          onClose={() => setIsUploaderOpen(false)}
          onSave={addImage}
        />
      )}
      {deleteCandidate && (
        <DeleteDialog
          image={deleteCandidate}
          onCancel={() => setDeleteCandidate(null)}
          onConfirm={deleteImage}
        />
      )}
    </main>
  );
}
