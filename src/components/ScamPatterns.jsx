export default function ScamPatterns({ t }) {
  const cards = t?.patterns?.cards || [];

  return (
    <section className="scam-patterns-section" id="learn">
      <div className="section-header">
        <p className="section-pill">{t.patterns.smallTitle}</p>
        <h2 className="section-title">{t.patterns.heading}</h2>
        <p className="section-desc">{t.patterns.subheading}</p>
      </div>

      <div className="patterns-card-grid">
        {cards.map((item, idx) => (
          <div className="pattern-library-card" key={idx}>
            <div className="pattern-card-header">
              <span className="pattern-icon-bubble" aria-hidden="true">{item.icon}</span>
              <h3 className="pattern-card-title">{item.title}</h3>
            </div>

            <div className="pattern-subgroup">
              <span className="pattern-subgroup-label label-looks">{t.patterns.labelLooks}</span>
              <p className="pattern-subgroup-text looks-text">"{item.looksLike}"</p>
            </div>

            <div className="pattern-subgroup">
              <span className="pattern-subgroup-label label-risky">{t.patterns.labelRisky}</span>
              <p className="pattern-subgroup-text">{item.whyRisky}</p>
            </div>

            <div className="pattern-subgroup">
              <span className="pattern-subgroup-label label-verify">{t.patterns.labelVerify}</span>
              <p className="pattern-subgroup-text verify-text">{item.whatToVerify}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
