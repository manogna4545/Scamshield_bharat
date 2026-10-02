export default function Hero({ t, onScrollToAnalyzer, onScrollToPatterns }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="badge-dot"></span>
            <span>{t.hero.badge}</span>
          </div>

          <h1 className="hero-headline">
            {t.hero.headlinePrefix} <br />
            <span className="headline-gradient">{t.hero.headlineSpan}</span>
          </h1>

          <p className="hero-subtext">
            {t.hero.supporting}
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="primary-btn hero-btn pulse-glow"
              onClick={onScrollToAnalyzer}
            >
              🛡️ {t.hero.ctaPrimary}
            </button>

            <button
              type="button"
              className="secondary-btn hero-btn"
              onClick={onScrollToPatterns}
            >
              🔍 {t.hero.ctaSecondary}
            </button>
          </div>

          <div className="hero-trust-pill">
            <span className="lock-icon">🔒</span>
            <span>{t.hero.trustPill}</span>
          </div>
        </div>

        {/* Digital Safety Shield Custom Vector Art */}
        <div className="hero-visual" aria-hidden="true">
          <div className="shield-graphic-container">
            <svg
              className="shield-svg"
              viewBox="0 0 400 440"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="shieldGrad" x1="200" y1="20" x2="200" y2="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1D4ED8" />
                  <stop offset="0.6" stopColor="#1E40AF" />
                  <stop offset="1" stopColor="#0F172A" />
                </linearGradient>
                <linearGradient id="borderGrad" x1="50" y1="20" x2="350" y2="400" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60A5FA" />
                  <stop offset="0.5" stopColor="#3B82F6" />
                  <stop offset="1" stopColor="#1D4ED8" />
                </linearGradient>
                <filter id="glow" x="0" y="0" width="400" height="440" filterUnits="userSpaceOnUse">
                  <feGaussianBlur stdDeviation="16" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Background ambient glow */}
              <circle cx="200" cy="210" r="160" fill="url(#shieldGrad)" opacity="0.15" />

              {/* Shield Body */}
              <path
                d="M200 40 L340 90 V200 C340 290 275 370 200 395 C125 370 60 290 60 200 V90 L200 40 Z"
                fill="url(#shieldGrad)"
                stroke="url(#borderGrad)"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Inner Shield Contour */}
              <path
                d="M200 65 L315 105 V195 C315 270 260 338 200 360 C140 338 85 270 85 195 V105 L200 65 Z"
                fill="none"
                stroke="#60A5FA"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />

              {/* Central Verified Emblem */}
              <circle cx="200" cy="205" r="55" fill="#0F172A" stroke="#38BDF8" strokeWidth="2.5" />
              <path
                d="M178 206 L193 221 L224 190"
                stroke="#38BDF8"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Floating Protected Nodes */}
              {/* Node 1: Messages / Chat */}
              <g className="floating-node node-msg">
                <rect x="20" y="130" width="95" height="42" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                <text x="67" y="156" fill="#1E3A8A" fontSize="12" fontWeight="bold" textAnchor="middle">💬 {t.hero.nodeMsg}</text>
                <circle cx="115" cy="130" r="8" fill="#10B981" />
                <path d="M112 130 L114 132 L118 128" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Node 2: Payments / UPI */}
              <g className="floating-node node-payment">
                <rect x="285" y="125" width="95" height="42" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                <text x="332" y="151" fill="#1E3A8A" fontSize="12" fontWeight="bold" textAnchor="middle">₹ {t.hero.nodePayment}</text>
                <circle cx="380" cy="125" r="8" fill="#10B981" />
                <path d="M377 125 L379 127 L383 123" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Node 3: Links */}
              <g className="floating-node node-links">
                <rect x="20" y="275" width="95" height="42" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                <text x="67" y="301" fill="#1E3A8A" fontSize="12" fontWeight="bold" textAnchor="middle">🔗 {t.hero.nodeLinks}</text>
                <circle cx="115" cy="275" r="8" fill="#10B981" />
                <path d="M112 275 L114 277 L118 273" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Node 4: Credentials / Security */}
              <g className="floating-node node-creds">
                <rect x="285" y="275" width="95" height="42" rx="10" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
                <text x="332" y="301" fill="#1E3A8A" fontSize="12" fontWeight="bold" textAnchor="middle">🔐 {t.hero.nodeCreds}</text>
                <circle cx="380" cy="275" r="8" fill="#10B981" />
                <path d="M377 275 L379 277 L383 273" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Guarding Ray lines */}
              <line x1="110" y1="150" x2="160" y2="180" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="290" y1="145" x2="240" y2="180" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="108" y1="295" x2="160" y2="235" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <line x1="286" y1="295" x2="240" y2="235" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
