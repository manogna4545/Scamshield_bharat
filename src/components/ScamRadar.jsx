export default function ScamRadar({ t }) {
  return (
    <section className="scam-radar-section" id="radar">
      <div className="section-header">
        <p className="section-pill">{t.radar.smallTitle}</p>
        <h2 className="section-title">{t.radar.heading}</h2>
        <p className="section-desc">{t.radar.subheading}</p>
      </div>

      <div className="radar-grid-container">
        {t.radar.categories.map((cat, index) => (
          <div className="radar-feature-card" key={index}>
            <div className="radar-card-header">
              <span className="radar-icon-box" aria-hidden="true">{cat.icon}</span>
              <span className="radar-category-badge">{cat.badge}</span>
            </div>
            <h3 className="radar-card-title">{cat.title}</h3>
            <p className="radar-card-desc">{cat.desc}</p>
          </div>
        ))}
      </div>

      <div className="radar-footnote">
        <span className="info-icon">ℹ️</span>
        <small>{t.radar.footnote}</small>
      </div>
    </section>
  );
}
