import { useState } from "react";

export default function Checklist({ t, onShowToast }) {
  const items = t.checklist.items;
  const [checkedIndices, setCheckedIndices] = useState(new Set());

  const handleToggle = (index) => {
    const next = new Set(checkedIndices);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCheckedIndices(next);
  };

  const handleReset = () => {
    setCheckedIndices(new Set());
  };

  const handleCopyChecklist = async () => {
    try {
      const text = `${t.checklist.reportTitle}\n\n${items
        .map((item, idx) => `[${checkedIndices.has(idx) ? "✓" : " "}] ${item}`)
        .join("\n")}\n\n${t.checklist.reportChecksCompleted}: ${checkedIndices.size} / ${items.length}\n\n${t.footer.tagline}`;

      await navigator.clipboard.writeText(text);
      onShowToast(t.checklist.copiedMsg, "success");
    } catch {
      onShowToast(t.checklist.copyErrorMsg, "error");
    }
  };

  const total = items.length;
  const checkedCount = checkedIndices.size;
  const progressPercent = Math.round((checkedCount / total) * 100);

  return (
    <section className="checklist-section" id="checklist">
      <div className="checklist-card-box">
        {/* Progress header */}
        <div className="checklist-progress-header">
          <div className="progress-info">
            <span className="progress-counter">
              <strong>{checkedCount}</strong> / {total} {t.checklist.progressLabel}
            </span>
            <span className="progress-percentage">{progressPercent}%</span>
          </div>

          <div className="checklist-progress-track">
            <div
              className={`checklist-progress-fill ${checkedCount === total ? "complete" : ""}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {checkedCount === total && (
            <div className="checklist-all-checked-notice animate-fade-in">
              🎉 {t.checklist.allCheckedMsg}
            </div>
          )}
        </div>

        {/* Interactive Checkbox Items */}
        <div className="checklist-items-grid">
          {items.map((itemText, index) => {
            const isChecked = checkedIndices.has(index);
            return (
              <label
                key={index}
                className={`checklist-item-row ${isChecked ? "row-checked" : ""}`}
                htmlFor={`check-item-${index}`}
              >
                <input
                  type="checkbox"
                  id={`check-item-${index}`}
                  className="checklist-checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(index)}
                />
                <span className="custom-check-box" aria-hidden="true">
                  {isChecked && "✓"}
                </span>
                <span className="checklist-text">{itemText}</span>
              </label>
            );
          })}
        </div>

        {/* Action Toolbar */}
        <div className="checklist-actions-toolbar">
          <button
            type="button"
            className="secondary-btn checklist-tool-btn"
            onClick={handleReset}
            disabled={checkedCount === 0}
          >
            🔄 {t.checklist.resetBtn}
          </button>

          <button
            type="button"
            className="secondary-btn checklist-tool-btn"
            onClick={handleCopyChecklist}
          >
            📋 {t.checklist.copyBtn}
          </button>
        </div>
      </div>
    </section>
  );
}
