export default function TrustStrip({ t }) {
  return (
    <section className="trust-strip-section" aria-label="Trust and Integrity Guarantees">
      <div className="trust-strip-container">
        <p className="trust-strip-heading">{t.trust.heading}</p>
        <div className="trust-grid">
          {t.trust.items.map((item) => (
            <div className="trust-card" key={item.title}>
              <div className="trust-icon" aria-hidden="true">{item.icon}</div>
              <div className="trust-text">
                <h4 className="trust-card-title">{item.title}</h4>
                <p className="trust-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
