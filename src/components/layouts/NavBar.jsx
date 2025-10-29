import React, { useState } from 'react';
import { FiExternalLink, FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router';
import ABSYD_LOGO from "../../assets/absyd_logo.png";

const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Extractor', to: '/extract' },
    { name: 'Report', to: '/reports' },
    { 
      name: 'Abu Sayed', 
      href: 'https://absyd.xyz/',
      icon: <FiExternalLink className="w-3 h-3" />
    },
    { 
      name: 'RPICC', 
      href: 'https://beta-rpicc.vercel.app/',
      icon: <FiExternalLink className="w-3 h-3" />
    }
  ];

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="flex items-center space-x-2">
                <img 
                  className="h-8 w-auto" 
                  src="https://beta-rpicc.vercel.app/assets/rpicc-logo-DzLRc93w.png" 
                  alt="RPICC Logo" 
                />
                <img 
                  className="h-8 w-auto" 
                  src={ABSYD_LOGO} 
                  alt="ABSYD Logo" 
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                RPICCxABSYD
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-6 flex items-center space-x-1">
              {navLinks.map((item, index) => (
                item.href ? (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:bg-gray-800/50 hover:text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all duration-200"
                  >
                    {item.name}
                    {item.icon}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.to}
                    className="text-gray-300 hover:bg-gray-800/50 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => (
              item.href ? (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                  {item.icon}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.to}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;