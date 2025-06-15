
import EngineBenefitCard from './benefits/EngineBenefitCard';

const benefitCards = [
  {
    iconAccent: "australis-indigo",
    title: "Smarter Site Selection",
    subtitle: "Instantly discover locations with the highest chance of success.",
    bullets: [
      "Analyses millions of datapoints to match land to your project needs",
      "Filters out problematic sites based on regulatory and physical constraints",
      "Ranks sites by true developability, saving months of manual review"
    ]
  },
  {
    iconAccent: "australis-aqua",
    title: "Clear, Actionable Feasibility",
    subtitle: "Know what’s possible before investing in surveys or designs.",
    bullets: [
      "Estimates buildability, power capacity, and technical limits for your project",
      "Highlights risks—grid, financial, consent—before you spend",
      "Ensures you see potential and pitfalls at a glance"
    ]
  },
  {
    iconAccent: "australis-indigo",
    title: "Automatic Compliance & Evidence",
    subtitle: "Stay ahead of changing rules and prove due diligence.",
    bullets: [
      "Checks your site against evolving planning and environmental regulations",
      "Surfaces compliance issues with tailored recommendations",
      "Generates reports ready for consultation, approval, or investment"
    ]
  }
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-australis-aqua/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-australis-indigo/15 to-transparent rounded-full blur-3xl"></div>
      </div>
      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-2xl shadow-australis-navy/5 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-australis-navy drop-shadow-sm">
              <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent">
                Select, assess and report on the best sites—seamlessly and intelligently.
              </span>
            </h2>
            <p className="text-australis-navy/70 mt-4 mb-6 max-w-2xl mx-auto">
              Australis pinpoints optimal locations, automates entire feasibility and compliance processes, and produces ready-to-use evidence for consults, permits or investments.
            </p>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-australis-indigo to-australis-aqua rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 animate-fade-in">
          {benefitCards.map((card, idx) => (
            <EngineBenefitCard key={idx} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

