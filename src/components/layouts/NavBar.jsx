import React from 'react';
import { FiExternalLink } from 'react-icons/fi';
import ABSYD_LOGO from "../../assets/absyd_logo.png";
import { Link } from 'react-router';

const NavBar = () => {
  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
            <div className="flex-shrink-0 flex items-center">
              <img 
                className="h-8 w-auto" 
                src="https://beta-rpicc.vercel.app/assets/rpicc-logo-DzLRc93w.png" 
                alt="RPICC Logo" 
              />
              <img 
                className="h-8 w-auto" 
                src={ABSYD_LOGO} 
                alt="RPICC Logo" 
              />
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                RPICC Result Extractor
              </span>
            </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <a 
                href="https://absyd.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
              >
                Abu Sayed
                <FiExternalLink className="w-3 h-3" />
              </a>
              <span className="text-gray-500">|</span>
              <a 
                href="https://beta-rpicc.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
              >
                RPICC
                <FiExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex items-center space-x-2">
              <a 
                href="https://absyd.xyz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 p-2 rounded-full"
                aria-label="Abu Sayed"
              >
                <span className="sr-only">Abu Sayed</span>
                <FiExternalLink className="w-5 h-5" />
              </a>
              <a 
                href="https://beta-rpicc.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 p-2 rounded-full"
                aria-label="RPICC"
              >
                <span className="sr-only">RPICC</span>
                <FiExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;