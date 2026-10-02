import AboutSection from "../components/AboutSection.jsx";

export default function About({ t }) {
  return (
    <div className="page-wrapper about-page animate-fade-in">
      <AboutSection t={t} />
    </div>
  );
}
