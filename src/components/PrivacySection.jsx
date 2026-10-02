export default function PrivacySection({ t }) {
  return (
    <section className="privacy-trust-section" id="privacy">
      <div className="section-header">
        <p className="section-pill">{t.privacy.smallTitle}</p>
        <h2 className="section-title">{t.privacy.heading}</h2>
        <p className="section-desc">{t.privacy.subheading}</p>
      </div>

      <div className="privacy-cards-grid">
        <div className="privacy-feature-card card-boundary">
          <div className="privacy-card-icon">🛡️</div>
          <h3 className="privacy-card-title">{t.privacy.neverTitle}</h3>
          <ul className="privacy-list">
            {t.privacy.neverItems.map((item, idx) => (
              <li key={idx} className="privacy-item">
                <span className="bullet-no">✕</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="privacy-feature-card card-action">
          <div className="privacy-card-icon">💡</div>
          <h3 className="privacy-card-title">{t.privacy.userActionTitle}</h3>
          <ul className="privacy-list">
            {t.privacy.userActionItems.map((item, idx) => (
              <li key={idx} className="privacy-item">
                <span className="bullet-yes">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
