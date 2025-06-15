
import PricingCard from "@/components/PricingCard";

const tiers = [
  {
    name: "Explorer",
    price: "$0",
    description: "For individuals and startups beginning their renewable journey.",
    accent: "from-aquamarine to-neon_blue",
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
    accent: "from-neon_blue to-aquamarine",
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
    accent: "from-delft_blue to-neon_blue",
    features: [
      "Unlimited site assessments",
      "Team management & SSO",
      "Regulatory & compliance reports",
      "API access",
      "Integration support (Slack/Teams)",
      "Dedicated success manager"
    ],
    ctaText: "Contact Sales",
    contact: true
  },
  {
    name: "Enterprise Plus",
    price: "Contact Us",
    description: "Custom solutions for large organizations with bespoke needs.",
    accent: "from-neon_blue to-delft_blue",
    features: [
      "Custom platform integration",
      "On-premise deployments",
      "Dedicated account manager",
      "Advanced compliance/SLAs",
      "Tailored data models & analytics"
    ],
    ctaText: "Contact Sales",
    contact: true
  }
];

const handleContact = () => {
  const element = document.getElementById("expert-panel");
  if(element) {
    element.scrollIntoView({behavior: "smooth"});
  }
};

const PricingSection = () => (
  <section id="pricing" className="py-24 min-h-[90vh] bg-gradient-to-br from-azure_web via-anti-flash_white to-anti-flash_white relative overflow-hidden">
    {/* Elevated blurred background accents */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-aquamarine/30 to-transparent rounded-full blur-3xl"></div>
    <div className="absolute top-16 right-12 w-60 h-60 bg-neon_blue/10 rounded-full blur-2xl"></div>
    <div className="container-custom relative z-10">
      <div className="text-center mb-16">
        <div className="inline-block px-7 py-4 bg-white/50 border border-anti-flash_white/80 rounded-3xl shadow-xl backdrop-blur-2xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-delft_blue mb-2">Pricing</h2>
          <p className="text-lg max-w-2xl mx-auto text-delft_blue/70">
            Flexible plans for every stage of renewable project development.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 mt-8">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.name}
            name={tier.name}
            price={tier.price}
            description={tier.description}
            features={tier.features}
            accent={tier.accent}
            recommended={tier.recommended}
            onContact={tier.contact ? handleContact : undefined}
            ctaText={tier.ctaText}
          />
        ))}
      </div>
      <div className="text-center mt-16 text-delft_blue/60">
        For detailed usage info, integrations, or to discuss custom enterprise solutions,{" "}
        <button 
          className="inline underline text-neon_blue hover:text-aquamarine font-medium transition-colors"
          onClick={handleContact}
        >
          contact our team
        </button>
        .
      </div>
    </div>
  </section>
);

export default PricingSection;

