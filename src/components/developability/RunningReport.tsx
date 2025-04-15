
const RunningReport = () => {
  return (
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
  );
};

export default RunningReport;
