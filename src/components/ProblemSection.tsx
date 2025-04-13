
import { AlertCircle } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const ProblemSection = () => {
  const { ref: sectionRef, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
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
    <section className="py-16 bg-australis-lightGray">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center gap-2 mb-10">
          <AlertCircle className="h-6 w-6 text-australis-aqua" />
          <h2 className="text-2xl font-semibold text-center">The Climate Clock is Ticking</h2>
          
          <div className="relative max-w-3xl mx-auto mt-6 overflow-hidden">
            <p className="typewriter-text inline-block overflow-hidden whitespace-nowrap border-r-2 animate-typewriter animate-blink-caret text-lg md:text-xl text-australis-navy text-center">
              Focus on what works best and avoid the noise. Our platform helps you concentrate efforts where they matter most.
            </p>
          </div>
        </div>
        
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`bg-white p-8 rounded-xl shadow-sm border border-australis-lightGray hover:shadow-md transition-shadow transform ${inView ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 200}ms` }}
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
