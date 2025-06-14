
import { Clock, Shield, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const BenefitsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-australis-indigo" />,
      title: "Faster, Smarter Site Assessments",
      description: "Our AI-powered Processing Engine automates geospatial analysis, cutting down manual site assessment time from weeks to minutes."
    },
    {
      icon: <Shield className="h-8 w-8 text-australis-aqua" />,
      title: "Informed Decision-Making with AI Agents",
      description: "Regulatory Compliance Engine scans planning policies and grid constraints, providing developers with instant, context-rich insights."
    },
    {
      icon: <Zap className="h-8 w-8 text-australis-indigo" />,
      title: "Optimised Site Selection",
      description: "Developability Index Scoring ranks sites based on buildability, grid access, and environmental impact, reducing project risk and maximising success rates."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-australis-darkBlue relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
      <div className="container-custom relative">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-australis-navy">
            <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent">
              Australis will reduce the time taken for early-stage site assessments by 95%
            </span>
          </h2>
          <p className="text-australis-lightGray mt-4 mb-6 max-w-2xl mx-auto">
            We have developed a unique innovation combining Geospatial Analytics and Agentic AI to transform renewable energy development.
          </p>
          <div className="h-1 w-40 mx-auto bg-gradient-to-r from-australis-indigo to-australis-aqua rounded-full"></div>
        </div>
        
        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 ${inView ? 'animate-fade-in-blur' : 'opacity-0'}`}>
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-xl backdrop-blur-sm bg-australis-navy/30 border border-white/10 hover:border-australis-aqua/20 hover:bg-australis-navy/50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-2"
            >
              <div className="p-4 bg-gradient-to-br from-australis-navy/80 to-australis-navy/40 backdrop-blur-md rounded-full shadow-sm mb-6 border border-white/10">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                {benefit.title}
              </h3>
              <p className="text-australis-lightGray">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;

