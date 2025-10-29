import React, { useMemo, useState, useRef } from "react";
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertCircle,
  Users,
  BookOpen,
  Target,
  Activity,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

const ResultAnalytics = ({ data }) => {
  const [selectedView, setSelectedView] = useState("overview");
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;

    // Basic counts
    const deptCounts = data.reduce((acc, student) => {
      const dept = student["dept/sem/shift"]?.split("/")[0] || "Unknown";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});

    const shiftCounts = data.reduce((acc, student) => {
      const shift = student["dept/sem/shift"]?.split("/")[2] || "Unknown";
      acc[shift] = (acc[shift] || 0) + 1;
      return acc;
    }, {});

    const resultStats = data.reduce(
      (acc, student) => {
        if (!student.result) {
          acc.dropped++;
        } else if (student.result.Status === "Passed") {
          acc.passed++;
        } else if (student.result.Status === "Failed") {
          acc.failed++;
        } else {
          acc.dropped++;
        }
        return acc;
      },
      { passed: 0, failed: 0, dropped: 0 }
    );

    const semesterCounts = data.reduce((acc, student) => {
      const sem = student["dept/sem/shift"]?.split("/")[1] || "Unknown";
      acc[sem] = (acc[sem] || 0) + 1;
      return acc;
    }, {});

    // GPA Analysis - only for students with results
    const studentsWithResults = data.filter(
      (s) => s.result && s.result.Status !== "Drop"
    );
    const gpaAnalysis = studentsWithResults.reduce((acc, student) => {
      if (!student.result) return acc;

      for (let i = 1; i <= 8; i++) {
        const gpaKey = `GPA${i}`;
        const gpa = student.result[gpaKey];
        if (gpa && gpa !== "-" && gpa !== "ref") {
          const gpaNum = parseFloat(gpa);
          if (!isNaN(gpaNum)) {
            if (!acc[gpaKey]) acc[gpaKey] = [];
            acc[gpaKey].push(gpaNum);
          }
        }
      }
      return acc;
    }, {});

    const gpaStats = Object.entries(gpaAnalysis)
      .map(([sem, gpas]) => {
        const sorted = [...gpas].sort((a, b) => a - b);
        const avg = gpas.reduce((sum, g) => sum + g, 0) / gpas.length;
        return {
          semester: sem,
          average: avg,
          highest: Math.max(...gpas),
          lowest: Math.min(...gpas),
          median: sorted[Math.floor(sorted.length / 2)],
          count: gpas.length,
        };
      })
      .sort((a, b) => {
        const semA = parseInt(a.semester.replace("GPA", ""));
        const semB = parseInt(b.semester.replace("GPA", ""));
        return semA - semB;
      });

    // Failed subjects analysis
    const failedSubjects = {};
    data.forEach((student) => {
      if (
        student.result &&
        student.result["Failed Subs"] &&
        student.result["Failed Subs"] !== "-"
      ) {
        const subs = student.result["Failed Subs"].split(", ");
        subs.forEach((sub) => {
          const code = sub.trim();
          failedSubjects[code] = (failedSubjects[code] || 0) + 1;
        });
      }
    });

    const topFailedSubjects = Object.entries(failedSubjects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Performance distribution
    const performanceDistribution = studentsWithResults.reduce(
      (acc, student) => {
        if (!student.result) return acc;

        // Calculate average GPA for student
        let totalGPA = 0;
        let count = 0;
        for (let i = 1; i <= 8; i++) {
          const gpa = student.result[`GPA${i}`];
          if (gpa && gpa !== "-" && gpa !== "ref") {
            const gpaNum = parseFloat(gpa);
            if (!isNaN(gpaNum)) {
              totalGPA += gpaNum;
              count++;
            }
          }
        }

        if (count > 0) {
          const avgGPA = totalGPA / count;
          if (avgGPA >= 3.5) acc.excellent++;
          else if (avgGPA >= 3.0) acc.good++;
          else if (avgGPA >= 2.5) acc.average++;
          else acc.poor++;
        }

        return acc;
      },
      { excellent: 0, good: 0, average: 0, poor: 0 }
    );

    // Session analysis
    const sessionCounts = data.reduce((acc, student) => {
      const session = student.session || "Unknown";
      acc[session] = (acc[session] || 0) + 1;
      return acc;
    }, {});

    // Pass/Fail by shift
    const shiftPerformance = data.reduce((acc, student) => {
      const shift = student["dept/sem/shift"]?.split("/")[2] || "Unknown";
      if (!acc[shift]) acc[shift] = { passed: 0, failed: 0, dropped: 0 };

      if (!student.result) {
        acc[shift].dropped++;
      } else if (student.result.Status === "Passed") {
        acc[shift].passed++;
      } else if (student.result.Status === "Failed") {
        acc[shift].failed++;
      } else {
        acc[shift].dropped++;
      }
      return acc;
    }, {});

    // Students with most failures
    const studentFailures = data
      .filter((s) => s.result && s.result.Status === "Failed")
      .map((s) => {
        const failedCount =
          s.result["Failed Subs"] && s.result["Failed Subs"] !== "-"
            ? s.result["Failed Subs"].split(", ").length
            : 0;
        return {
          name: s.name,
          roll: s.roll,
          failedCount,
          subjects: s.result["Failed Subs"],
        };
      })
      .sort((a, b) => b.failedCount - a.failedCount)
      .slice(0, 10);

    // Top performers
    const topPerformers = studentsWithResults
      .map((student) => {
        let totalGPA = 0;
        let count = 0;
        for (let i = 1; i <= 8; i++) {
          const gpa = student.result[`GPA${i}`];
          if (gpa && gpa !== "-" && gpa !== "ref") {
            const gpaNum = parseFloat(gpa);
            if (!isNaN(gpaNum)) {
              totalGPA += gpaNum;
              count++;
            }
          }
        }
        return {
          name: student.name,
          roll: student.roll,
          avgGPA: count > 0 ? (totalGPA / count).toFixed(2) : 0,
          count,
        };
      })
      .filter((s) => s.count > 0)
      .sort((a, b) => parseFloat(b.avgGPA) - parseFloat(a.avgGPA))
      .slice(0, 10);

    const total = data.length;
    const passedPercentage = total > 0 ? (resultStats.passed / total) * 100 : 0;
    const failedPercentage = total > 0 ? (resultStats.failed / total) * 100 : 0;
    const droppedPercentage = 100 - passedPercentage - failedPercentage;

    return {
      totalStudents: total,
      deptCounts,
      shiftCounts,
      resultStats,
      semesterCounts,
      sessionCounts,
      passedPercentage,
      failedPercentage,
      droppedPercentage,
      gpaStats,
      topFailedSubjects,
      performanceDistribution,
      shiftPerformance,
      studentFailures,
      topPerformers,
    };
  }, [data]);
  const exportToPDF = async () => {
    if (!reportRef.current) return;

    setLoading(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#111827",
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);

      // Add footer with credit
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `Generated by RPI Result Analyzer - ${new Date().toLocaleDateString()}`,
          pdf.internal.pageSize.getWidth() / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      pdf.save(
        `RPI-Result-Analysis-${new Date().toISOString().split("T")[0]}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }
 
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg shadow-lg mb-6 border border-gray-800 p-6 my-5">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          Result Analytics Dashboard
        </h2>
        <button
          onClick={exportToPDF}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>

      <div ref={reportRef} className="report-content">
        {/* Your existing dashboard content goes here */}
        {/* Keep all your existing JSX for the analytics dashboard */}
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg mb-6 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-7 h-7" />
              Comprehensive Result Analytics
            </h2>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="gpa">GPA Analysis</option>
              <option value="subjects">Subject Analysis</option>
              <option value="students">Student Performance</option>
            </select>
          </div>

          {selectedView === "overview" && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-4 rounded-lg border border-blue-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-300" />
                    <h3 className="text-sm font-medium text-blue-300">
                      Total Students
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.totalStudents}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-900 to-green-800 p-4 rounded-lg border border-green-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-green-300" />
                    <h3 className="text-sm font-medium text-green-300">
                      Passed
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.resultStats.passed}
                    <span className="text-sm font-normal text-green-300 ml-2">
                      ({Math.round(stats.passedPercentage)}%)
                    </span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-900 to-red-800 p-4 rounded-lg border border-red-700">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-300" />
                    <h3 className="text-sm font-medium text-red-300">Failed</h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.resultStats.failed}
                    <span className="text-sm font-normal text-red-300 ml-2">
                      ({Math.round(stats.failedPercentage)}%)
                    </span>
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-900 to-yellow-800 p-4 rounded-lg border border-yellow-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-yellow-300" />
                    <h3 className="text-sm font-medium text-yellow-300">
                      Dropped
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.resultStats.dropped}
                    <span className="text-sm font-normal text-yellow-300 ml-2">
                      ({Math.round(stats.droppedPercentage)}%)
                    </span>
                  </p>
                </div>
              </div>

              {/* Performance Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance Distribution
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-green-400">
                          Excellent (≥3.5 GPA)
                        </span>
                        <span className="text-gray-300">
                          {stats.performanceDistribution.excellent} students
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-green-500 h-3 rounded-full"
                          style={{
                            width: `${
                              (stats.performanceDistribution.excellent /
                                stats.totalStudents) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-blue-400">
                          Good (3.0-3.49 GPA)
                        </span>
                        <span className="text-gray-300">
                          {stats.performanceDistribution.good} students
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-blue-500 h-3 rounded-full"
                          style={{
                            width: `${
                              (stats.performanceDistribution.good /
                                stats.totalStudents) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-yellow-400">
                          Average (2.5-2.99 GPA)
                        </span>
                        <span className="text-gray-300">
                          {stats.performanceDistribution.average} students
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-yellow-500 h-3 rounded-full"
                          style={{
                            width: `${
                              (stats.performanceDistribution.average /
                                stats.totalStudents) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-red-400">Poor (&lt;2.5 GPA)</span>
                        <span className="text-gray-300">
                          {stats.performanceDistribution.poor} students
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="bg-red-500 h-3 rounded-full"
                          style={{
                            width: `${
                              (stats.performanceDistribution.poor /
                                stats.totalStudents) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result Overview Donut */}
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Result Overview
                  </h3>
                  <div className="flex justify-center items-center h-64">
                    <div className="relative w-48 h-48">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="15"
                        />
                        {(() => {
                          const radius = 40;
                          const circumference = 2 * Math.PI * radius;
                          const passedLength =
                            (stats.passedPercentage / 100) * circumference;
                          const failedLength =
                            (stats.failedPercentage / 100) * circumference;
                          const droppedLength =
                            (stats.droppedPercentage / 100) * circumference;

                          return (
                            <>
                              {stats.passedPercentage > 0 && (
                                <circle
                                  cx="50"
                                  cy="50"
                                  r={radius}
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="15"
                                  strokeDasharray={`${passedLength} ${
                                    circumference - passedLength
                                  }`}
                                  strokeDashoffset={circumference / 4}
                                  transform="rotate(-90 50 50)"
                                />
                              )}
                              {stats.failedPercentage > 0 && (
                                <circle
                                  cx="50"
                                  cy="50"
                                  r={radius}
                                  fill="none"
                                  stroke="#ef4444"
                                  strokeWidth="15"
                                  strokeDasharray={`${failedLength} ${
                                    circumference - failedLength
                                  }`}
                                  strokeDashoffset={
                                    circumference / 4 - passedLength
                                  }
                                  transform="rotate(-90 50 50)"
                                />
                              )}
                              {stats.droppedPercentage > 0 && (
                                <circle
                                  cx="50"
                                  cy="50"
                                  r={radius}
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="15"
                                  strokeDasharray={`${droppedLength} ${
                                    circumference - droppedLength
                                  }`}
                                  strokeDashoffset={
                                    circumference / 4 -
                                    passedLength -
                                    failedLength
                                  }
                                  transform="rotate(-90 50 50)"
                                />
                              )}
                            </>
                          );
                        })()}
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xl font-bold"
                          fill="#ffffff"
                        >
                          {Math.round(stats.passedPercentage)}%
                        </text>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-300">
                        Passed ({stats.resultStats.passed})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-300">
                        Failed ({stats.resultStats.failed})
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-xs text-gray-300">
                        Dropped ({stats.resultStats.dropped})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shift Performance */}
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Performance by Shift
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(stats.shiftPerformance).map(
                    ([shift, perf]) => {
                      const total = perf.passed + perf.failed + perf.dropped;
                      const passRate =
                        total > 0
                          ? ((perf.passed / total) * 100).toFixed(1)
                          : 0;
                      return (
                        <div key={shift} className="bg-gray-700 p-4 rounded-lg">
                          <h4 className="font-semibold text-white mb-3">
                            Shift {shift}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-green-400">Passed:</span>
                              <span className="text-white">{perf.passed}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-red-400">Failed:</span>
                              <span className="text-white">{perf.failed}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-yellow-400">Dropped:</span>
                              <span className="text-white">{perf.dropped}</span>
                            </div>
                            <div className="pt-2 border-t border-gray-600">
                              <div className="flex justify-between text-sm font-semibold">
                                <span className="text-blue-400">
                                  Pass Rate:
                                </span>
                                <span className="text-white">{passRate}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Department and Semester */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Department Distribution
                  </h3>
                  {Object.entries(stats.deptCounts).map(([dept, count]) => (
                    <div key={dept} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-300">
                          {dept || "Unknown"}
                        </span>
                        <span className="text-gray-400">
                          {count} (
                          {((count / stats.totalStudents) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(count / stats.totalStudents) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-white">
                    Semester Distribution
                  </h3>
                  {Object.entries(stats.semesterCounts).map(([sem, count]) => (
                    <div key={sem} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-300">
                          Semester {sem || "N/A"}
                        </span>
                        <span className="text-gray-400">
                          {count} (
                          {((count / stats.totalStudents) * 100).toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-green-500 h-2.5 rounded-full"
                          style={{
                            width: `${(count / stats.totalStudents) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {selectedView === "gpa" && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  GPA Trends Across Semesters
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-300">
                          Semester
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Students
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Average
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Highest
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Lowest
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Median
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.gpaStats.map((stat) => (
                        <tr
                          key={stat.semester}
                          className="border-b border-gray-700 hover:bg-gray-750"
                        >
                          <td className="py-3 px-2 text-white font-medium">
                            {stat.semester}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-300">
                            {stat.count}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span
                              className={`font-semibold ${
                                stat.average >= 3.5
                                  ? "text-green-400"
                                  : stat.average >= 3.0
                                  ? "text-blue-400"
                                  : stat.average >= 2.5
                                  ? "text-yellow-400"
                                  : "text-red-400"
                              }`}
                            >
                              {stat.average.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right text-green-400 font-semibold">
                            {stat.highest.toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-right text-red-400 font-semibold">
                            {stat.lowest.toFixed(2)}
                          </td>
                          <td className="py-3 px-2 text-right text-gray-300">
                            {stat.median.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* GPA Visualization */}
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Average GPA by Semester
                </h3>
                <div className="h-64 flex items-end justify-around gap-2">
                  {stats.gpaStats.map((stat) => {
                    const height = (stat.average / 4) * 100;
                    return (
                      <div
                        key={stat.semester}
                        className="flex-1 flex flex-col items-center"
                      >
                        <div className="text-xs text-gray-400 mb-1">
                          {stat.average.toFixed(2)}
                        </div>
                        <div
                          className="w-full bg-gray-700 rounded-t relative"
                          style={{ height: `${height}%` }}
                        >
                          <div
                            className={`w-full h-full rounded-t ${
                              stat.average >= 3.5
                                ? "bg-green-500"
                                : stat.average >= 3.0
                                ? "bg-blue-500"
                                : stat.average >= 2.5
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-300 mt-2">
                          {stat.semester}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {selectedView === "subjects" && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Top 10 Most Failed Subjects
                </h3>
                <div className="space-y-3">
                  {stats.topFailedSubjects.map(([subject, count], index) => (
                    <div key={subject} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? "bg-red-600"
                            : index === 1
                            ? "bg-red-500"
                            : index === 2
                            ? "bg-red-400"
                            : "bg-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-white">
                            {subject}
                          </span>
                          <span className="text-red-400 font-semibold">
                            {count} failures
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-red-500 h-2.5 rounded-full transition-all"
                            style={{
                              width: `${
                                (count / stats.resultStats.failed) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject Failure Heatmap */}
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white">
                  Subject Failure Impact
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {stats.topFailedSubjects
                    .slice(0, 15)
                    .map(([subject, count]) => {
                      const intensity = Math.min(
                        (count / stats.resultStats.failed) * 100,
                        100
                      );
                      return (
                        <div
                          key={subject}
                          className="p-3 rounded-lg border border-gray-700 text-center"
                          style={{
                            backgroundColor: `rgba(239, 68, 68, ${
                              intensity / 100
                            })`,
                          }}
                        >
                          <div className="text-xs font-mono text-white mb-1">
                            {subject}
                          </div>
                          <div className="text-lg font-bold text-white">
                            {count}
                          </div>
                          <div className="text-xs text-gray-300">
                            {((count / stats.resultStats.failed) * 100).toFixed(
                              1
                            )}
                            %
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {selectedView === "students" && (
            
            <div className="space-y-6">
                {/* Additional Student Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-5 rounded-lg border border-purple-700">
                  <h4 className="text-sm font-medium text-purple-300 mb-2">
                    Perfect Scores
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    {
                      stats.topPerformers.filter(
                        (s) => parseFloat(s.avgGPA) === 4.0
                      ).length
                    }
                  </p>
                  <p className="text-xs text-purple-300 mt-1">
                    Students with 4.0 GPA
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-900 to-orange-800 p-5 rounded-lg border border-orange-700">
                  <h4 className="text-sm font-medium text-orange-300 mb-2">
                    At Risk
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    {
                      stats.studentFailures.filter((s) => s.failedCount >= 4)
                        .length
                    }
                  </p>
                  <p className="text-xs text-orange-300 mt-1">
                    Failed 4+ subjects
                  </p>
                </div>
                <div className="bg-gradient-to-br from-teal-900 to-teal-800 p-5 rounded-lg border border-teal-700">
                  <h4 className="text-sm font-medium text-teal-300 mb-2">
                    Strong Performers
                  </h4>
                  <p className="text-3xl font-bold text-white">
                    {
                      stats.topPerformers.filter(
                        (s) => parseFloat(s.avgGPA) >= 3.5
                      ).length
                    }
                  </p>
                  <p className="text-xs text-teal-300 mt-1">GPA ≥ 3.5</p>
                </div>
              </div>
              {/* Top Performers */}
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Top 10 Performers
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2 text-gray-300">
                          Rank
                        </th>
                        <th className="text-left py-3 px-2 text-gray-300">
                          Roll
                        </th>
                        <th className="text-left py-3 px-2 text-gray-300">
                          Name
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Avg GPA
                        </th>
                        <th className="text-right py-3 px-2 text-gray-300">
                          Semesters
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.topPerformers.map((student, index) => (
                        <tr
                          key={student.roll}
                          className="border-b border-gray-700 hover:bg-gray-750"
                        >
                          <td className="py-3 px-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                index === 0
                                  ? "bg-yellow-500 text-gray-900"
                                  : index === 1
                                  ? "bg-gray-400 text-gray-900"
                                  : index === 2
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-700 text-white"
                              }`}
                            >
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-3 px-2 text-gray-300 font-mono">
                            {student.roll}
                          </td>
                          <td className="py-3 px-2 text-white">
                            {student.name}
                          </td>
                          <td className="py-3 px-2 text-right">
                            <span className="text-green-400 font-bold text-lg">
                              {student.avgGPA}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-right text-gray-300">
                            {student.count}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Students with Most Failures */}
              <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Students Needing Most Support (Top 10)
                </h3>
                <div className="space-y-3">
                  {stats.studentFailures.map((student, index) => (
                    <div
                      key={student.roll}
                      className="bg-gray-750 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0">
                          {student.failedCount}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-white font-semibold">
                                {student.name}
                              </div>
                              <div className="text-xs text-gray-400 font-mono">
                                Roll: {student.roll}
                              </div>
                            </div>
                            <span className="text-red-400 text-sm font-semibold whitespace-nowrap">
                              {student.failedCount} subjects
                            </span>
                          </div>
                          <div className="text-xs text-gray-300 bg-gray-800 p-2 rounded">
                            <span className="text-gray-400">Failed: </span>
                            {student.subjects}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
            </div>
          )}
        </div>
        {/* Add this credit footer */}
        <div className="text-center text-xs text-gray-600 mt-12 pt-4 border-t border-gray-800 print-only">
          <p>
            Generated by RPI Result Analyzer • {new Date().toLocaleDateString()}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} RPI Computer Center
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultAnalytics;
