import { ReactNode } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import DevelopabilityRings from '../DevelopabilityRings';

interface FeatureHighlight {
  title: string;
  description: string;
  highlights: string[];
  image: string;
  id: string;
}

interface FeatureTabProps {
  feature: FeatureHighlight;
  activeTab: string;
}

const FeatureTab = ({ feature, activeTab }: FeatureTabProps) => {
  const isActive = activeTab === feature.id;
  return (
    <TabsContent 
      key={feature.id} 
      value={feature.id}
      className={`${isActive ? 'animate-fade-in-blur' : 'opacity-0'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className={`glass-card p-8 rounded-xl transition-all duration-300 ${isActive ? 'shadow-glow-aqua' : 'shadow-lg'}`}>
          <h3 className="text-2xl font-bold mb-4 text-card-foreground">
            {feature.title}
          </h3>
          <p className="text-muted-foreground mb-6">
            {feature.description}
          </p>
          <ul className="space-y-3">
            {feature.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <span className="text-muted-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className={`glass-card rounded-xl transition-all duration-300 ${isActive ? 'shadow-glow-indigo' : 'shadow-lg'}`}>
          {feature.id === 'scoring' ? (
            <div className="p-8">
              <DevelopabilityRings />
            </div>
          ) : (
            <div className={`${feature.image} h-64 md:h-80 p-8`}>
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                Feature visualization
              </div>
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default FeatureTab;
