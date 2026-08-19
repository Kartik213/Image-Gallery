import images from "../initial-dataset.json";
import GalleryHeader from "./GalleryHeader";
import ImageCard from "./ImageCard";

export default function ImageGallery() {
  return (
    <main className="gallery-page">
      <header className="gallery-header">
        <GalleryHeader imageCount={images.length} />
      </header>

      <section className="gallery" aria-label="Image gallery">
        {images.map((image) => <ImageCard image={image} key={image.id} />)}
      </section>
    </main>
  );
}
