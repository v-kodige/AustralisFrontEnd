import { useInView } from 'react-intersection-observer';
const ProblemSection = () => {
  const {
    ref: sectionRef,
    inView
  } = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  const stats = [{
    highlight: "70%",
    description: "of sites are rejected—often only after weeks of investigation—due to hidden grid, land, or permission issues."
  }, {
    highlight: "1 week",
    description: "Manual assessments per site slow decisions and drive up costs, making scaling impossible."
  }, {
    highlight: "2 out of 3",
    description: "UK renewable planning applications have failed in recent years, as complex risks are missed early."
  }];
  return <section className="py-16 bg-australis-lightGray" id="problem">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center gap-2 mb-10 bg-transparent">
          <h2 className="font-bold text-center text-slate-900 text-3xl">The bottleneck isn’t data—it’s making confident decisions, fast.</h2>
          <p className="max-w-3xl mt-6 text-lg text-center font-bold text-australis-navy my-[23px] mx-0 md:text-3xl">
            Australis moves you from slow, manual reviews to instant, confident go/no-go at scale.
          </p>
        </div>

        <div ref={sectionRef} className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 ${inView ? 'animate-fade-in' : 'opacity-0'}`}>
          {stats.map((stat, index) => <div key={index} className="glass-card bg-white/30 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-white/20 hover:shadow-md transition-shadow transform">
              <div className="text-3xl font-bold text-australis-indigo mb-4">
                {stat.highlight}
              </div>
              <p className="text-gray-600">
                {stat.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default ProblemSection;