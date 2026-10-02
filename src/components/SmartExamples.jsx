export default function SmartExamples({ t, onSelectExample }) {
  const exampleItems = t?.examples?.items || [];

  return (
    <section className="smart-examples-section" id="examples">
      <div className="section-header">
        <p className="section-pill">{t.examples.smallTitle}</p>
        <h2 className="section-title">{t.examples.heading}</h2>
        <p className="section-desc">{t.examples.subheading}</p>
      </div>

      <div className="examples-grid-container">
        {exampleItems.map((item, idx) => (
          <div className="example-educational-card" key={item.id || idx}>
            <div className="example-card-top">
              <span className="example-icon" aria-hidden="true">
                {idx === 0 && "💰"}
                {idx === 1 && "⏱️"}
                {idx === 2 && "🧑‍💼"}
                {idx === 3 && "💳"}
                {idx === 4 && "📱"}
                {idx > 4 && "⚠️"}
              </span>
              <div className="example-meta">
                <strong className="example-title">{item.category}</strong>
                <span className="example-badge">{item.badge}</span>
              </div>
            </div>

            <div className="example-body-box">
              <p className="example-text">"{item.message}"</p>
            </div>

            <button
              type="button"
              className="primary-btn example-run-btn"
              onClick={() => onSelectExample(item.message)}
            >
              {t.examples.runBtn}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
