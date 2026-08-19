import { memo, useRef } from "react";
import { formatGalleryDate } from "../utils/date";

function ImageCard({ image, onDelete, onOpen }) {
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  const startLongPress = () => {
    longPressTriggered.current = false;
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true;
      onDelete(image.id);
    }, 650);
  };
  const cancelLongPress = () => window.clearTimeout(longPressTimer.current);
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(image.id);
    }
  };

  return (
    <article
      aria-label={`Open ${image.title}`}
      className="card"
      onClick={() => !longPressTriggered.current && onOpen(image.id)}
      onKeyDown={handleKeyDown}
      onPointerDown={startLongPress}
      onPointerLeave={cancelLongPress}
      onPointerUp={cancelLongPress}
      role="button"
      tabIndex="0"
    >
      <div className="card-image">
        <img src={image.image_url} alt={image.alt_text} loading="lazy" />
        <button
          aria-label={`Delete ${image.title}`}
          className="card-delete"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(image.id);
          }}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span>{image.category}</span>
          <time dateTime={image.date}>{formatGalleryDate(image.date)}</time>
        </div>
        <h2>{image.title}</h2>
      </div>
    </article>
  );
}

export default memo(ImageCard);
