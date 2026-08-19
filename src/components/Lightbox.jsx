import { useEffect, useRef } from "react";
import { formatGalleryDate } from "../utils/date";

export default function Lightbox({
  currentIndex,
  image,
  onClose,
  onNext,
  onPrevious,
  totalImages,
}) {
  const closeButtonRef = useRef(null);
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === totalImages - 1;

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && !isFirstImage) onPrevious();
      if (event.key === "ArrowRight" && !isLastImage) onNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isFirstImage, isLastImage, onClose, onNext, onPrevious]);

  return (
    <div
      aria-label={`${image.title} preview`}
      aria-modal="true"
      className="lightbox"
      onClick={onClose}
      role="dialog"
    >
      <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
        <button
          aria-label="Close image preview"
          className="lightbox-close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="lightbox-media">
          <img src={image.image_url} alt={image.alt_text} />
        </div>

        <div className="lightbox-details">
          <div>
            <p className="lightbox-category">{image.category}</p>
            <h2>{image.title}</h2>
            <time dateTime={image.date}>{formatGalleryDate(image.date)}</time>
          </div>
          <p className="lightbox-position" aria-live="polite">
            {currentIndex + 1} / {totalImages}
          </p>
        </div>

        <button
          aria-label={isFirstImage ? "No previous image" : "Previous image"}
          className="lightbox-nav lightbox-prev"
          disabled={isFirstImage}
          onClick={onPrevious}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m15 5-7 7 7 7" />
          </svg>
        </button>
        <button
          aria-label={isLastImage ? "No next image" : "Next image"}
          className="lightbox-nav lightbox-next"
          disabled={isLastImage}
          onClick={onNext}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
