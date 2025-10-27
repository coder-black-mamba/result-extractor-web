import { useState, useEffect } from 'react';
import ExtractorMain from './components/extractor/ExtractorMain';
import NavBar from './components/layouts/NavBar';
import Footer from './components/layouts/Footer';
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from './components/Home';
import CheckResult from './components/result_/CheckResult';

function App() {


  return (
   <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<CheckResult />} />
    </Routes>
   </Router>
  );
}

export default App;
