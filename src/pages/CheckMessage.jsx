import Analyzer from "../components/Analyzer.jsx";
import AnalysisResult from "../components/AnalysisResult.jsx";

export default function CheckMessage({
  message,
  setMessage,
  language,
  result,
  lastAnalyzedMessage,
  isLoading,
  scanningStep,
  error,
  setError,
  onAnalyze,
  onClear,
  onShowToast,
  t,
}) {
  return (
    <div className="page-wrapper check-message-page animate-fade-in">
      <div className="page-intro-header">
        <span className="page-pill">{t.analyzer.pagePill}</span>
        <h1 className="page-main-title">{t.analyzer.heading}</h1>
        <p className="page-main-desc">{t.analyzer.subheading}</p>
      </div>

      <Analyzer
        message={message}
        setMessage={setMessage}
        language={language}
        isLoading={isLoading}
        scanningStep={scanningStep}
        error={error}
        setError={setError}
        onAnalyze={onAnalyze}
        onClear={onClear}
        t={t}
      />

      {result && (
        <AnalysisResult
          result={result}
          rawMessage={lastAnalyzedMessage || message}
          language={language}
          onReset={onClear}
          onShowToast={onShowToast}
          t={t}
        />
      )}
    </div>
  );
}
