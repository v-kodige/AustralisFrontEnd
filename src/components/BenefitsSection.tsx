import EngineBenefitCard from './benefits/EngineBenefitCard';

// Make sure each card uses ONLY the allowed iconAccent literal values:
const benefitCards = [{
  iconAccent: "australis-indigo" as const,
  title: "Find the Best Locations, Instantly",
  subtitle: "Pinpoint truly viable sites in less time.",
  bullets: ["Surface land that meets your exact technical, grid, and policy needs", "See sustainability, planning, and connection obstacles before you commit"]
}, {
  iconAccent: "australis-aqua" as const,
  title: "Maximise Feasibility Early",
  subtitle: "Know what you can build—without expensive custom studies.",
  bullets: ["Estimate buildability and power yield based on site realities", "Reveal project risks pre-investment, avoiding costly surprises"]
}, {
  iconAccent: "australis-indigo" as const,
  title: "Stay Secure with Built-In Compliance",
  subtitle: "Remove regulatory guesswork from your workflow.",
  bullets: ["Check rules and constraints with up-to-date AI analysis", "Export ready-made evidence for consultation or investors"]
}];
const BenefitsSection = () => {
  return <section id="benefits" className="py-24 bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-australis-aqua/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-australis-indigo/15 to-transparent rounded-full blur-3xl"></div>
      </div>
      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-2xl shadow-australis-navy/5 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-australis-navy drop-shadow-sm">
              <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent">Australis will reduce the time taken for early-stage site assessments by 95%</span>
            </h2>
            <p className="text-australis-navy/70 mt-4 mb-6 max-w-2xl mx-auto">
              Australis pinpoints optimal locations, automates entire feasibility and compliance processes, and produces ready-to-use evidence for consults, permits or investments.
            </p>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-australis-indigo to-australis-aqua rounded-full shadow-sm"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 animate-fade-in">
          {benefitCards.map((card, idx) => <EngineBenefitCard key={idx} {...card} />)}
        </div>
      </div>
    </section>;
};
export default BenefitsSection;