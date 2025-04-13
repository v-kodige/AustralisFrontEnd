
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, 
  FileCheck, 
  CircuitBoard, 
  LineChart
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const FeaturesSection = () => {
  const features = [
    {
      id: "design",
      icon: <Map className="h-5 w-5" />,
      label: "Design Engine",
      title: "Design Engine",
      description: "Analyses land features, buildability, and power capacity to assess early-stage site potential.",
      image: "bg-gradient-to-br from-australis-navy/10 to-australis-indigo/10",
      highlights: [
        "Automated terrain analysis",
        "Solar capacity calculation",
        "Land suitability assessment"
      ]
    },
    {
      id: "compliance",
      icon: <FileCheck className="h-5 w-5" />,
      label: "Compliance Agent",
      title: "Compliance Agent",
      description: "Uses GenAI to interpret planning policies and regulatory risks.",
      image: "bg-gradient-to-br from-australis-aqua/10 to-australis-indigo/10",
      highlights: [
        "Policy interpretation",
        "Risk assessment",
        "Regulation compliance checks"
      ]
    },
    {
      id: "grid",
      icon: <CircuitBoard className="h-5 w-5" />,
      label: "Grid Insights",
      title: "Grid Insights",
      description: "Real-time analysis of local grid constraints and connection opportunities.",
      image: "bg-gradient-to-br from-australis-indigo/10 to-australis-navy/10",
      highlights: [
        "Connection point identification",
        "Capacity analysis",
        "Distance calculation"
      ]
    },
    {
      id: "scoring",
      icon: <LineChart className="h-5 w-5" />,
      label: "Developability Scoring",
      title: "Developability Scoring",
      description: "Aggregates constraints and opportunities to give you clear prioritisation.",
      image: "bg-gradient-to-br from-australis-navy/10 to-australis-aqua/10",
      highlights: [
        "Weighted scoring algorithm",
        "Comparative site ranking",
        "Priority recommendations"
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(features[0].id);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <section id="features" className="py-24 bg-white" ref={ref}>
      <div className="container-custom">
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-australis-navy">
            Powerful features for smarter site selection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Australis combines cutting-edge AI with comprehensive geospatial data
          </p>
        </div>

        <Tabs defaultValue={features[0].id} className="w-full" onValueChange={setActiveTab}>
          <TabsList className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1 mb-8 bg-white rounded-lg ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
            {features.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center gap-2 data-[state=active]:bg-australis-indigo data-[state=active]:text-white"
              >
                {feature.icon}
                <span className="hidden md:inline">{feature.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {features.map((feature) => (
            <TabsContent 
              key={feature.id} 
              value={feature.id}
              className={`${activeTab === feature.id ? 'animate-fade-in' : 'opacity-0'}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-australis-navy">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-australis-aqua"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${feature.image} rounded-xl h-64 md:h-80 shadow-md`}>
                  <div className="h-full w-full flex items-center justify-center text-australis-navy">
                    Feature visualization
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeaturesSection;
