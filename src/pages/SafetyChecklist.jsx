import Checklist from "../components/Checklist.jsx";
import FamilySafety from "../components/FamilySafety.jsx";

export default function SafetyChecklist({ t, onShowToast }) {
  return (
    <div className="page-wrapper checklist-page animate-fade-in">
      <div className="page-intro-header">
        <span className="page-pill">{t.checklist.pagePill}</span>
        <h1 className="page-main-title">{t.checklist.heading}</h1>
        <p className="page-main-desc">{t.checklist.subheading}</p>
      </div>

      {/* Interactive 7-point checklist */}
      <Checklist t={t} onShowToast={onShowToast} />

      {/* Family Safety Mode */}
      <FamilySafety t={t} onShowToast={onShowToast} />
    </div>
  );
}
