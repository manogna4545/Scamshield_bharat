export default function HowItWorks({ t }) {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="how-steps-grid">
        {t.howItWorks.steps.map((item) => (
          <div className="how-step-card" key={item.step}>
            <div className="step-number-tag">{item.step}</div>
            <h3 className="step-card-title">{item.title}</h3>
            <p className="step-card-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
