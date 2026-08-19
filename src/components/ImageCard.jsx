import { memo } from "react";
import { formatGalleryDate } from "../utils/date";

function ImageCard({ image, onOpen }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <article
      aria-label={`Open ${image.title}`}
      className="card"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex="0"
    >
      <div className="card-image">
        <img src={image.image_url} alt={image.alt_text} loading="lazy" />
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
