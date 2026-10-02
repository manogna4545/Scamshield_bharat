export default function Toast({ message, type = "info", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      <span className="toast-icon">
        {type === "success" && "✅"}
        {type === "error" && "⚠️"}
        {type === "info" && "ℹ️"}
      </span>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
