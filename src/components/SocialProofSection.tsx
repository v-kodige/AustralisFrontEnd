
import { useEffect, useState } from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { useInView } from 'react-intersection-observer';

const SocialProofSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  const partners = [
    { name: "Geovation", logo: "/lovable-uploads/6736aa2b-8316-409c-9cfc-e3b900d6114e.png" },
    { name: "Ordnance Survey", logo: "/lovable-uploads/094aef44-10b7-4221-b997-f7e9dd76a058.png" },
    { name: "Microsoft for Startups", logo: "/lovable-uploads/b10e0c68-8cdd-4bba-a90c-097ac5de8c4b.png" },
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
    <section className="py-20 bg-white" ref={ref}>
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-16">
          Partners
        </h2>

        <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <Carousel 
            opts={{ loop: true, align: "start" }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 flex items-center justify-center p-4">
                  <div className="flex flex-col items-center justify-center h-24">
                    {partner.logo.startsWith("/") ? (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-h-16 max-w-full object-contain" 
                      />
                    ) : (
                      <div className={`${partner.logo} w-32 h-16 rounded flex items-center justify-center`}>
                        <span className="text-gray-500 font-medium">{partner.name}</span>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
          </Carousel>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className={`bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100 shadow-sm ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
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
