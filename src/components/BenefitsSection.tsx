
import { Cpu, Map, FileCheck2 } from 'lucide-react';
import EngineBenefitCard from './benefits/EngineBenefitCard';

const benefitCards = [
  {
    icon: <Cpu className="h-9 w-9 text-australis-indigo drop-shadow-sm" />,
    title: "Australis Processing Engine (APE)",
    subtitle: "AI-driven land suitability & viability scoring",
    bullets: [
      "Machine learning evaluates planning, environment, heritage, grid & financial aspects",
      "Incorporates historical planning outcomes, grid/infrastructure proximity, environmental & regulatory constraints",
      "Delivers developability scores for swift, confident site selection",
      "Integrates seamlessly with GIS & BI platforms (ArcGIS, QGIS, Tableau, PowerBI)",
    ]
  },
  {
    icon: <Map className="h-9 w-9 text-australis-aqua drop-shadow-sm" />,
    title: "Design Engine",
    subtitle: "Rapid early-stage buildability assessment",
    bullets: [
      "Estimates power capacity & evaluates all site constraints (spatial, topographic, regulatory)",
      "Integrates geospatial & engineering workflows, reducing reliance on costly design tools",
      "Highlights potential challenges before detailed design spend",
      "Exports to CAD, GIS, mapping & design platforms",
    ]
  },
  {
    icon: <FileCheck2 className="h-9 w-9 text-australis-indigo drop-shadow-sm" />,
    title: "Regulatory Compliance Engine",
    subtitle: "GenAI expert for evolving planning & consent",
    bullets: [
      "Synthesises regulatory, environmental, and heritage docs with latest legal changes",
      "Autonomous compliance checks mitigate manual review & risk exposure",
      "Proactive flagging of red/amber planning risks & next-step expert actions",
      "Automated reporting for regulatory evidence, due diligence & MCP integration",
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
                Agentic AI Engines: Full-Spectrum Due Diligence In One Place
              </span>
            </h2>
            <p className="text-australis-navy/70 mt-4 mb-6 max-w-2xl mx-auto">
              Australis brings together processing, design, and regulatory intelligence – automating feasibility and compliance with integrations for all your workflows.
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
