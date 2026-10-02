import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const languages = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "हिन्दी" },
  { value: "Telugu", label: "తెలుగు" },
  { value: "Tamil", label: "தமிழ்" },
  { value: "Bengali", label: "বাংলা" },
  { value: "Marathi", label: "मराठी" },
];

export default function Navbar({
  language,
  onLanguageChange,
  theme,
  onToggleTheme,
  accessibilityMode,
  onChangeAccessibility,
  t,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper sticky-top">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand */}
        <Link to="/" className="logo" onClick={closeMobileMenu}>
          <div className="logo-shield">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2Z"
                fill="#1D4ED8"
                stroke="#3B82F6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 12L11 14L15 9"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-brand">SCAMSHIELD <span>BHARAT</span></span>
            <span className="logo-sub">{t.nav.platformLabel}</span>
          </div>
        </Link>

        {/* Desktop Navigation Buttons */}
        <div className="nav-buttons-list desktop-only">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>{t.nav.home}</span>
          </NavLink>

          {/* Check Message */}
          <NavLink
            to="/check-message"
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span>{t.nav.checkMessage}</span>
          </NavLink>

          {/* Scam Radar */}
          <NavLink
            to="/scam-radar"
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="6"></circle>
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
            </svg>
            <span>{t.nav.radar}</span>
          </NavLink>

          {/* Safety Checklist */}
          <NavLink
            to="/safety-checklist"
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4"></path>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span>{t.nav.checklist}</span>
          </NavLink>

          {/* Red Flag Quiz */}
          <NavLink
            to="/red-flag-quiz"
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
              <line x1="4" y1="22" x2="4" y2="15"></line>
            </svg>
            <span>{t.nav.quiz}</span>
          </NavLink>

          {/* How It Works */}
          <NavLink
            to="/how-it-works"
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
            <span>{t.nav.howItWorks}</span>
          </NavLink>

          {/* About */}
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
          >
            <svg className="nav-btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>{t.nav.about}</span>
          </NavLink>
        </div>

        {/* Right Controls */}
        <div className="nav-controls desktop-only">
          {/* Language Selector */}
          <div className="select-container" title="Select Language">
            <select
              className="control-select language-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              aria-label="Select website and analysis language"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Display / Accessibility Selector */}
          <div className="select-container" title="Display Mode">
            <select
              className="control-select access-select"
              value={accessibilityMode}
              onChange={(e) => onChangeAccessibility(e.target.value)}
              aria-label="Accessibility mode"
            >
              <option value="normal">{t.nav.accessNormal}</option>
              <option value="large-text">{t.nav.accessLarge}</option>
              <option value="high-contrast">{t.nav.accessContrast}</option>
            </select>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            className="icon-toggle-btn theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* Primary CTA */}
          <button
            type="button"
            className="nav-cta-btn"
            onClick={() => navigate("/check-message")}
          >
            {t.nav.cta}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer mobile-only animate-slide-down">
          <div className="mobile-nav-buttons-list">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span>{t.nav.home}</span>
            </NavLink>

            <NavLink
              to="/check-message"
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>{t.nav.checkMessage}</span>
            </NavLink>

            <NavLink
              to="/scam-radar"
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
              </svg>
              <span>{t.nav.radar}</span>
            </NavLink>

            <NavLink
              to="/safety-checklist"
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span>{t.nav.checklist}</span>
            </NavLink>

            <NavLink
              to="/red-flag-quiz"
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
              <span>{t.nav.quiz}</span>
            </NavLink>

            <NavLink
              to="/how-it-works"
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              <span>{t.nav.howItWorks}</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) => `mobile-nav-btn ${isActive ? "mobile-nav-btn-active" : ""}`}
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <span>{t.nav.about}</span>
            </NavLink>
          </div>

          <div className="mobile-drawer-controls">
            <div className="mobile-select-group">
              <label htmlFor="mobile-language">{t.nav.languageLabel}</label>
              <select
                id="mobile-language"
                className="control-select"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mobile-select-group">
              <label htmlFor="mobile-access">{t.nav.displayLabel}</label>
              <select
                id="mobile-access"
                className="control-select"
                value={accessibilityMode}
                onChange={(e) => onChangeAccessibility(e.target.value)}
              >
                <option value="normal">{t.nav.accessNormal}</option>
                <option value="large-text">{t.nav.accessLarge}</option>
                <option value="high-contrast">{t.nav.accessContrast}</option>
              </select>
            </div>

            <div className="mobile-action-row">
              <button
                type="button"
                className="theme-toggle-btn secondary-btn"
                onClick={onToggleTheme}
              >
                {theme === "dark" ? `☀️ ${t.nav.themeLight}` : `🌙 ${t.nav.themeDark}`}
              </button>

              <button
                type="button"
                className="primary-btn mobile-cta-btn"
                onClick={() => {
                  closeMobileMenu();
                  navigate("/check-message");
                }}
              >
                🛡️ {t.nav.cta}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
