import EducationalQuiz from "../components/EducationalQuiz.jsx";

export default function RedFlagQuiz({ t }) {
  return (
    <div className="page-wrapper quiz-page animate-fade-in">
      <div className="page-intro-header">
        <span className="page-pill">{t.quiz.pagePill}</span>
        <h1 className="page-main-title">{t.quiz.heading}</h1>
        <p className="page-main-desc">{t.quiz.subheading}</p>
      </div>

      <EducationalQuiz t={t} />
    </div>
  );
}
