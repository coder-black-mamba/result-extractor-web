import React, { useState } from "react";
import * as XLSX from "xlsx";
import { FiUpload, FiDownload, FiLoader, FiInfo, FiTrash2 } from "react-icons/fi";
import SubName from "./SubName";

export default function GPAResultParser() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const studentRegex = /\d{6}\s*(\(([\s\S]*?)\)|\{([\s\S]*?)\})/gm;

  // const handleProcess = () => {
  //   const matches = [...input.matchAll(studentRegex)];
  //   const results = matches.map((m) => {
  //     const roll = m[0].match(/^\d{6}/)[0];
  //     const content = m[2] || m[3];

  //     // Case: Drop — content does NOT contain GPA
  //     if (!/gpa/i.test(content)) {
  //       const failedSubs = content
  //         .split(",")
  //         .map((s) => s.trim())
  //         .filter(Boolean);

  //       return {
  //         Roll: roll,
  //         GPA1: "-",
  //         GPA2: "-",
  //         GPA3: "-",
  //         GPA4: "-",
  //         GPA5: "-",
  //         GPA6: "-",
  //         GPA7: "-",
  //         GPA8: "-",
  //         Status: "Drop",
  //         "Failed Subs": failedSubs.join(", "),
  //       };
  //     }

  //     // Case: Failed or Passed — content contains GPA
  //     const gpaPattern = /gpa(\d+):\s*([\d.]+|ref)/gi;
  //     const gpas = {};
  //     const failedGPA = [];

  //     for (const g of content.matchAll(gpaPattern)) {
  //       const num = g[1];
  //       const val = g[2];
  //       gpas[`GPA${num}`] = val;
  //       if (val.toLowerCase() === "ref") failedGPA.push(`GPA${num}`);
  //     }

  //     // Fill missing GPA fields up to GPA8
  //     for (let i = 1; i <= 8; i++) {
  //       if (!gpas[`GPA${i}`]) gpas[`GPA${i}`] = "-";
  //     }

  //     // Extract failed subjects if any
  //     const refMatch = content.match(/ref_sub:\s*([^}]*)/i);
  //     const failedSubs = refMatch
  //       ? refMatch[1].trim().replace(/\s+/g, " ")
  //       : failedGPA.length > 0
  //       ? failedGPA.join(", ")
  //       : "-";

  //     // Determine status
  //     const status =
  //       failedSubs.split(",").length >= 4 ? "Drop" : failedGPA.length > 0 ? "Failed" : "Passed";

  //     return {
  //       Roll: roll,
  //       ...gpas,
  //       Status: status,
  //       "Failed Subs": failedSubs,
  //     };
  //   });

  //   setData(results);
  // };

  const handleProcess = async () => {
  if (!input.trim()) return;
  
  setIsProcessing(true);
  
  // Simulate processing time for better UX
  await new Promise(resolve => setTimeout(resolve, 300));
  
  try {
    const matches = [...input.matchAll(studentRegex)];
    const results = matches.map((m) => {
    const roll = m[0].match(/^\d{6}/)[0];
    const content = m[2] || m[3];

    const hasGPA = /gpa/i.test(content); // check if GPA exists

    // Case: Drop — no GPA
    if (!hasGPA) {
      const failedSubsList = content
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        Roll: roll,
        GPA1: "-",
        GPA2: "-",
        GPA3: "-",
        GPA4: "-",
        GPA5: "-",
        GPA6: "-",
        GPA7: "-",
        GPA8: "-",
        Status: "Drop",
        "Failed Subs": failedSubsList.join(", "),
      };
    }

    // Case: Failed or Passed — GPA exists
    const gpaPattern = /gpa(\d+):\s*([\d.]+|ref)/gi;
    const gpas = {};
    const failedGPA = [];

    for (const g of content.matchAll(gpaPattern)) {
      const num = g[1];
      const val = g[2];
      gpas[`GPA${num}`] = val;
      if (val.toLowerCase() === "ref") failedGPA.push(`GPA${num}`);
    }

    // Fill missing GPA fields up to GPA8
    for (let i = 1; i <= 8; i++) {
      if (!gpas[`GPA${i}`]) gpas[`GPA${i}`] = "-";
    }

    // Extract failed subjects if any
    const refMatch = content.match(/ref_sub:\s*([^}]*)/i);
    const failedSubs = refMatch
      ? refMatch[1].trim().replace(/\s+/g, " ")
      : failedGPA.length > 0
      ? failedGPA.join(", ")
      : "-";

    const status = failedGPA.length > 0 ? "Failed" : "Passed";

    return {
      Roll: roll,
      ...gpas,
      Status: status,
      "Failed Subs": failedSubs,
    };
    });

    setData(results);
  } catch (error) {
    console.error("Error processing data:", error);
    alert("An error occurred while processing the data. Please check your input format.");
  } finally {
    setIsProcessing(false);
  }
};

  const handleExportExcel = () => {
    if (data.length === 0) return;
    
    // Add footer row to data
    const dataWithFooter = [...data, {}];
    
    const ws = XLSX.utils.json_to_sheet(dataWithFooter, { skipHeader: true });
    
    // Add header row
    XLSX.utils.sheet_add_aoa(ws, [[...Object.keys(data[0])]], { origin: 'A1' });
    
    // Add footer text to the first cell of the last row
    const lastRow = data.length + 1; // +1 for header row
    XLSX.utils.sheet_add_aoa(ws, [["Built With ❤️ By Abu Sayed [absyd.xyz] and RPICC[beta-rpicc.vercel.app]"]], {
      origin: `A${lastRow + 1}`
    });
    
    // Merge footer cells for better appearance
    if (!ws['!merges']) ws['!merges'] = [];
    ws['!merges'].push({ s: { r: lastRow, c: 0 }, e: { r: lastRow, c: Object.keys(data[0]).length - 1 } });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    const now = new Date();
    const filename = `rpicc-results-${now.toISOString().slice(0, 10).replace(/-/g, "")}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  
  const handleExportJson = () => {
    if (data.length === 0) return;

    const now = new Date();
    const filename = `rpicc-results-${now.toISOString().slice(0, 10).replace(/-/g, "")}.json`;
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  

  return (
    <div className="min-h-screen  ">
      <div className="container mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            🎓 GPA Result Parser
          </h1>
          <p className="text-gray-400">Process and analyze student GPA data with ease</p>
        </header>

        {/* Main Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50 mb-8">
          {/* Input Section */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-emerald-300">Input Data</h2>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-gray-400 hover:text-emerald-400 transition-colors"
                aria-label="Show help"
              >
                <FiInfo size={20} />
              </button>
            </div>
            
            {showHelp && (
              <div className="bg-gray-900/50 p-4 rounded-lg mb-4 text-sm text-gray-300 border border-emerald-400/20">
                <h3 className="font-semibold text-emerald-300 mb-2">How to use:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Paste your student data in the text area below</li>
                  <li>Format: <code className="bg-gray-700 px-1.5 py-0.5 rounded">
                    123456{`{gpa1: 3.5, gpa2: 3.2, ...}`}
                  </code></li>
                  <li>Click &quot;Process&quot; to analyze the data</li>
                  <li>Export results to Excel when ready</li>
                </ul>
              </div>
            )}

            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your student data here..."
                className="w-full min-h-[200px] p-4 rounded-lg bg-gray-900/50 border-2 border-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-gray-100 placeholder-gray-500 transition-all duration-200 resize-none"
                disabled={isProcessing}
              />
              {!input && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center p-4 bg-gradient-to-r from-transparent via-gray-900/50 to-transparent w-full">
                    <FiUpload className="mx-auto mb-2 text-gray-600" size={24} />
                    <p className="text-gray-500 text-sm">Paste your data or click to type</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={handleProcess}
                disabled={!input.trim() || isProcessing}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  !input.trim() || isProcessing
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
                }`}
              >
                {isProcessing ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FiUpload />
                    Process Data
                  </>
                  
                )}
              </button>
                <button
                    onClick={handleExportJson}
                    disabled={!data.length || isProcessing}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      !data.length || isProcessing
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30'
                    }`}
                  >
                    <FiDownload />
                    Export JSON
                  </button> 
              <button
                onClick={() => setInput("")}
                disabled={!input}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <FiTrash2 size={16} />
                Clear
              </button>

              {data.length > 0 && (
                <button
                  onClick={handleExportExcel}
                  className="ml-auto flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  <FiDownload />
                  Export to Excel
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          {data.length > 0 && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-emerald-300">Results</h2>
                <span className="text-sm text-gray-400">
                  {data.length} {data.length === 1 ? 'record' : 'records'} found
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-700">
                <div className="min-w-full">
                  <div className="bg-gray-900/50">
                    <div className="grid grid-cols-12 gap-0">
                      {Object.keys(data[0]).map((key) => (
                        <div 
                          key={key}
                          className={`px-4 py-3 text-left text-xs font-medium text-emerald-300 uppercase tracking-wider ${
                            key === 'Status' ? 'col-span-2' : 'col-span-1'
                          }`}
                        >
                          {key}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="divide-y divide-gray-800">
                    {data.map((row, i) => (
                      <div 
                        key={i} 
                        className={`${
                          row.Status === "Drop" 
                            ? 'bg-red-900/10 hover:bg-red-900/20' 
                            : 'hover:bg-gray-800/50'
                        } transition-colors`}
                      >
                        <div className="grid grid-cols-12 gap-0">
                          {Object.entries(row).map(([key, value]) => (
                            <div 
                            key={key}
                              className={`p-3 text-sm ${
                                key === 'Status' 
                                  ? 'col-span-2 font-medium' 
                                  : 'col-span-1'
                              } ${
                                key === 'Status' 
                                  ? row.Status === 'Drop' 
                                    ? 'text-red-400' 
                                    : row.Status === 'Failed'
                                    ? 'text-yellow-400'
                                    : 'text-emerald-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              {value}
                            </div>
                          ))}
                          <SubName subject={row["Failed Subs"]} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-12">
          <p>GPA Result Parser • {new Date().getFullYear()} • Built with ❤️ by <a href="https://absyd.xyz" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Abu Sayed</a> and <a href="https://beta-rpicc.vercel.app" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">RPICC</a></p>
        </footer>
      </div>
    </div>
  );
}
