import { useNavigate } from "react-router-dom";
import Hero from "../components/Hero.jsx";
import TrustStrip from "../components/TrustStrip.jsx";
import SmartExamples from "../components/SmartExamples.jsx";
import FamilySafety from "../components/FamilySafety.jsx";

export default function Home({
  t,
  onAnalyzeSample,
  onShowToast,
}) {
  const navigate = useNavigate();

  const handleSelectExample = (exampleText) => {
    onAnalyzeSample(exampleText);
    navigate("/check-message");
  };

  const hubCards = t?.homeHub?.cards || [];

  return (
    <div className="page-wrapper home-page animate-fade-in">
      {/* Hero Section */}
      <Hero
        t={t}
        onScrollToAnalyzer={() => navigate("/check-message")}
        onScrollToPatterns={() => navigate("/scam-radar")}
      />

      {/* Trust Strip */}
      <TrustStrip t={t} />

      {/* Feature Teasers / Quick Access Hub */}
      <section className="home-hub-section">
        <div className="section-header">
          <p className="section-pill">{t.homeHub.smallTitle}</p>
          <h2 className="section-title">{t.homeHub.heading}</h2>
          <p className="section-desc">{t.homeHub.desc}</p>
        </div>

        <div className="hub-grid">
          {/* Card 1: Check Message */}
          <div className="hub-card" onClick={() => navigate("/check-message")}>
            <div className="hub-card-icon">🛡️</div>
            <h3 className="hub-card-title">{hubCards[0]?.title || t.nav.checkMessage}</h3>
            <p className="hub-card-desc">
              {hubCards[0]?.desc}
            </p>
            <span className="hub-link-cta">{hubCards[0]?.cta || "Open Safety Scanner →"}</span>
          </div>

          {/* Card 2: Scam Radar */}
          <div className="hub-card" onClick={() => navigate("/scam-radar")}>
            <div className="hub-card-icon">📡</div>
            <h3 className="hub-card-title">{hubCards[1]?.title || t.nav.radar}</h3>
            <p className="hub-card-desc">
              {hubCards[1]?.desc}
            </p>
            <span className="hub-link-cta">{hubCards[1]?.cta || "Explore Radar →"}</span>
          </div>

          {/* Card 3: Safety Checklist */}
          <div className="hub-card" onClick={() => navigate("/safety-checklist")}>
            <div className="hub-card-icon">📋</div>
            <h3 className="hub-card-title">{hubCards[2]?.title || t.nav.checklist}</h3>
            <p className="hub-card-desc">
              {hubCards[2]?.desc}
            </p>
            <span className="hub-link-cta">{hubCards[2]?.cta || "Start Checklist →"}</span>
          </div>

          {/* Card 4: Red Flag Quiz */}
          <div className="hub-card" onClick={() => navigate("/red-flag-quiz")}>
            <div className="hub-card-icon">🚩</div>
            <h3 className="hub-card-title">{hubCards[3]?.title || t.nav.quiz}</h3>
            <p className="hub-card-desc">
              {hubCards[3]?.desc}
            </p>
            <span className="hub-link-cta">{hubCards[3]?.cta || "Take Challenge →"}</span>
          </div>
        </div>
      </section>

      {/* Smart Examples Preview */}
      <SmartExamples t={t} onSelectExample={handleSelectExample} />

      {/* Family Safety Mode */}
      <FamilySafety t={t} onShowToast={onShowToast} />
    </div>
  );
}
