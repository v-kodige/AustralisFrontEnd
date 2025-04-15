
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface DetailItem {
  label: string;
  value: string;
  color?: string;
}

interface Tab {
  name: string;
  color: string;
  details: DetailItem[];
}

const tabs: Tab[] = [
  { 
    name: "Landscape Stats", 
    color: "bg-red-500", 
    details: [
      { label: "Distance to constraint", value: "2.3 km NE of the site" },
      { label: "Scoring Rating", value: "17%" },
      { label: "Impact Level", value: "Medium", color: "text-amber-500" }
    ]
  },
  { 
    name: "Env Stats", 
    color: "bg-lime-400", 
    details: [
      { label: "Distance to constraint", value: "5.1 km SW of the site" },
      { label: "Scoring Rating", value: "32%" },
      { label: "Impact Level", value: "Low", color: "text-green-500" }
    ]
  },
  { 
    name: "Planning Stats", 
    color: "bg-teal-400", 
    details: [
      { label: "Distance to constraint", value: "1.2 km N of the site" },
      { label: "Scoring Rating", value: "24%" },
      { label: "Impact Level", value: "High", color: "text-red-500" }
    ]
  },
  { 
    name: "Other Stats", 
    color: "bg-pink-500", 
    details: [
      { label: "Distance to constraint", value: "3.7 km E of the site" },
      { label: "Scoring Rating", value: "15%" },
      { label: "Impact Level", value: "Low", color: "text-green-500" }
    ]
  }
];

const ProjectDetails = () => {
  const [activeTab, setActiveTab] = useState<number | null>(null);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 backdrop-blur-sm border border-gray-100">
      <div className="mb-4 text-lg font-medium">Project Details</div>
      
      <div className="space-y-4">
        {tabs.map((tab, index) => (
          <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
            <button 
              onClick={() => setActiveTab(activeTab === index ? null : index)} 
              className="w-full p-3 flex items-center justify-between text-left"
            >
              <div className="flex items-center">
                <div className={`w-full h-1.5 ${tab.color} rounded-full`}></div>
                <span className="ml-2">{tab.name}</span>
              </div>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${activeTab === index ? 'rotate-180' : ''}`} 
              />
            </button>
            
            {activeTab === index && (
              <div className="p-3 bg-gray-50 border-t border-gray-200">
                {tab.details.map((detail, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <span className="text-sm text-gray-600">{detail.label}</span>
                    <span className={`text-sm font-medium ${detail.color || 'text-gray-800'}`}>
                      {detail.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectDetails;
