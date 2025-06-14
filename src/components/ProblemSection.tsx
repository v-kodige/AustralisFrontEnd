import { useInView } from 'react-intersection-observer';

const ProblemSection = () => {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  const stats = [
    {
      highlight: "70%",
      description: "of sites assessed are rejected due to grid constraints, land issues, or regulatory barriers."
    },
    {
      highlight: "1 week",
      description: "Manual assessments take up to 1 week per site, slowing down decision-making and increasing costs."
    },
    {
      highlight: "2/3",
      description: "From 2018-2023, 2/3 of UK renewable energy planning applications failed to achieve consent."
    }
  ];

  return (
    <section className="py-16 bg-background" id="problem">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="text-lg text-[#3a3d5d] mb-6 max-w-4xl mx-auto">
            In less than 4 years, the global CO₂ budget will be exhausted and Earth will be 1.5°C warmer. 
            The UK needs to deploy 70GW of solar by 2035 — but deployment rates are only at 25% of what's needed. 
            Developers still rely on outdated tools, complex GIS workflows, and slow, manual processes to assess sites.
          </p>
          <div className="relative inline-block">
            <h2 className="text-2xl md:text-3xl font-bold text-gradient mb-2">
              The Current Reality
            </h2>
            <div className="h-1 w-full bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        
        <div ref={sectionRef} className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-card p-8 rounded-xl border border-border transition-all duration-300 hover:glow-aqua hover:-translate-y-2 relative overflow-hidden shadow-lg"
              style={{animationDelay: `${index * 0.2}s`}}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-secondary to-primary"></div>
              <div className="text-4xl font-bold mb-4 font-mono text-[#002060]">
                {stat.highlight}
              </div>
              <p className="text-[#3a3d5d] leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
