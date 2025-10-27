import React from 'react';
import { FiHeart, FiGithub, FiTwitter, FiExternalLink } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>© {currentYear} Result Extractor</span>
            <span className="hidden md:inline">•</span>
            <span>Built with <FiHeart className="inline text-red-400" /> by </span>
            <a 
              href="https://absyd.xyz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center"
            >
              Abu Sayed <FiExternalLink className="ml-1 w-3 h-3" />
            </a>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a 
              href="https://github.com/yourusername/result-extractor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-400 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="w-5 h-5" />
            </a>
            <a 
              href="https://beta-rpicc.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors"
              aria-label="RPICC"
            >
              <span className="sr-only">RPICC</span>
              <img 
                src="https://beta-rpicc.vercel.app/assets/rpicc-logo-DzLRc93w.png" 
                alt="RPICC" 
                className="h-5 w-5 rounded-sm"
              />
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center md:text-left">
          <p className="text-xs text-gray-500">
            Open source project. Feel free to contribute and improve!
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;