
import PricingCard from "@/components/PricingCard";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const tiers = [
  {
    name: "Explorer",
    price: "$0",
    description: "For individuals and startups beginning their renewable journey.",
    accent: "from-australis-aqua to-australis-indigo",
    features: [
      "10 site assessments per month",
      "Core geospatial analytics",
      "Standard map overlays",
      "Basic PDF reporting",
      "Community support"
    ],
    ctaText: "Start Free",
  },
  {
    name: "Professional",
    price: "$59",
    description: "Ideal for growing teams or consultants who need advanced tools.",
    accent: "from-australis-indigo to-australis-aqua",
    features: [
      "100 site assessments per month",
      "All Explorer features",
      "Batch upload & prioritization",
      "CSV/PDF export & analytics",
      "Collaborative workspace",
      "Priority email support"
    ],
    recommended: true,
    ctaText: "Start Trial",
  },
  {
    name: "Enterprise",
    price: "$249",
    description: "For teams requiring high capacity, integration and advanced security.",
    accent: "from-australis-navy to-australis-indigo",
    features: [
      "Unlimited site assessments",
      "Team management & SSO",
      "Regulatory & compliance reports",
      "API access",
      "Integration support (Slack/Teams)",
      "Dedicated success manager"
    ],
    ctaText: "Contact Sales",
  },
  {
    name: "Enterprise Plus",
    price: "Contact Us",
    description: "Custom solutions for large organizations with bespoke needs.",
    accent: "from-australis-indigo to-australis-navy",
    features: [
      "Custom platform integration",
      "On-premise deployments",
      "Dedicated account manager",
      "Advanced compliance/SLAs",
      "Tailored data models & analytics"
    ],
    ctaText: "Contact Sales",
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleContact = () => {
    const element = document.getElementById("expert-panel");
    if(element) {
      element.scrollIntoView({behavior: "smooth"});
    }
  };

  return (
    <section className="py-24 min-h-screen bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
      {/* Elevated blurred background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-australis-aqua/40 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-16 right-12 w-60 h-60 bg-gradient-to-xl from-white/20 to-australis-indigo/10 rounded-full blur-2xl"></div>
      <div className="container-custom relative z-10">
        <div className="flex items-center mb-6">
          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/60 backdrop-blur hover:bg-white/80 transition-colors shadow border border-white/30"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={20} className="text-australis-navy" />
            <span className="text-australis-navy font-medium text-base">Back</span>
          </button>
        </div>
        <div className="text-center mb-16">
          <div className="inline-block px-7 py-4 bg-white/50 border border-white/20 rounded-3xl shadow-xl backdrop-blur-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-australis-navy mb-2">Pricing</h1>
            <p className="text-lg max-w-2xl mx-auto text-australis-navy/70">
              Flexible plans for every stage of renewable project development.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 mt-8">
          {tiers.map((tier, idx) => (
            <PricingCard
              key={tier.name}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              accent={tier.accent}
              recommended={tier.recommended}
              onContact={
                tier.name === "Enterprise" || tier.name === "Enterprise Plus"
                  ? handleContact
                  : undefined
              }
              ctaText={tier.ctaText}
            />
          ))}
        </div>
        <div className="text-center mt-16 text-australis-navy/60">
          For detailed usage info, integrations, or to discuss custom enterprise solutions,{" "}
          <button 
            className="inline underline text-australis-indigo hover:text-australis-aqua font-medium transition-colors"
            onClick={handleContact}
          >
            contact our team
          </button>
          .
        </div>
      </div>
    </section>
  );
};

export default Pricing;
