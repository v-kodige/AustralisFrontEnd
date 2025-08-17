import { Linkedin, ExternalLink } from 'lucide-react';
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Custom X (Twitter) logo SVG
  const XLogo = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>;

  // Custom Bluesky logo SVG
  const BlueskyLogo = () => <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.287-.04.455-.061-.525.4-1.607 1.357-2.181 2.091-1.818 2.322-.976 4.489-.976 4.489s3.036-1.204 4.695-3.368C9.702 15.62 10.656 14.299 12 10.8zm0 0c1.344 3.499 2.298 4.82 3 6.762 1.659 2.164 4.695 3.368 4.695 3.368s.842-2.167-.976-4.489c-.574-.734-1.656-1.691-2.181-2.091.168.021.319.041.455.061 2.67.296 5.568-.628 6.383-3.364.246-.829.624-5.789.624-6.479 0-.688-.139-1.86-.902-2.203-.659-.299-1.664-.621-4.3 1.24C17.046 4.747 14.087 8.686 13 10.8z" />
    </svg>;
  return <footer className="bg-australis-background border-t border-gray-200 py-12">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-australis-blue mb-4">Australis</h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Accelerating renewable energy development with AI-powered site selection tools.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/australisenergy" className="text-gray-400 hover:text-australis-blue" aria-label="X (formerly Twitter)" target="_blank" rel="noopener noreferrer">
                <XLogo />
              </a>
              <a href="https://www.linkedin.com/company/australis-energy/about/" className="text-gray-400 hover:text-australis-blue" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://bsky.app/profile/australisenergy.bsky.social" className="text-gray-400 hover:text-australis-blue" aria-label="Bluesky" target="_blank" rel="noopener noreferrer">
                <BlueskyLogo />
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
    </footer>;
};
export default Footer;