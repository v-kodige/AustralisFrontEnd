
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const SocialProofSection = () => {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const partners = [
    { name: "Geovation", logo: "/lovable-uploads/6736aa2b-8316-409c-9cfc-e3b900d6114e.png" },
    { name: "Ordnance Survey", logo: "/lovable-uploads/094aef44-10b7-4221-b997-f7e9dd76a058.png" },
    { name: "Microsoft for Startups", logo: "/lovable-uploads/b10e0c68-8cdd-4bba-a90c-097ac5de8c4b.png" }
  ];

  return (
    <section className="py-20 bg-white" ref={ref}>
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-16">
          Partners
        </h2>

        <div className="glass-card p-8 rounded-xl backdrop-blur-sm">
          <Carousel ref={emblaRef} className="w-full">
            <CarouselContent>
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <div className="flex items-center justify-center p-4 h-24">
                    <img 
                      src={partner.logo} 
                      alt={partner.name} 
                      className="max-h-16 max-w-full object-contain" 
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
