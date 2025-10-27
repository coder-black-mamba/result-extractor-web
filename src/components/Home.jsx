import React, { useState, useEffect } from "react";
import NavBar from "./layouts/NavBar";
import Footer from "./layouts/Footer";
import ExtractorMain from "./extractor/ExtractorMain";
import { Link } from "react-router";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      {/* Navigation */}
      <div
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-black/90 backdrop-blur-sm shadow-lg border-b border-rose-900/30"
            : "bg-transparent"
        }`}
      >
        <NavBar />
      </div>

      {/* Main Content */}
      <main className="flex-grow pt-20">

        {/* Main content container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Extractor component */}
          <div className=" ">
            <div className="my-2 text-center"> <Link
          to="/result"
          className=" mx-auto inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 mb-8"
        >
          <span>Check Your Result</span>
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link></div>
            <ExtractorMain />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
