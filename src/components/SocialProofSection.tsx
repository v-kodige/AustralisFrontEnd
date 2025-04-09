
const SocialProofSection = () => {
  const partners = [
    { name: "Geovation", logo: "bg-gray-200" },
    { name: "Ordnance Survey", logo: "bg-gray-200" },
    { name: "Microsoft for Startups", logo: "bg-gray-200" },
    { name: "Climate Partner", logo: "bg-gray-200" },
    { name: "UK Energy", logo: "bg-gray-200" }
  ];

  const testimonials = [
    {
      quote: "Australis has revolutionized how we identify potential sites. What used to take weeks now takes minutes.",
      author: "Sarah Johnson",
      role: "Head of Development, SolarFuture UK",
      image: "bg-gray-200"
    },
    {
      quote: "The platform's ability to quickly prioritize sites based on real constraints has dramatically improved our success rate.",
      author: "Mark Williams",
      role: "Director, GreenField Energy",
      image: "bg-gray-200"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-16">
          Trusted by leading developers
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center mb-16">
          {partners.map((partner, index) => (
            <div 
              key={index} 
              className={`${partner.logo} w-32 h-16 md:w-40 md:h-20 rounded flex items-center justify-center`}
            >
              <span className="text-gray-500 font-medium">{partner.name}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-australis-background p-6 rounded-xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className={`${testimonial.image} w-12 h-12 rounded-full flex-shrink-0`}></div>
                <div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                  <p className="font-medium">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
