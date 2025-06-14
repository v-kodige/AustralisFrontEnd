
import { Twitter, Linkedin, Instagram, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ backgroundColor: '#3a3d5d' }} className="text-light-mint py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-light-mint mb-4">Australis</h3>
            <p className="text-light-mint/70 mb-6 max-w-sm">
              Accelerating renewable energy development with AI-powered site selection tools.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-light-mint/70 hover:text-turquoise" aria-label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-mint/70 hover:text-turquoise" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-mint/70 hover:text-turquoise" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-light-mint/70 hover:text-turquoise" aria-label="Bluesky">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-light-mint">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-light-mint/70 hover:text-turquoise">About</a>
              </li>
              <li>
                <a href="#" className="text-light-mint/70 hover:text-turquoise">Careers</a>
              </li>
              <li>
                <a href="#" className="text-light-mint/70 hover:text-turquoise">Contact</a>
              </li>
              <li>
                <a href="mailto:hello@australis.energy" className="text-light-mint/70 hover:text-turquoise">
                  hello@australis.energy
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-light-mint">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-light-mint/70 hover:text-turquoise">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-light-mint/70 hover:text-turquoise">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-light-mint/70 hover:text-turquoise">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-6 text-center md:text-left text-light-mint/60 text-sm">
          <p>&copy; {currentYear} Australis Technologies Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
