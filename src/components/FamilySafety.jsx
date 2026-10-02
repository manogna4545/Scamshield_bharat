export default function FamilySafety({ t, onShowToast }) {
  const handleShareGuide = async () => {
    const guideText = `${t.family.reportTitle}\n\n${t.family.subheading}\n\n${t.family.rules
      .map((r, i) => `${i + 1}. ${r}`)
      .join("\n\n")}\n\n${t.family.emergencyText}\n\n${t.footer.tagline}`;

    try {
      await navigator.clipboard.writeText(guideText);
      onShowToast(t.family.shareCopied, "success");
    } catch {
      onShowToast(t.family.copyErrorMsg, "error");
    }
  };

  return (
    <section className="family-safety-section" id="family">
      <div className="section-header">
        <p className="section-pill">{t.family.smallTitle}</p>
        <h2 className="section-title">{t.family.heading}</h2>
        <p className="section-desc">{t.family.subheading}</p>
      </div>

      <div className="family-safety-card-box">
        <div className="family-intro-row">
          <div className="family-avatar-cluster" aria-hidden="true">
            <span className="family-avatar">👵</span>
            <span className="family-avatar">👴</span>
            <span className="family-avatar">👨</span>
            <span className="family-avatar">👩</span>
          </div>
          <p className="family-intro-text">{t.family.desc}</p>
        </div>

        <div className="family-rules-grid">
          {t.family.rules.map((rule, idx) => (
            <div className="family-rule-card" key={idx}>
              <div className="rule-badge">{t.family.rulePrefix} {idx + 1}</div>
              <p className="rule-text">{rule}</p>
            </div>
          ))}
        </div>

        <div className="family-share-toolbar">
          <button
            type="button"
            className="primary-btn family-share-btn pulse-subtle"
            onClick={handleShareGuide}
          >
            📲 {t.family.shareBtn}
          </button>
        </div>
      </div>
    </section>
  );
}
