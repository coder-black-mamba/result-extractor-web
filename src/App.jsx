import { useState, useEffect } from 'react';
import ExtractorMain from './components/extractor/ExtractorMain';
import NavBar from './components/layouts/NavBar';
import Footer from './components/layouts/Footer';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Navigation */}
      <div className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/90 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <NavBar />
      </div>
      
      {/* Main Content */}
      <main className="flex-grow pt-20">
        <div className="relative">
          {/* Subtle background elements */}
          <div className="fixed inset-0 -z-10">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/5 via-transparent to-cyan-900/5"></div>
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,white,transparent)]"></div>
            
            {/* Glow effects */}
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-1/2 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          {/* Main content container */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            
            {/* Extractor component */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
              <ExtractorMain />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
