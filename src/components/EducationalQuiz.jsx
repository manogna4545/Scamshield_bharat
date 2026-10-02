import { useState } from "react";

export default function EducationalQuiz({ t }) {
  const questions = t.quiz.questions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // Prevent changing after answer
    setSelectedOption(idx);
    if (currentQ?.options[idx]?.correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <section className="quiz-section" id="quiz">
      <div className="quiz-card-box">
        {!isFinished && currentQ ? (
          <div className="quiz-active-state">
            {/* Header tracker */}
            <div className="quiz-tracker-bar">
              <span className="quiz-step-count">
                {t.quiz.questionPrefix} {currentIdx + 1} {t.quiz.of} {questions.length}
              </span>
              <span className="quiz-live-score">{t.quiz.liveScoreLabel} {score}</span>
            </div>

            {/* Scenario Box */}
            <div className="quiz-scenario-box">
              <span className="scenario-label">{t.quiz.scenarioLabel}</span>
              <p className="scenario-text">"{currentQ.scenario}"</p>
            </div>

            <h3 className="quiz-question-prompt">{currentQ.question}</h3>

            {/* Options */}
            <div className="quiz-options-list">
              {currentQ.options.map((opt, optIdx) => {
                let btnClass = "quiz-option-btn";
                if (selectedOption !== null) {
                  if (opt.correct) btnClass += " opt-correct";
                  else if (selectedOption === optIdx) btnClass += " opt-wrong";
                  else btnClass += " opt-muted";
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    className={btnClass}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={selectedOption !== null}
                  >
                    <span className="opt-letter">
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className="opt-text">{opt.text}</span>
                    {selectedOption !== null && opt.correct && (
                      <span className="opt-badge-tag correct-tag">{t.quiz.correctTag}</span>
                    )}
                    {selectedOption === optIdx && !opt.correct && (
                      <span className="opt-badge-tag wrong-tag">{t.quiz.wrongTag}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation reveal */}
            {selectedOption !== null && (
              <div className="quiz-explanation-box animate-fade-in">
                <div className="explanation-header">
                  <span>{t.quiz.insightLabel}</span>
                </div>
                <p className="explanation-text">{currentQ.explanation}</p>
                <button
                  type="button"
                  className="primary-btn quiz-next-btn"
                  onClick={handleNext}
                >
                  {currentIdx + 1 < questions.length ? t.quiz.nextBtn : t.quiz.finalBtn}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="quiz-completed-state animate-fade-in">
            <span className="trophy-icon">🏆</span>
            <h3 className="completed-title">{t.quiz.scoreTitle}</h3>
            <p className="completed-text">
              {t.quiz.scoreMsg} <strong>{score}</strong> {t.quiz.of} {questions.length} {t.quiz.scoreUnit}
            </p>
            <p className="completed-subtext">
              {t.quiz.summaryMsg}
            </p>
            <button
              type="button"
              className="primary-btn restart-btn"
              onClick={handleRestart}
            >
              🔄 {t.quiz.playAgainBtn}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
