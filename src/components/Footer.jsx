import { Link } from "react-router-dom";

export default function Footer({ t }) {
  return (
    <footer className="footer-wrapper" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <div className="footer-logo">
              <span className="footer-shield-icon">🛡️</span>
              <span className="footer-logo-title">SCAMSHIELD <span>BHARAT</span></span>
            </div>
            <p className="footer-tagline">"{t.footer.tagline}"</p>
            <p className="footer-rights">{t.footer.rights}</p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">{t.footer.navHeading}</h4>
            <ul className="footer-links-list">
              <li>
                <Link to="/">{t.nav.home}</Link>
              </li>
              <li>
                <Link to="/check-message">{t.nav.checkMessage}</Link>
              </li>
              <li>
                <Link to="/scam-radar">{t.nav.radar}</Link>
              </li>
              <li>
                <Link to="/safety-checklist">{t.nav.checklist}</Link>
              </li>
              <li>
                <Link to="/red-flag-quiz">{t.nav.quiz}</Link>
              </li>
              <li>
                <Link to="/how-it-works">{t.nav.howItWorks}</Link>
              </li>
              <li>
                <Link to="/about">{t.nav.about}</Link>
              </li>
            </ul>
          </div>

          <div className="footer-disclaimer-col">
            <h4 className="footer-heading">{t.footer.regHeading}</h4>
            <p className="footer-disclaimer-text">{t.footer.disclaimer}</p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p>{t.footer.bottomCopyright}</p>
          <p>{t.footer.bottomHackathon}</p>
        </div>
      </div>
    </footer>
  );
}
