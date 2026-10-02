import { useEffect, useRef, useState } from "react";

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

export default function Analyzer({
  message,
  setMessage,
  language,
  isLoading,
  scanningStep,
  error,
  setError,
  onAnalyze,
  onClear,
  t,
}) {
  const [isListening, setIsListening] = useState(false);
  const speechSupported = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

    if (!SpeechRecognition) {
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLocale(language);
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((entry) => entry[0].transcript)
        .join(" ");
      setMessage((prev) => (prev ? `${prev} ${transcript}`.trim() : transcript));
    };

    recognition.onerror = () => {
      setError(t.analyzer.errors.speechDenied);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Safe cleanup
      }
    };
  }, [language, setMessage, setError, t]);

  const handleVoiceToggle = () => {
    if (!speechSupported || !recognitionRef.current) {
      setError(t.analyzer.errors.speechUnsupported);
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError("");
      recognitionRef.current.lang = getSpeechLocale(language);
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSampleClick = (sampleText) => {
    setMessage(sampleText);
    if (error) setError("");
    textareaRef.current?.focus();
  };

  const currentSamples = t?.analyzer?.samples || [];

  return (
    <section className="analyzer-section" id="analyzer">
      <div className="analyzer-card-box">
        {/* Quick Sample Selector Bar */}
        {currentSamples.length > 0 && (
          <div className="sample-chips-bar">
            <span className="sample-chips-label">{t.analyzer.quickSamplesLabel}</span>
            <div className="sample-chips-list">
              {currentSamples.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-chip-btn"
                  onClick={() => handleSampleClick(sample)}
                  disabled={isLoading}
                >
                  {t.analyzer.sampleBtnPrefix} {idx + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Textarea Toolbar */}
        <div className="textarea-toolbar">
          <label htmlFor="message-textarea" className="textarea-label">
            {t.analyzer.label}
          </label>
          <span className="char-badge">
            {message.length} / 2000
          </span>
        </div>

        {/* Text Input Area */}
        <textarea
          id="message-textarea"
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (error) setError("");
          }}
          placeholder={t.analyzer.placeholder}
          maxLength={2000}
          rows={6}
          disabled={isLoading}
          className="analyzer-textarea"
          aria-describedby="char-count"
        />

        {/* Actions Bar */}
        <div className="analyzer-actions-bar">
          <div className="privacy-badge">
            <span>🛡️</span>
            <small>{t.analyzer.privacyFootnote}</small>
          </div>

          <div className="action-buttons-group">
            {speechSupported && (
              <button
                type="button"
                className={`mic-btn ${isListening ? "mic-active" : ""}`}
                onClick={handleVoiceToggle}
                disabled={isLoading}
                title="Dictate message using microphone"
              >
                {isListening ? t.analyzer.micListening : t.analyzer.micBtn}
              </button>
            )}

            <button
              type="button"
              className="clear-btn"
              onClick={onClear}
              disabled={isLoading || !message}
            >
              {t.analyzer.clearBtn}
            </button>

            <button
              type="button"
              className="primary-btn analyze-submit-btn"
              onClick={onAnalyze}
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <span className="btn-spinner-wrap">
                  <span className="spinner"></span>
                  {t.analyzer.analyzingBtn}
                </span>
              ) : (
                `🔍 ${t.analyzer.analyzeBtn}`
              )}
            </button>
          </div>
        </div>

        {/* Multi-stage scanning status */}
        {isLoading && (
          <div className="scanning-container" aria-live="polite">
            <div className="scanning-progress-track">
              <div
                className="scanning-progress-bar"
                style={{ width: `${((scanningStep + 1) / 3) * 100}%` }}
              ></div>
            </div>
            <div className="scanning-text-wrap">
              <span className="scanning-radar-pulse"></span>
              <span className="scanning-message">{t.analyzer.stages[scanningStep]}</span>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="analyzer-error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>
    </section>
  );
}
