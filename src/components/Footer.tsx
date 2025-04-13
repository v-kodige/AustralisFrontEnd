
import { Twitter, Linkedin, Instagram, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-australis-background border-t border-gray-200 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-australis-blue mb-4">Australis</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Accelerating renewable energy development with AI-powered site selection tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-australis-blue" aria-label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-australis-blue" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-australis-blue" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-australis-blue" aria-label="Bluesky">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-australis-blue">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-australis-blue">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-australis-blue">Contact</a>
              </li>
              <li>
                <a href="mailto:hello@australis.energy" className="text-gray-600 hover:text-australis-blue">hello@australis.energy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-australis-blue">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-australis-blue">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-australis-blue">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 text-center md:text-left text-gray-500 text-sm">
          <p>&copy; {currentYear} Australis Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
