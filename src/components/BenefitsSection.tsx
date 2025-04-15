
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
      title: "Optimised Solar Site Selection",
      description: "Developability Index Scoring ranks sites based on buildability, grid access, and environmental impact, reducing project risk and maximising success rates."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-australis-offWhite">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-australis-navy">
            <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent">
              Australis will reduce the time taken for early-stage site assessments by 95%
            </span>
          </h2>
          <p className="text-gray-600 mt-4 mb-6 max-w-2xl mx-auto">
            We have developed a unique innovation combining Geospatial Analytics and Agentic AI to transform renewable energy development.
          </p>
          <div className="h-1 w-40 mx-auto bg-gradient-to-r from-australis-indigo to-australis-aqua rounded-full"></div>
        </div>
        
        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-xl backdrop-blur-sm bg-white/40 border border-white/30 hover:border-australis-aqua/20 hover:bg-white/60 transition-all shadow-sm"
            >
              <div className="p-4 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md rounded-full shadow-sm mb-6 border border-white/50">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-australis-navy">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
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
