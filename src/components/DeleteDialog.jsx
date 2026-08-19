import Modal from "./Modal";

export default function DeleteDialog({ image, onCancel, onConfirm }) {
  return (
    <Modal
      ariaLabelledBy="delete-title"
      className="dialog-backdrop"
      onClose={onCancel}
      panelClassName="gallery-dialog delete-dialog"
    >
      <p className="dialog-kicker">Remove image</p>
      <h2 id="delete-title">Delete “{image.title}”?</h2>
      <p>This will remove the image from your gallery and cannot be undone.</p>
      <div className="dialog-actions">
        <button className="dialog-cancel" onClick={onCancel} type="button">
          Keep image
        </button>
        <button className="dialog-danger" onClick={onConfirm} type="button">
          Delete image
        </button>
      </div>
    </Modal>
  );
}
