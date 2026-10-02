import { useNavigate } from "react-router-dom";
import HowItWorksSection from "../components/HowItWorks.jsx";

export default function HowItWorks({ t }) {
  const navigate = useNavigate();

  return (
    <div className="page-wrapper how-it-works-page animate-fade-in">
      <div className="page-intro-header">
        <span className="page-pill">{t.howItWorks.pagePill}</span>
        <h1 className="page-main-title">{t.howItWorks.heading}</h1>
        <p className="page-main-desc">{t.howItWorks.subheading}</p>
      </div>

      <HowItWorksSection t={t} />

      {/* Deep-dive methodology section */}
      <section className="methodology-card-section">
        <div className="methodology-card">
          <h3 className="methodology-title">{t.howItWorks.methodologyTitle}</h3>
          <p className="methodology-text">
            {t.howItWorks.methodologyText}
          </p>

          <div className="protocol-pillars-grid">
            {t.howItWorks.pillars?.map((pillar, idx) => (
              <div className="pillar-item" key={idx}>
                <span className="pillar-num">{pillar.num}</span>
                <h4>{pillar.title}</h4>
                <p>{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="page-cta-banner">
        <h3>{t.howItWorks.ctaBanner?.title}</h3>
        <p>{t.howItWorks.ctaBanner?.desc}</p>
        <button
          type="button"
          className="primary-btn banner-cta-btn"
          onClick={() => navigate("/check-message")}
        >
          {t.howItWorks.ctaBanner?.btn}
        </button>
      </div>
    </div>
  );
}
