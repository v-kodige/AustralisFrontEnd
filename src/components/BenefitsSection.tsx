
import { Clock, Shield, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const BenefitsSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const benefits = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Faster, Smarter Site Assessments",
      description: "Our AI-powered Processing Engine automates geospatial analysis, cutting down manual site assessment time from weeks to minutes."
    },
    {
      icon: <Shield className="h-8 w-8 text-secondary" />,
      title: "Informed Decision-Making with AI Agents",
      description: "Regulatory Compliance Engine scans planning policies and grid constraints, providing developers with instant, context-rich insights."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Optimised Solar Site Selection",
      description: "Developability Index Scoring ranks sites based on buildability, grid access, and environmental impact, reducing project risk and maximising success rates."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-background relative overflow-hidden">
      {/* Background tech elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-secondary rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-primary rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="container-custom relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-foreground leading-tight">
            Australis will reduce the time taken for 
            <span className="block text-gradient relative">
              early-stage site assessments by 95%
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 h-2 w-48 bg-gradient-to-r from-primary to-secondary rounded-full blur-sm"></div>
            </span>
          </h2>
          
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-muted rounded-xl border border-primary/20">
            <p className="text-lg font-medium text-gradient text-center">
              We have developed a unique innovation combining Geospatial Analytics and Agentic AI
            </p>
          </div>
        </div>
        
        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-3 gap-10 mt-16 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="group flex flex-col items-center text-center p-8 rounded-xl bg-muted border border-border hover:border-primary/30 hover:glow-aqua transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-2"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full shadow-sm mb-6 border border-primary/20 group-hover:glow-aqua transition-all duration-300">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
