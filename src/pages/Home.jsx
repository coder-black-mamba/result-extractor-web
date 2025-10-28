import React from 'react';
import { Link } from 'react-router';
import { FiDownload, FiBarChart2, FiSearch } from 'react-icons/fi';
import CheckResult from '../components/result_/CheckResult';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        {/* <header className="text-center mb-12 pt-8 sm:pt-16">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            RPI Result Portal
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Streamlined result management system for students and faculty
          </p>
        </header> */}

       <div className="my-5">
            <CheckResult />
       </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link 
              to="/extract" 
              className="group bg-gray-800/60 hover:bg-gray-700/80 transition-all duration-300 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col items-center text-center"
            >
              <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors mb-4">
                <FiDownload className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Result Extractor</h3>
              <p className="text-gray-300 text-sm">Extract and process examination results with ease</p>
              <div className="mt-4 text-xs text-blue-400   group-hover:opacity-100 transition-opacity flex items-center">
                Get started <span className="ml-1">→</span>
              </div>
            </Link>
            
            <Link 
              to="/report" 
              className="group bg-gray-800/60 hover:bg-gray-700/80 transition-all duration-300 rounded-2xl p-6 border border-gray-700/50 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col items-center text-center"
            >
              <div className="p-4 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors mb-4">
                <FiBarChart2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Result Analytics</h3>
              <p className="text-gray-300 text-sm">View and analyze detailed result statistics</p>
              <div className="mt-4 text-xs text-emerald-400 group-hover:opacity-100 transition-opacity flex items-center">
                View reports <span className="ml-1">→</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 text-sm pb-8">
          <p>© {new Date().getFullYear()} RPI Result Portal. All rights reserved.</p>
        </footer>
      </div>
  );
};

export default Home;