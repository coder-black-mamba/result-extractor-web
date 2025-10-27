import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function App() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);

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

  const handleProcess = () => {
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
    XLSX.writeFile(wb, "StudentResults.xlsx");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-emerald-400">
        🎓 GPA Result Parser
      </h1>

      <textarea
        rows="10"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste multiple student records here..."
        className="w-full max-w-3xl p-3 rounded-lg text-white"
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleProcess}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Process
        </button>

        <button
          onClick={handleExportExcel}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
        >
          Export to Excel
        </button>
      </div>

      {data.length > 0 && (
        <div className="mt-6 w-full max-w-4xl overflow-auto">
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-700">
                <th className="border border-gray-600 px-3 py-2">Roll</th>
                <th className="border border-gray-600 px-3 py-2">GPA1</th>
                <th className="border border-gray-600 px-3 py-2">GPA2</th>
                <th className="border border-gray-600 px-3 py-2">GPA3</th>
                <th className="border border-gray-600 px-3 py-2">GPA4</th>
                <th className="border border-gray-600 px-3 py-2">GPA5</th>
                <th className="border border-gray-600 px-3 py-2">GPA6</th>
                <th className="border border-gray-600 px-3 py-2">GPA7</th>
                <th className="border border-gray-600 px-3 py-2">GPA8</th>
                <th className="border border-gray-600 px-3 py-2">Status</th>
                <th className="border border-gray-600 px-3 py-2">Failed Subs</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="even:bg-gray-800 odd:bg-gray-900">
                  <td className="border border-gray-700 px-3 py-2">{row.Roll}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA1}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA2}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA3}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA4}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA5}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA6}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA7}</td>
                  <td className="border border-gray-700 px-3 py-2">{row.GPA8}</td>
                  <td
                    className={`border border-gray-700 px-3 py-2 ${
                      row.Status === "Drop" ? "text-red-500 font-bold" : ""
                    }`}
                  >
                    {row.Status}
                  </td>
                  <td className="border border-gray-700 px-3 py-2">
                    {row["Failed Subs"]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
