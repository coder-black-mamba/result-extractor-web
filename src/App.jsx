import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Home from "./pages/Home";
import CheckResult from "./components/result_/CheckResult";
import BaseLayout from "./layouts/BaseLayout";
import ResultExtractor from "./pages/ResultExtractor";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="result" element={<CheckResult />} />
          <Route path="extract" element={<ResultExtractor />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
