import React from 'react';
import { Link } from 'react-router';
import { FiDownload, FiBarChart2, FiSearch, FiCheckCircle, FiUsers, FiInfo, FiCode } from 'react-icons/fi';
import CheckResult from '../components/result_/CheckResult';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main Content */}
        <div className="my-5">
          <CheckResult />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <Link 
            to="/extract" 
            className="group bg-gray-800/60 hover:bg-gray-700/80 transition-all duration-300 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col items-center text-center"
          >
            <div className="p-4 rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors mb-4">
              <FiDownload className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Result Extractor</h3>
            <p className="text-gray-300 text-sm">Extract and process examination results with ease</p>
            <div className="mt-4 text-xs text-blue-400 group-hover:opacity-100 transition-opacity flex items-center">
              Get started <span className="ml-1">→</span>
            </div>
          </Link>
          
          <Link 
            to="/reports" 
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

        {/* Features Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-2">
            <FiCheckCircle className="text-blue-400" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Easy Result Extraction",
                description: "Quickly extract results using roll numbers or registration numbers",
                icon: <FiDownload className="text-blue-400" />
              },
              {
                title: "Detailed Analytics",
                description: "Comprehensive result analysis with visual charts and statistics",
                icon: <FiBarChart2 className="text-emerald-400" />
              },
              {
                title: "Advanced Filtering",
                description: "Filter results by department, semester, and performance metrics",
                icon: <FiSearch className="text-purple-400" />
              },
              {
                title: "Performance Tracking",
                description: "Track student performance across multiple semesters",
                icon: <FiBarChart2 className="text-yellow-400" />
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="max-w-4xl mx-auto mb-16 bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FiInfo className="text-blue-400" />
            How to Use
          </h2>
          <div className="space-y-4">
            {[
              "1. Enter roll numbers or registration numbers in the search bar above",
              "2. Click 'Extract Results' to process the data",
              "3. View detailed results and download them if needed",
              "4. Use the analytics dashboard for in-depth performance analysis"
            ].map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400 text-xs mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
            <FiUsers className="text-blue-400" />
            Built with ❤️ by <a href="https://absyd.xyz" className='text-blue-400 hover:underline'>Abu Sayed</a> And <a href="https://beta-rpicc.vercel.app" className='text-blue-400 hover:underline'>RPICC</a>
          </h2>
          <p className="text-gray-300 mb-8">
            This result extraction and analysis tool was developed to streamline the examination result 
            management process for both students and faculty members.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="https://github.com/abusayed/result-extractor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-200 transition-colors"
            >
              <FiCode />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-400 text-sm pb-8">
          <p>© {new Date().getFullYear()} RPI Result Portal. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;