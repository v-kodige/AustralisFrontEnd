
import { Clock, Shield, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const BenefitsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-australis-indigo drop-shadow-sm" />,
      title: "Faster, Smarter Site Assessments",
      description: "Our AI-powered Processing Engine automates geospatial analysis, cutting down manual site assessment time from weeks to minutes."
    },
    {
      icon: <Shield className="h-8 w-8 text-australis-aqua drop-shadow-sm" />,
      title: "Informed Decision-Making with AI Agents",
      description: "Regulatory Compliance Engine scans planning policies and grid constraints, providing developers with instant, context-rich insights."
    },
    {
      icon: <Zap className="h-8 w-8 text-australis-indigo drop-shadow-sm" />,
      title: "Optimised Site Selection",
      description: "Developability Index Scoring ranks sites based on buildability, grid access, and environmental impact, reducing project risk and maximising success rates."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-gradient-to-br from-australis-offWhite via-white to-australis-lightGray relative overflow-hidden">
      {/* Layered background effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-br from-australis-aqua/15 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-tr from-australis-indigo/15 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center mb-10">
          {/* Elevated title card */}
          <div className="backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 shadow-2xl shadow-australis-navy/5 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-australis-navy drop-shadow-sm">
              <span className="bg-gradient-to-r from-australis-indigo to-australis-aqua bg-clip-text text-transparent">
                Australis will reduce the time taken for early-stage site assessments by 95%
              </span>
            </h2>
            <p className="text-gray-600 mt-4 mb-6 max-w-2xl mx-auto">
              We have developed a unique innovation combining Geospatial Analytics and Agentic AI to transform renewable energy development.
            </p>
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-australis-indigo to-australis-aqua rounded-full shadow-sm"></div>
          </div>
        </div>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 animate-fade-in">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl backdrop-blur-xl bg-white/40 border border-white/50 hover:border-australis-aqua/30 hover:bg-white/60 transition-all duration-500 shadow-xl shadow-australis-navy/5 hover:shadow-2xl hover:shadow-australis-aqua/10 transform hover:-translate-y-2"
            >
              {/* Floating icon with layered effects */}
              <div className="relative p-6 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-md rounded-2xl shadow-lg shadow-australis-navy/10 mb-6 border border-white/60 group-hover:shadow-xl group-hover:shadow-australis-aqua/20 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-australis-aqua/10 to-australis-indigo/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  {benefit.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-4 text-australis-navy drop-shadow-sm">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
              
              {/* Subtle accent elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-australis-aqua/40 to-australis-indigo/40 rounded-full blur-sm"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-gradient-to-tr from-australis-indigo/40 to-australis-aqua/40 rounded-full blur-sm"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
