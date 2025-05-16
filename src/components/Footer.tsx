import { Shield, Mail, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Safescape</span>
            </div>
            <p className="text-gray-400 mb-4">
              Smart disaster evacuation system using advanced path-finding algorithms to save lives.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition">Documentation</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition">How it works</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition">API Reference</Link>
              </li>
              <li>
                <Link to="#" className="text-gray-400 hover:text-white transition">Support</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white transition">Login</Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-400 hover:text-white transition">Sign Up</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition">Dashboard</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <span className="font-medium text-white">Emergency:</span> 112
              </li>
              <li className="text-gray-400">
                <span className="font-medium text-white">Police:</span> 100
              </li>
              <li className="text-gray-400">
                <span className="font-medium text-white">Fire:</span> 101
              </li>
              <li className="text-gray-400">
                <span className="font-medium text-white">Ambulance:</span> 108
              </li>
              <li className="text-gray-400">
                <span className="font-medium text-white">Disaster Management:</span> 1070
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Safescape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;