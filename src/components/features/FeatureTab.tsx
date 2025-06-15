
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
  return (
    <TabsContent 
      key={feature.id} 
      value={feature.id}
      className={`${activeTab === feature.id ? 'animate-fade-in' : 'opacity-0'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="glass-card p-8 rounded-xl">
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
        
        {feature.id === 'scoring' ? (
          <div className="glass-card p-8 rounded-xl">
            <DevelopabilityRings />
          </div>
        ) : (
          <div className={`${feature.image} glass-card rounded-xl h-64 md:h-80 p-8`}>
            <div className="h-full w-full flex items-center justify-center text-australis-navy">
              Feature visualization
            </div>
          </div>
        )}
      </div>
    </TabsContent>
  );
};

export default FeatureTab;
