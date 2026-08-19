export default function Modal({
  ariaLabel,
  ariaLabelledBy,
  children,
  className = "",
  onClose,
  panelClassName = "",
}) {
  return (
    <div
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-modal="true"
      className={`modal-backdrop ${className}`.trim()}
      onClick={onClose}
      role="dialog"
    >
      <div
        className={`modal-panel ${panelClassName}`.trim()}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
