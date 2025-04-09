
import { AlertCircle } from 'lucide-react';

const ProblemSection = () => {
  const stats = [
    {
      highlight: "4 years",
      description: "In less than 4 years, the global CO₂ budget will be exhausted and Earth will be 1.5°C warmer."
    },
    {
      highlight: "70GW",
      description: "The UK needs to deploy 70GW of solar by 2035 — but deployment rates are only at 25% of what's needed."
    },
    {
      highlight: "Outdated",
      description: "Developers still rely on outdated tools, complex GIS workflows, and slow, manual processes to assess sites."
    }
  ];

  return (
    <section className="py-16 bg-australis-background">
      <div className="container-custom">
        <div className="flex items-center justify-center gap-2 mb-6">
          <AlertCircle className="h-6 w-6 text-australis-teal" />
          <h2 className="text-2xl font-semibold text-center">The Climate Clock is Ticking</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl font-bold text-australis-blue mb-4">
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
