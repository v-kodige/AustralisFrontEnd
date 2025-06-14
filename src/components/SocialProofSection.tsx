
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const SocialProofSection = () => {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true, 
      align: "center",
      dragFree: true,
      duration: 50 // Controls the scroll animation speed (higher = slower)
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const partners = [
    { name: "Geovation", logo: "/lovable-uploads/7bf2a95a-42ca-4004-aee8-ecd6db3aa1da.png" },
    { name: "Ordnance Survey", logo: "/lovable-uploads/8624a46a-939e-4720-bb86-9838bd50d189.png" },
    { name: "Microsoft for Startups", logo: "/lovable-uploads/5480d427-a1da-4dfb-8136-ce692da9901e.png" },
    { name: "More Coming Soon!", logo: "", isText: true }
  ];

  return (
    <section className="py-20 bg-background" ref={ref}>
      <div className="container-custom max-w-4xl">
        <h2 className="text-3xl font-bold text-center mb-16 text-foreground">
          Partners
        </h2>

        <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
          <Carousel ref={emblaRef} className="w-full">
            <CarouselContent className="flex justify-center">
              {partners.map((partner, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4 flex justify-center">
                  <div className="flex items-center justify-center p-4 h-24">
                    {partner.isText ? (
                      <p className="text-lg font-medium text-muted-foreground">{partner.name}</p>
                    ) : (
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="max-h-16 max-w-full object-contain" 
                      />
                    )}
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
