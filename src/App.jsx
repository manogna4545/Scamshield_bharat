import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import { translations } from "./utils/translations.js";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Toast from "./components/Toast.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

// Pages
import Home from "./pages/Home.jsx";
import CheckMessage from "./pages/CheckMessage.jsx";
import ScamRadar from "./pages/ScamRadar.jsx";
import SafetyChecklist from "./pages/SafetyChecklist.jsx";
import RedFlagQuiz from "./pages/RedFlagQuiz.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import About from "./pages/About.jsx";

function AppContent() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("scamshield_lang") || "English";
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("scamshield_theme") || "light";
  });
  const [accessibilityMode, setAccessibilityMode] = useState(() => {
    return localStorage.getItem("scamshield_access") || "normal";
  });

  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [lastAnalyzedMessage, setLastAnalyzedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const scanningTimerRef = useRef(null);
  const t = translations[language] || translations.English;

  // Persist language selection
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem("scamshield_lang", newLang);
  };

  // Sync Theme & Accessibility classes on root
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-access", accessibilityMode);
    localStorage.setItem("scamshield_theme", theme);
    localStorage.setItem("scamshield_access", accessibilityMode);
  }, [theme, accessibilityMode]);

  const showToast = (toastMessage, type = "info") => {
    setToast({ message: toastMessage, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleChangeAccessibility = (mode) => {
    setAccessibilityMode(mode);
  };

  const performAnalysis = async (textToAnalyze) => {
    const text = String(textToAnalyze || "").trim();
    if (!text) {
      setError(t.analyzer.errors.empty);
      return;
    }

    setError("");
    setResult(null);
    setIsLoading(true);
    setScanningStep(0);
    setLastAnalyzedMessage(text);

    // Multi-step scanning progress simulation
    scanningTimerRef.current = setInterval(() => {
      setScanningStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 900);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok && !data?.risk_level) {
        throw new Error(data?.error || t.analyzer.errors.connectError);
      }

      setResult(data);
      showToast(
        language === "Hindi"
          ? "सुरक्षा विश्लेषण पूर्ण हुआ!"
          : language === "Telugu"
          ? "భద్రతా విశ్లేషణ పూర్తయింది!"
          : "Safety analysis completed!",
        "success"
      );

      setTimeout(() => {
        document.getElementById("analysis-result")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 250);
    } catch (err) {
      console.error("Analysis failure details:", err);
      setError(t.analyzer.errors.connectError);
      showToast(
        language === "Hindi"
          ? "विश्लेषण पूरा करने में असमर्थ। कृपया बैकएंड कनेक्शन जांचें।"
          : "Unable to complete analysis. Please verify backend connection.",
        "error"
      );
    } finally {
      clearInterval(scanningTimerRef.current);
      setIsLoading(false);
    }
  };

  const handleAnalyzeClick = () => {
    performAnalysis(message);
  };

  const handleClear = () => {
    setMessage("");
    setResult(null);
    setError("");
    setLastAnalyzedMessage("");
  };

  const handleAnalyzeSample = (sampleText) => {
    setMessage(sampleText);
    setError("");
    setResult(null);
    setTimeout(() => {
      performAnalysis(sampleText);
    }, 400);
  };

  return (
    <div className={`app-root theme-${theme} mode-${accessibilityMode}`}>
      <ScrollToTop />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        accessibilityMode={accessibilityMode}
        onChangeAccessibility={handleChangeAccessibility}
        t={t}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                t={t}
                onAnalyzeSample={handleAnalyzeSample}
                onShowToast={showToast}
              />
            }
          />

          <Route
            path="/check-message"
            element={
              <CheckMessage
                message={message}
                setMessage={setMessage}
                language={language}
                result={result}
                lastAnalyzedMessage={lastAnalyzedMessage}
                isLoading={isLoading}
                scanningStep={scanningStep}
                error={error}
                setError={setError}
                onAnalyze={handleAnalyzeClick}
                onClear={handleClear}
                onShowToast={showToast}
                t={t}
              />
            }
          />

          <Route path="/scam-radar" element={<ScamRadar t={t} />} />

          <Route
            path="/safety-checklist"
            element={<SafetyChecklist t={t} onShowToast={showToast} />}
          />

          <Route path="/red-flag-quiz" element={<RedFlagQuiz t={t} />} />

          <Route path="/how-it-works" element={<HowItWorks t={t} />} />

          <Route path="/about" element={<About t={t} />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer t={t} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}