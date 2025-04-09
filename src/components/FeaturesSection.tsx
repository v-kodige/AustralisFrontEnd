
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Map, 
  FileCheck, 
  Barrier, 
  LineChart
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      id: "design",
      icon: <Map className="h-5 w-5" />,
      label: "Design Engine",
      title: "Design Engine",
      description: "Analyses land features, buildability, and power capacity to assess early-stage site potential.",
      image: "bg-gradient-to-br from-blue-100 to-blue-200",
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
      image: "bg-gradient-to-br from-green-100 to-blue-100",
      highlights: [
        "Policy interpretation",
        "Risk assessment",
        "Regulation compliance checks"
      ]
    },
    {
      id: "grid",
      icon: <Barrier className="h-5 w-5" />,
      label: "Grid Insights",
      title: "Grid Insights",
      description: "Real-time analysis of local grid constraints and connection opportunities.",
      image: "bg-gradient-to-br from-teal-100 to-green-100",
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
      image: "bg-gradient-to-br from-blue-100 to-teal-100",
      highlights: [
        "Weighted scoring algorithm",
        "Comparative site ranking",
        "Priority recommendations"
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <section id="features" className="py-24 bg-australis-background">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful features for smarter site selection
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Australis combines cutting-edge AI with comprehensive geospatial data
          </p>
        </div>

        <Tabs defaultValue={features[0].id} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 mb-8 bg-white rounded-lg">
            {features.map((feature) => (
              <TabsTrigger 
                key={feature.id} 
                value={feature.id}
                className="flex items-center gap-2 data-[state=active]:bg-australis-blue data-[state=active]:text-white"
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
              className="animate-fade-in"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-australis-blue">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-australis-teal"></div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${feature.image} rounded-xl h-64 md:h-80 shadow-md`}>
                  <div className="h-full w-full flex items-center justify-center text-australis-gray">
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
