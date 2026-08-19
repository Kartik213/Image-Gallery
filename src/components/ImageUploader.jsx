import { useState } from "react";
import Modal from "./Modal";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function ImageUploader({ categories, onClose, onSave }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [newCategory, setNewCategory] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];
    if (!nextFile) return;
    if (!nextFile.type.startsWith("image/") || nextFile.size > MAX_FILE_SIZE) {
      setFile(null);
      setError("Choose an image file up to 10 MB (JPG, PNG, GIF, WebP, or similar).");
      return;
    }
    setError("");
    setFile(nextFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const chosenCategory = category === "__new__" ? newCategory.trim() : category;
    if (!file || !title.trim() || !chosenCategory || !date) {
      setError("Add an image, title, category, and date before saving.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave({ file, title: title.trim(), category: chosenCategory, date });
    } catch {
      setError("The image could not be saved. Please try again.");
      setIsSaving(false);
    }
  };

  return (
    <Modal
      ariaLabel="Add an image"
      className="dialog-backdrop"
      onClose={onClose}
      panelClassName="gallery-dialog"
    >
      <form onSubmit={handleSubmit}>
        <div className="dialog-heading">
          <div>
            <p className="dialog-kicker">Your collection</p>
            <h2>Add an image</h2>
          </div>
          <button
            aria-label="Close upload dialog"
            className="dialog-close"
            onClick={onClose}
            type="button"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <label className="file-picker">
          <input accept="image/*" onChange={handleFileChange} type="file" />
          <strong>{file ? file.name : "Choose an image"}</strong>
          <span>JPG, PNG, GIF, WebP · max 10 MB</span>
        </label>
        <label>
          Title
          <input onChange={(event) => setTitle(event.target.value)} value={title} />
        </label>
        <div className="dialog-grid">
          <label>
            Category
            <select onChange={(event) => setCategory(event.target.value)} value={category}>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
              <option value="__new__">+ New category</option>
            </select>
          </label>
          {category === "__new__" && (
            <label>
              New category
              <input onChange={(event) => setNewCategory(event.target.value)} value={newCategory} />
            </label>
          )}
          <label>
            Date
            <input onChange={(event) => setDate(event.target.value)} type="date" value={date} />
          </label>
        </div>
        {error && (
          <p className="dialog-error" role="alert">
            {error}
          </p>
        )}
        <div className="dialog-actions">
          <button className="dialog-cancel" onClick={onClose} type="button">
            Cancel
          </button>
          <button className="dialog-submit" disabled={isSaving} type="submit">
            {isSaving ? "Saving…" : "Add image"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
