import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ScamPatterns from "../components/ScamPatterns.jsx";

export default function ScamRadar({ t }) {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState(null);

  const categories = t?.radar?.categories || [];

  return (
    <div className="page-wrapper scam-radar-page animate-fade-in">
      <div className="page-intro-header">
        <span className="page-pill">{t.radar.pagePill}</span>
        <h1 className="page-main-title">{t.radar.heading}</h1>
        <p className="page-main-desc">
          {t.radar.subheading}
        </p>
      </div>

      {/* Radar Cards Grid */}
      <section className="scam-radar-section">
        <div className="radar-grid-container">
          {categories.map((cat, index) => (
            <div
              className={`radar-feature-card interactive-card ${selectedPattern?.title === cat.title ? "selected-radar-card" : ""}`}
              key={index}
              onClick={() => setSelectedPattern(cat)}
            >
              <div className="radar-card-header">
                <span className="radar-icon-box" aria-hidden="true">{cat.icon}</span>
                <span className="radar-category-badge">{cat.badge}</span>
              </div>
              <h3 className="radar-card-title">{cat.title}</h3>
              <p className="radar-card-desc">{cat.desc}</p>
              <span className="radar-click-hint">{t.radar.clickHint}</span>
            </div>
          ))}
        </div>

        {/* Expanded Pattern Modal / Panel */}
        {selectedPattern && (
          <div className="pattern-detail-panel animate-fade-in" role="region" aria-label="Pattern Details">
            <div className="detail-panel-header">
              <div className="detail-header-left">
                <span className="detail-icon">{selectedPattern.icon}</span>
                <div>
                  <h3 className="detail-title">{selectedPattern.title}</h3>
                  <span className="detail-badge">{selectedPattern.badge}</span>
                </div>
              </div>
              <button
                type="button"
                className="detail-close-btn"
                onClick={() => setSelectedPattern(null)}
                aria-label="Close details"
              >
                ✕
              </button>
            </div>

            <div className="detail-body">
              <p className="detail-desc">{selectedPattern.desc}</p>
              <h4 className="detail-subtitle">{t.patterns.labelLooks}</h4>
              <ul className="detail-points-list">
                {selectedPattern.details?.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
              <div className="detail-action-callout">
                <strong>🛡️ {t.patterns.labelVerify}:</strong> {selectedPattern.action}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Scam Pattern Library */}
      <ScamPatterns t={t} />

      {/* Action Banner */}
      <div className="page-cta-banner">
        <h3>{t.radar.ctaBanner?.title}</h3>
        <p>{t.radar.ctaBanner?.desc}</p>
        <button
          type="button"
          className="primary-btn banner-cta-btn"
          onClick={() => navigate("/check-message")}
        >
          {t.radar.ctaBanner?.btn}
        </button>
      </div>
    </div>
  );
}
