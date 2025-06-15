
const DashboardFooter = () => {
  return (
    <footer className="bg-gradient-to-r from-australis-navy to-australis-darkBlue text-white py-12 mt-16">
      <div className="container-custom text-center">
        <div className="mb-4">
          <img 
            alt="AE Logo" 
            className="h-8 w-auto mx-auto mb-4 opacity-80" 
            src="/lovable-uploads/edc919d7-a5bd-4ead-bba9-be9e35909623.png" 
          />
          <h3 className="text-lg font-semibold mb-2">Australis Energy</h3>
          <p className="text-sm opacity-80 max-w-md mx-auto">
            Empowering renewable energy development with intelligent analysis and insights
          </p>
        </div>
        <p className="text-xs opacity-60">© 2025 Australis Energy. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
