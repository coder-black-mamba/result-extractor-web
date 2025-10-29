import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import Home from "./pages/Home";
import CheckResult from "./components/result_/CheckResult";
import BaseLayout from "./layouts/BaseLayout";
import ResultExtractor from "./pages/ResultExtractor";
import Reports from "./pages/Reports";
import ReactGA from "react-ga4";

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);
}
function App() {
  usePageTracking();
  return (
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<Home />} />
          <Route path="result" element={<CheckResult />} />
          <Route path="extract" element={<ResultExtractor />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
  );
}

export default App;
