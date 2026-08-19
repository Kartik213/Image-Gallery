import { formatGalleryDate } from "../utils/date";

export default function ImageCard({ image }) {
  return (
    <article className="card">
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
