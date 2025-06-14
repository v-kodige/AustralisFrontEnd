
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, FileCheck, CircuitBoard, LineChart } from 'lucide-react';
import FeatureTab from './FeatureTab';

interface Feature {
  id: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  description: string;
  image: string;
  highlights: string[];
}

const FeatureTabs = () => {
  const features: Feature[] = [
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
    }
  ];

  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <Tabs defaultValue={features[0].id} className="w-full" onValueChange={setActiveTab}>
      <TabsList className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1 mb-8 bg-muted backdrop-blur-sm rounded-lg border animate-fade-in`}>
        {features.map((feature) => (
          <TabsTrigger 
            key={feature.id} 
            value={feature.id}
            className="flex items-center gap-2 data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
          >
            {feature.icon}
            <span className="hidden md:inline">{feature.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      
      {features.map((feature) => (
        <FeatureTab key={feature.id} feature={feature} activeTab={activeTab} />
      ))}
    </Tabs>
  );
};

export default FeatureTabs;
