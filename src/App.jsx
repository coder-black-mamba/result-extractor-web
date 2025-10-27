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
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Navigation */}
      <div className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm shadow-lg border-b border-rose-900/30' : 'bg-transparent'
      }`}>
        <NavBar />
      </div>
      
      {/* Main Content */}
      <main className="flex-grow pt-20">
        <div className="relative">
          {/* Subtle background elements */}

          
          {/* Main content container */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Extractor component */}
            <div className=" ">
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
