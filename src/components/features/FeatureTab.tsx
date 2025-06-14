
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
      className={`transition-all duration-500 ${isActive ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className={`glass-card p-8 rounded-xl transition-all duration-300 ${isActive ? 'glow-aqua border-primary/30' : 'border-border'}`}>
          <h3 className="text-2xl font-bold mb-4 text-foreground">
            {feature.title}
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {feature.description}
          </p>
          <ul className="space-y-3">
            {feature.highlights.map((highlight, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                <span className="text-muted-foreground">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className={`glass-card rounded-xl transition-all duration-300 ${isActive ? 'glow-electric border-secondary/30' : 'border-border'} overflow-hidden`}>
          {feature.id === 'scoring' ? (
            <div className="p-8">
              <DevelopabilityRings />
            </div>
          ) : (
            <div className={`${feature.image} h-64 md:h-80 p-8 relative`}>
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-white/20 rounded animate-pulse"></div>
                  </div>
                  <p className="font-medium">Feature visualization</p>
                </div>
              </div>
              
              {/* Tech overlay */}
              <div className="absolute top-4 right-4 w-8 h-8 border border-primary/40 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-6 h-6 bg-secondary/30 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          )}
        </div>
      </div>
    </TabsContent>
  );
};

export default FeatureTab;
