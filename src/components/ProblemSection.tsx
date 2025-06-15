
import { useInView } from 'react-intersection-observer';

const ProblemSection = () => {
  const {
    ref: sectionRef,
    inView
  } = useInView({
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
    <section className="py-16 bg-australis-lightGray" id="problem">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center gap-2 mb-10 bg-transparent">
          <h2 className="text-2xl font-bold text-transparent text-center">Focus on what works. Skip what doesn't.</h2>
          <p className="max-w-3xl mt-6 text-lg text-center font-bold text-australis-navy my-[23px] mx-0 md:text-3xl">Australis cuts through the noise to surface the sites that matter.</p>
        </div>
        
        <div ref={sectionRef} className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="glass-card bg-white/30 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-shadow transform"
            >
              <div className="text-3xl font-bold text-australis-indigo mb-4">
                {stat.highlight}
              </div>
              <p className="text-gray-600">
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
