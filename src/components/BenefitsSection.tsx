
import { Clock, Shield, Zap } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-australis-blue" />,
      title: "Save weeks of manual analysis",
      description: "Let AI handle complex geospatial data and policy review."
    },
    {
      icon: <Shield className="h-8 w-8 text-australis-teal" />,
      title: "Reduce risk, increase success",
      description: "Every site gets a tailored \"Developability Score\" based on buildability, planning, and grid data."
    },
    {
      icon: <Zap className="h-8 w-8 text-australis-green" />,
      title: "Smarter decisions, faster",
      description: "Get clear insights into power potential, constraints, and connection opportunities — instantly."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Accelerate your renewable development pipeline
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform transforms how you identify and assess solar sites
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-australis-background transition-colors"
            >
              <div className="p-4 bg-white rounded-full shadow-sm mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
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
