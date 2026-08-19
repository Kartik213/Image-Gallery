export default function GalleryHeader({ imageCount }) {
  return (
    <>
      <div className="gallery-header-main">
        <h1>Image Gallery</h1>
        <p className="gallery-description">
          A curated collection of nature, urban scenes, and heritage.
        </p>
      </div>

      <div className="image-count" aria-label={`${imageCount} images`}>
        <strong>{imageCount}</strong>
        <span>images</span>
      </div>
    </>
  );
}
