import { useMemo } from "react";
import { extractSuspiciousSignals } from "../utils/signalDetector.js";

const riskLevelOrder = ["LOW", "CAUTION", "MEDIUM", "HIGH"];

function getWarningIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("return") || t.includes("profit") || t.includes("मुनाफा") || t.includes("లాభం") || t.includes("परतावा") || t.includes("லாபம்") || t.includes("লাভ")) return "💰";
  if (t.includes("urgent") || t.includes("pressure") || t.includes("जल्दबाजी") || t.includes("ఒత్తిడి") || t.includes("तातडी") || t.includes("அவசரம்") || t.includes("জরুরি")) return "⏱️";
  if (t.includes("payment") || t.includes("upi") || t.includes("transfer") || t.includes("भुगतान") || t.includes("చెల్లింపు") || t.includes("பணம்") || t.includes("পেমেন্ট") || t.includes("पैसे")) return "💳";
  if (t.includes("otp") || t.includes("pin") || t.includes("password") || t.includes("credential") || t.includes("पिन") || t.includes("பாஸ்வேர்ட்") || t.includes("পাসওয়ার্ড")) return "🔐";
  if (t.includes("link") || t.includes("telegram") || t.includes("चैनल") || t.includes("లింక్") || t.includes("இணைப்பு") || t.includes("লিংক")) return "🔗";
  if (t.includes("authority") || t.includes("impersonation") || t.includes("advisor") || t.includes("अधिकारी") || t.includes("అధికారి") || t.includes("அதிகாரி")) return "👤";
  return "⚠️";
}

function getSpeechLocale(language) {
  const locales = {
    English: "en-IN",
    Hindi: "hi-IN",
    Telugu: "te-IN",
    Tamil: "ta-IN",
    Bengali: "bn-IN",
    Marathi: "mr-IN",
  };
  return locales[language] || "en-IN";
}

export default function AnalysisResult({
  result,
  rawMessage,
  language,
  onReset,
  onShowToast,
  t,
}) {
  // Extract non-destructive signals from original message
  const detectedSignals = useMemo(() => {
    return extractSuspiciousSignals(rawMessage, language);
  }, [rawMessage, language]);

  if (!result) return null;

  const currentRisk = (result.risk_level || result.riskLevel || "CAUTION").toUpperCase();
  const displayRiskBadge = t?.result?.riskBadges?.[currentRisk] || currentRisk;
  const summary = result.summary || result.riskDescription || "";
  const warningSigns = result.warning_signs || result.detected || [];
  const safeActions = result.safe_actions || result.safeActions || [];
  const uncertainty = result.uncertainty || t.result.defaultUncertainty;

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) {
      onShowToast(language === "Hindi" ? "इस ब्राउज़र में स्पीच की सुविधा उपलब्ध नहीं है।" : "Speech synthesis is not supported in this browser.", "info");
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = `${t.result.assessmentHeading}: ${displayRiskBadge}. ${summary}. ${safeActions.slice(0, 2).join(". ")}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = getSpeechLocale(language);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
    onShowToast(t.result.reportAudioToast, "info");
  };

  const handleCopySummary = async () => {
    try {
      const summaryText = `${t.result.reportHeader}\n\n${t.result.reportRisk}: ${displayRiskBadge}\n${t.result.reportSummary}: ${summary}\n\n${t.result.reportWarnings}:\n${warningSigns.map((w, i) => `${i + 1}. ${w.title || w.name}: ${w.explanation}`).join("\n")}\n\n${t.result.reportActions}:\n${safeActions.map((a) => `• ${a}`).join("\n")}\n\n${t.result.reportNotice}: ${uncertainty}\n\n${t.footer.tagline}`;

      await navigator.clipboard.writeText(summaryText);
      onShowToast(t.result.copiedNotice, "success");
    } catch {
      onShowToast(t.result.copyErrorNotice, "error");
    }
  };

  return (
    <section className="analysis-result-container" id="analysis-result" aria-live="polite">
      <div className={`result-main-card border-${currentRisk.toLowerCase()}`}>
        {/* Top Assessment Header */}
        <div className={`result-top-banner bg-${currentRisk.toLowerCase()}`}>
          <div className="banner-info">
            <span className="assessment-label">{t.result.assessmentHeading}</span>
            <h3 className="risk-level-headline">
              {currentRisk === "HIGH" && "🔴 "}
              {currentRisk === "MEDIUM" && "🟠 "}
              {currentRisk === "CAUTION" && "🟡 "}
              {currentRisk === "LOW" && "🟢 "}
              {t.result.riskTitles[currentRisk] || displayRiskBadge}
            </h3>
          </div>

          <div className="banner-badge-col">
            <div className={`risk-pill-badge badge-${currentRisk.toLowerCase()}`}>
              {displayRiskBadge}
            </div>
            <span className="ai-verification-tag">{t.result.aiBadge}</span>
          </div>
        </div>

        {/* Calibrated Risk Meter (No fake percentages) */}
        <div className="risk-meter-section">
          <div className="meter-track-container" aria-label={`Calibrated Risk Level: ${displayRiskBadge}`}>
            {riskLevelOrder.map((level, idx) => {
              const isActive = level === currentRisk;
              const isFilled = riskLevelOrder.indexOf(currentRisk) >= idx;
              return (
                <div
                  key={level}
                  className={`meter-segment seg-${level.toLowerCase()} ${isFilled ? "filled" : ""} ${isActive ? "active-segment" : ""}`}
                >
                  <span className="meter-label">{t.result.meterLabels[idx] || level}</span>
                  {isActive && <div className="meter-pointer-pin" aria-hidden="true">▼</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Card */}
        <div className="result-summary-block">
          <p className="summary-paragraph">{summary}</p>
        </div>

        {/* Quick Result Action Buttons */}
        <div className="result-toolbar">
          <button
            type="button"
            className="secondary-btn result-action-btn"
            onClick={handleSpeak}
            title="Read results aloud"
          >
            {t.result.listenBtn}
          </button>

          <button
            type="button"
            className="secondary-btn result-action-btn"
            onClick={handleCopySummary}
            title="Copy formatted safety report"
          >
            {t.result.copySummaryBtn}
          </button>

          <button
            type="button"
            className="secondary-btn result-action-btn"
            onClick={onReset}
          >
            🔄 {t.result.analyzeAnother}
          </button>
        </div>

        {/* Warning Signs Detected Cards */}
        {warningSigns.length > 0 && (
          <div className="result-section warning-signs-section">
            <h4 className="result-section-title">
              ⚠️ {t.result.warningSignsHeading}
            </h4>
            <div className="warning-cards-grid">
              {warningSigns.map((item, index) => {
                const title = item.title || item.name || "Warning Sign";
                const explanation = item.explanation || "";
                const icon = getWarningIcon(title);
                return (
                  <div className="warning-sign-card" key={index}>
                    <div className="warning-card-header">
                      <span className="warning-index-circle">{index + 1}</span>
                      <span className="warning-card-icon" aria-hidden="true">{icon}</span>
                      <strong className="warning-card-title">{title}</strong>
                    </div>
                    <p className="warning-card-text">{explanation}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Why did ScamShield flag this? (Message Breakdown) */}
        {detectedSignals.length > 0 && (
          <div className="result-section message-breakdown-section">
            <h4 className="result-section-title">
              🔍 {t.result.breakdownHeading}
            </h4>
            <p className="breakdown-subtext">{t.result.breakdownDesc}</p>
            <div className="detected-signals-list">
              {detectedSignals.map((sig, idx) => (
                <div className="signal-chip-card" key={idx}>
                  <div className="signal-chip-top">
                    <span className="potential-signal-tag">{t.result.potentialSignalTag}</span>
                    <span className="signal-phrase">"{sig.phrase}"</span>
                  </div>
                  <div className="signal-reason">
                    <strong>{sig.category}:</strong> {sig.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* "What You Can Do" Safety Panel */}
        {safeActions.length > 0 && (
          <div className="result-section safe-actions-panel">
            <h4 className="result-section-title">{t.result.safeActionsHeading}</h4>
            <ul className="safe-actions-list">
              {safeActions.map((action, idx) => (
                <li key={idx} className="safe-action-item">
                  <span className="safe-check-icon">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Uncertainty Disclaimer */}
        <div className="uncertainty-callout">
          <div className="uncertainty-icon">ℹ️</div>
          <div className="uncertainty-body">
            <strong>{t.result.uncertaintyHeading}:</strong>
            <p>{uncertainty}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
