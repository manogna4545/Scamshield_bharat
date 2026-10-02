import { useNavigate } from "react-router-dom";

export default function AboutSection({ t }) {
  const navigate = useNavigate();

  return (
    <div className="about-content-wrapper">
      {/* 1. Main Hero (The single main page heading) */}
      <section className="about-hero-section">
        <div className="about-hero-inner">
          <div className="section-pill about-pill animate-fade-in">
            <span className="badge-dot"></span>
            <span>{t.about.heroLabel}</span>
          </div>
          <h1 className="about-hero-headline">
            {t.about.heroHeading}
          </h1>
          <p className="about-hero-description">
            {t.about.heroDesc}
          </p>
        </div>
      </section>

      {/* 2 & 3. What is ScamShield Bharat? & Our Mission */}
      <section className="about-story-section">
        <div className="about-story-grid">
          {/* What is ScamShield Bharat */}
          <div className="about-story-card">
            <div className="story-card-header">
              <span className="story-icon" aria-hidden="true">🛡️</span>
              <h2 className="story-card-title">{t.about.whatIsHeading}</h2>
            </div>
            <p className="story-paragraph">{t.about.whatIsContent1}</p>
            <p className="story-paragraph">{t.about.whatIsContent2}</p>
          </div>

          {/* Our Mission */}
          <div className="about-story-card highlight-card">
            <div className="story-card-header">
              <span className="story-icon" aria-hidden="true">🎯</span>
              <h2 className="story-card-title">{t.about.missionHeading}</h2>
            </div>
            <p className="story-paragraph">{t.about.missionContent1}</p>
            <p className="story-paragraph">{t.about.missionContent2}</p>
          </div>
        </div>
      </section>

      {/* 4. What the Platform Does (4 Cards) */}
      <section className="about-capabilities-section">
        <div className="section-header">
          <p className="section-pill">{t.about.heroLabel}</p>
          <h2 className="section-title">{t.about.platformDoesHeading}</h2>
        </div>

        <div className="about-capabilities-grid">
          {t.about.capabilities.map((item, idx) => (
            <div className="about-capability-card" key={idx}>
              <div className="capability-icon-bubble" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="capability-title">{item.title}</h3>
              <p className="capability-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Built for India / Bharat */}
      <section className="about-built-section">
        <div className="built-banner-box">
          <div className="built-banner-content">
            <div className="built-icon-header">
              <span className="built-flag-icon" aria-hidden="true">🇮🇳</span>
              <h2 className="built-title">{t.about.builtHeading}</h2>
            </div>
            <p className="built-desc">{t.about.builtDesc}</p>
            <div className="built-pills-row">
              {t.about.builtPills.map((pill, idx) => (
                <span className="built-pill-tag" key={idx}>
                  <span className="pill-check" aria-hidden="true">✓</span>
                  <span>{pill}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Safety-First Principles (3 Cards) */}
      <section className="about-principles-section">
        <div className="section-header">
          <p className="section-pill">{t.about.heroLabel}</p>
          <h2 className="section-title">{t.about.principlesHeading}</h2>
        </div>

        <div className="about-principles-grid">
          {t.about.principles.map((item, idx) => (
            <div className="about-principle-card" key={idx}>
              <div className="principle-icon-wrap" aria-hidden="true">
                {item.icon}
              </div>
              <h3 className="principle-title">{item.title}</h3>
              <p className="principle-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. How It Helps: From Suspicion to Safer Decisions (3 Steps) */}
      <section className="about-how-section">
        <div className="section-header">
          <p className="section-pill">{t.about.heroLabel}</p>
          <h2 className="section-title">{t.about.howItHelpsHeading}</h2>
        </div>

        <div className="about-steps-row">
          {t.about.steps.map((stepItem, idx) => (
            <div className="about-step-card" key={idx}>
              <div className="about-step-top">
                <span className="about-step-number">{stepItem.step}</span>
                <span className="about-step-tag">{stepItem.name}</span>
              </div>
              <p className="about-step-desc">{stepItem.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Final Callout Section */}
      <section className="about-final-cta-section">
        <div className="about-final-cta-card">
          <div className="cta-card-icon" aria-hidden="true">🛡️</div>
          <h2 className="cta-card-title">{t.about.finalHeading}</h2>
          <p className="cta-card-desc">{t.about.finalDesc}</p>
          <button
            type="button"
            className="primary-btn about-primary-cta pulse-glow"
            onClick={() => navigate("/check-message")}
          >
            🛡️ {t.about.finalBtn}
          </button>
        </div>
      </section>
    </div>
  );
}
