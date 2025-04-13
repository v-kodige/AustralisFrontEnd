
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';

const DevelopabilityIndex = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const [score, setScore] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
  
  useEffect(() => {
    if (inView) {
      setIsVisible(true);
      
      if (score < 88) {
        animationRef.current = setTimeout(() => {
          setScore((prev) => Math.min(prev + 1, 88));
        }, 20);
      }
      
      return () => {
        if (animationRef.current) {
          clearTimeout(animationRef.current);
        }
      };
    }
  }, [inView, score]);

  const calculateProgress = (value) => {
    return (value / 100) * 100;
  };
  
  const tabs = [
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
  
  const [activeTab, setActiveTab] = useState(null);

  return (
    <section className="py-20 bg-australis-lightGray" id="developability" ref={ref}>
      <div className="container-custom">
        <h2 className="text-3xl font-bold text-center mb-16">
          Developability Index
        </h2>
        
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="bg-white rounded-xl shadow-md p-6 backdrop-blur-sm border border-gray-100 flex flex-col">
            <div className="text-sm text-gray-600 mb-4">Report Running</div>
            <div className="border border-gray-200 rounded-lg p-4 mb-6 flex-1">
              <div className="aspect-square relative bg-gray-100 rounded-md mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Map Visualization
                </div>
              </div>
              
              <div className="space-y-2 mt-8">
                <div className="border border-green-500 rounded-md h-8 flex items-center px-4 relative">
                  <span className="absolute inset-y-0 left-2 flex items-center">
                    <svg height="16" width="16" className="text-green-500">
                      <circle cx="8" cy="8" r="6" fill="currentColor" />
                      <circle cx="8" cy="8" r="3" fill="white" />
                    </svg>
                  </span>
                  <span className="ml-6">Feature Checked</span>
                </div>
                <div className="border border-gray-300 rounded-md h-8"></div>
                <div className="border border-gray-300 rounded-md h-8"></div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="relative bg-white rounded-xl shadow-md p-6 backdrop-blur-sm border border-gray-100 flex flex-col items-center mb-8">
              <div className="mb-4 text-lg font-medium">Developability Score</div>
              <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                {/* Circular Progress Rings */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#f0f0f4" 
                    strokeWidth="8" 
                  />
                  <circle 
                    cx="50" cy="50" r="45" 
                    fill="none" 
                    stroke="#3bf5b7" 
                    strokeWidth="8" 
                    strokeDasharray={`${calculateProgress(score)} 283`} 
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                  />
                  <circle 
                    cx="50" cy="50" r="37" 
                    fill="none" 
                    stroke="#f0f0f4" 
                    strokeWidth="6" 
                  />
                  <circle 
                    cx="50" cy="50" r="37" 
                    fill="none" 
                    stroke="#6062ff" 
                    strokeWidth="6" 
                    strokeDasharray={`${calculateProgress(score * 0.85)} 233`} 
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <circle 
                    cx="50" cy="50" r="29" 
                    fill="none" 
                    stroke="#f0f0f4" 
                    strokeWidth="4" 
                  />
                  <circle 
                    cx="50" cy="50" r="29" 
                    fill="none" 
                    stroke="#ff6b6b" 
                    strokeWidth="4" 
                    strokeDasharray={`${calculateProgress(score * 0.7)} 182`} 
                    strokeLinecap="round"
                    className="transition-all duration-900 ease-out"
                  />
                </svg>
                <div className="absolute text-4xl font-bold">{score}</div>
              </div>
              
              <div className="text-sm text-gray-500">
                These rings grow as the developability score increases
              </div>
            </div>
            
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default DevelopabilityIndex;
