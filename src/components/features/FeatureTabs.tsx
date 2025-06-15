
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, FileCheck, CircuitBoard, LineChart, LucideIcon } from 'lucide-react';
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
      label: "Instant Site Ranking",
      title: "Prioritise High-Potential Sites Instantly",
      description: "Identify the sites with the best prospects so you invest energy where it matters most.",
      image: "bg-gradient-to-br from-australis-navy/10 to-australis-aqua/10",
      highlights: [
        "Clear site scores based on your actual constraints",
        "Immediate mapping of your best opportunities",
        "Consistent, bias-free assessment across all locations"
      ]
    },
    {
      id: "compliance",
      icon: <FileCheck className="h-5 w-5" />,
      label: "Automated Compliance",
      title: "Eliminate Regulatory Uncertainty",
      description: "Automate the interpretation of complex rules so that nothing is missed.",
      image: "bg-gradient-to-br from-australis-aqua/10 to-australis-indigo/10",
      highlights: [
        "Instantly surface all relevant planning rules",
        "Auto-flag potential red flags and blockers early",
        "Get actionable, tailored policy guidance for each site"
      ]
    },
    {
      id: "design",
      icon: <Map className="h-5 w-5" />,
      label: "Buildability Insights",
      title: "Visualise What’s Truly Buildable, Effortlessly",
      description: "Move beyond maps—see what you can really deliver on the ground.",
      image: "bg-gradient-to-br from-australis-navy/10 to-australis-indigo/10",
      highlights: [
        "Calculate true buildable area instantly",
        "Auto-detect limiting land features and obstructions",
        "Preview realistic project layouts and outputs"
      ]
    },
    {
      id: "grid",
      icon: <CircuitBoard className="h-5 w-5" />,
      label: "Grid Readiness",
      title: "Connect to the Grid with Confidence",
      description: "Uncover the closest and most viable grid points for every site.",
      image: "bg-gradient-to-br from-australis-indigo/10 to-australis-navy/10",
      highlights: [
        "Find your nearest connection options in seconds",
        "Estimate connection feasibility, not just distance",
        "Plan with live, location-specific grid insights"
      ]
    }
  ];

  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <Tabs defaultValue={features[0].id} className="w-full" onValueChange={setActiveTab}>
      <TabsList className={`grid grid-cols-2 md:grid-cols-4 gap-2 p-1 mb-8 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20 animate-fade-in`}>
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
        <FeatureTab key={feature.id} feature={feature} activeTab={activeTab} />
      ))}
    </Tabs>
  );
};

export default FeatureTabs;
