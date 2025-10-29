import React from "react";
import { Heart } from "lucide-react";
import ABSYD_LOGO from "../assets/absyd_logo.png";

const CreditBig = () => {
  return (
    <div className="my-5">

    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-900 via-sky-800 to-blue-900 rounded-2xl shadow-xl text-white my-20">
      
      {/* Logos Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-4">
          <img
            src="https://beta-rpicc.vercel.app/assets/rpicc-logo-DzLRc93w.png"
            alt="RPICC Logo"
            className="h-20 md:h-24 w-auto"
          />
          <span className="text-2xl font-extrabold text-gray-300">x</span>
          <img
            src={ABSYD_LOGO}
            alt="ABSYD Logo"
            className="h-20 md:h-24 w-auto"
            />
        </div>
      </div>

      {/* Text Section */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          RPICC<span className="text-rose-400 font-semibold">x</span>ABSYD
        </h2>
        
      </div>

      {/* Footer Note */}
      <p className="text-gray-500 text-xs mt-6 text-center">
        &copy; {new Date().getFullYear()} RPICC & Abu Sayed. All rights reserved.
      </p>
    </div>

    <div className="my-3 text-center">
      <p className="text-gray-400 text-md md:text-lg">
          This project is a joint effort between <span className="text-blue-400 font-semibold">RPI Computer Club</span> and <span className="text-blue-400 font-semibold">Abu Sayed</span>.
        </p>

        <p className="text-gray-400 text-sm md:text-md">
          Built for <span className="text-green-400 font-semibold">better education</span> and <span className="text-red-400 font-semibold flex items-center justify-center gap-1 inline-flex">with <Heart className="w-4 h-4 text-red-500" /> love</span>
        </p>

        {/* Links */}
        <div className="flex justify-center gap-6 mt-4 text-center mx-auto">
          <a
            href="https://beta-rpicc.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            RPICC Website
          </a>
          <a
            href="https://absyd.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            absyd.xyz
          </a>
        </div>
    </div>
    
      </div>
  );
};

export default CreditBig;
