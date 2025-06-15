
import PricingCard from "@/components/PricingCard";
import { useNavigate } from "react-router-dom";

const tiers = [
  {
    name: "Explorer",
    price: "$0",
    description: "Ideal for individuals and small teams evaluating sites occasionally.",
    accent: "from-australis-aqua to-australis-indigo",
    features: [
      "Up to 5 site assessments /mo",
      "Core geospatial analytics",
      "Standard map overlays",
      "Basic reporting",
      "Email support",
    ],
    ctaText: "Start Free",
  },
  {
    name: "Professional",
    price: "$49",
    description: "Suited for consultants and growing teams needing more frequent analysis.",
    accent: "from-australis-indigo to-australis-aqua",
    features: [
      "Up to 50 site assessments /mo",
      "All core Explorer features",
      "Batch upload & prioritization",
      "Export advanced reports (PDF/CSV)",
      "Priority email support",
    ],
    recommended: true,
    ctaText: "Start Trial",
  },
  {
    name: "Enterprise",
    price: "$199",
    description: "Designed for organizations requiring high-volume workflows and integrations.",
    accent: "from-australis-navy to-australis-indigo",
    features: [
      "Unlimited site assessments",
      "Team collaboration features",
      "Regulatory & compliance reports",
      "API access",
      "Slack & Teams support",
    ],
    ctaText: "Contact Sales",
  },
  {
    name: "Enterprise Plus",
    price: "Contact Us",
    description: "Bespoke solutions, integration, and security for large enterprises.",
    accent: "from-australis-indigo to-australis-navy",
    features: [
      "Custom data integrations",
      "On-premise deployments",
      "Dedicated account manager",
      "Advanced compliance/SLAs",
      "Custom security requirements",
    ],
    ctaText: "Contact Sales",
  }
];

const Pricing = () => {
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
