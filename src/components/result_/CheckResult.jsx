import React, { useState } from "react";
import { SUBJECT_AND_CODES } from "../../assets/SUB_CODES";
import StudentName from "./StudentName";

const CheckResult = () => {
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [semester, setSemester] = useState("");

  const searchResult = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim() || !semester) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/results/26-10-25-all.json");
      if (!response.ok) throw new Error("Failed to fetch results");
      const data = await response.json();
      const foundResult = data.find(
        (item) => item.Roll.toLowerCase() === searchTerm.toLowerCase().trim()
      );

      if (foundResult) {
        setResult(foundResult);
      } else {
        throw new Error("No result found for this roll number");
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (code) => {
    const cleanCode = code.replace(/\D/g, "").substring(0, 5);
    const subject = SUBJECT_AND_CODES[cleanCode];
    return subject ? `${subject[0]}` : "Unknown Subject";
  };

  const getSubjectSem = (code) => {
    const cleanCode = code.replace(/\D/g, "").substring(0, 5);
    const subject = SUBJECT_AND_CODES[cleanCode];
    return subject ? `${subject[1]}` : "Unknown Subject";
  };

  const formatFailedSubjects = (failedSubs) => {
    if (!failedSubs || failedSubs === "-") return [];
    return failedSubs.split(",").map((sub) => {
      const [code, type] = sub.trim().split("(");
      return {
        code: code.trim(),
        type: type ? type.replace(")", "") : "",
      };
    });
  };

  const renderSemesterCard = (sem) => {
    const gpa = result[`GPA${sem}`] || "-";
    const isRef = gpa === "ref";
    const isEmpty = gpa === "-";
    const isPassing = !isRef && !isEmpty && parseFloat(gpa) >= 3;

    return (
      <div
        key={sem}
        className={`p-4 rounded-xl transition-all duration-300 ${
          isRef
            ? "bg-red-900/20 border-red-900/30"
            : isEmpty
            ? "bg-gray-800/40 border-gray-700/50"
            : "bg-gray-800/30 hover:bg-gray-700/40 border-gray-700/50"
        } border`}
      >
        <div className="text-xs uppercase tracking-wider text-gray-400">
          Sem {sem}
        </div>
        <div
          className={`text-2xl font-bold font-mono mt-1 ${
            isRef
              ? "text-red-400"
              : isEmpty
              ? "text-gray-500"
              : isPassing
              ? "text-emerald-400"
              : "text-amber-400"
          }`}
        >
          {isRef ? "REF" : gpa}
          {!isRef && !isEmpty && (
            <span className="text-sm ml-1 text-gray-400">CGPA</span>
          )}
        </div>
      </div>
    );
  };

  const renderStatusBadge = () => {
    const statusConfig = {
      Passed: {
        bg: "bg-green-500/10",
        text: "text-green-300",
        border: "border-green-500/20",
        emoji: "🎉",
        message: "Congratulations! You passed!",
      },
      Failed: {
        bg: "bg-red-500/10",
        text: "text-red-300",
        border: "border-red-500/20",
        emoji: "📚",
        message: "Keep trying! You can do better next time!",
      },
      Drop: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-300",
        border: "border-yellow-500/20",
        emoji: "⏳",
        message: "বিয়ে করে সংসার করেন ",
      },
    }[result.Status] || {
      bg: "bg-gray-500/10",
      text: "text-gray-300",
      border: "border-gray-500/20",
      emoji: "ℹ️",
      message: "Check your academic status",
    };

    if (semester == 1) {
      if (
        result?.["Failed Subs"] != "-" &&
        result?.["Failed Subs"].split(",").length < 3
      ) {
        return (
          <div
            className={`  bg-red-500/10 text-red-300 border-red-500/20 border rounded-2xl p-4 mb-6`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <div className="font-medium text-white">
                  Status: <span className="text-red-300">Failed</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  Keep trying! You can do better next time!
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div
        className={`${statusConfig.bg} ${statusConfig.border} border rounded-2xl p-4 mb-6`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{statusConfig.emoji}</span>
          <div>
            <div className="font-medium text-white">
              Status: <span className={statusConfig.text}>{result.Status}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">
              {statusConfig.message}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className=" text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            RPI Result Analyzer
          </h1>
          <div className="max-w-2xl mx-auto space-y-3">
            <p className="text-gray-300 text-sm md:text-base">
              Built with ❤️ by{" "}
              <a
                href="https://absyd.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 underline hover:text-emerald-200 transition-colors"
              >
                Abu Sayed
              </a>{" "}
              &amp;{" "}
              <a
                href="https://www.beta-rpicc.vvercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                RPICC
              </a>
            </p>
            <p className="text-rose-200/80 text-xs md:text-sm font-medium bg-rose-500/10 inline-block px-3 py-1.5 rounded-full border border-rose-500/20">
              For Students of Rajshahi Polytechnic Institute Only
            </p>
          </div>
        </header>

        {/* Search Form */}
        <form
          onSubmit={searchResult}
          className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label
                htmlFor="roll"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Enter Your Roll Number
              </label>
              <input
                type="text"
                id="roll"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., 400413"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                required
              />
            </div>
            <div>
              <label
                htmlFor="semester"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Select Semester
              </label>
              <select
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
                required
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    {sem === 1
                      ? `${sem}st`
                      : sem === 2
                      ? `${sem}nd`
                      : sem === 3
                      ? `${sem}rd`
                      : `${sem}th`}{" "}
                    Semester
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !searchTerm.trim() || !semester}
            className={`mt-4 w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
              loading || !searchTerm.trim() || !semester
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                Loading...
              </>
            ) : (
              "View Result"
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
        </form>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden shadow-2xl">
            {/* Student Info Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 border-b border-gray-700/50">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Academic Transcript
                  </h2>
                  <div className="flex items-center gap-2 text-gray-300 mt-1">
                    <span>
                      Roll:{" "}
                      <span className="font-mono text-emerald-300">
                        {result.Roll}
                      </span>
                    </span>
                    <span className="mx-2">•</span>
                    <StudentName roll={result.Roll} />
                  </div>
                </div>
                <div className="bg-gray-700/50 px-4 py-2 rounded-full text-sm font-medium">
                  {semester}st Semester
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-6">
              {/* Status Card */}
              {renderStatusBadge()}

              {/* GPA Summary */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700/50">
                  Semester Performance
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(renderSemesterCard)}
                </div>
              </div>

              {/* Backlog Subjects */}
              {result.Status !== "Passed" &&
                formatFailedSubjects(result["Failed Subs"]).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700/50">
                      Backlog Subjects
                    </h3>
                    <div className="space-y-3">
                      {formatFailedSubjects(result["Failed Subs"]).map(
                        (sub, i) => (
                          <div key={i} className=" ">
                            {/* <div className="flex flex-col sm:flex-row justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-gray-700/40 to-gray-800/40 hover:from-gray-700/50 hover:to-gray-800/50 border border-gray-600/30 transition-all duration-200">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="font-mono text-emerald-300 font-medium">
                                    {sub.code}
                                  </div>
                                  {sub.type && (
                                    <span className="text-[10px] bg-gray-600/50 text-gray-200 px-2 py-0.5 rounded-full font-medium">
                                      {sub.type}
                                    </span>
                                  )}
                                </div>
                                <div className="text-lg text-rose-300 font-medium">
                                  {getSubjectName(sub.code)} <span className="font-normal text-sm">({getSubjectSem(sub.code)}) </span>
                                </div> 
                              </div>
                              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                <button className="text-xs px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/20 transition-colors">
                                  View Details
                                </button>
                              </div>
                            </div> */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-lg bg-gray-800 border border-gray-600/30 hover:bg-gray-700/50 transition-colors duration-200">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-mono text-red-400 font-medium">
                                    {sub.code}
                                  </div>
                                  {sub.type && (
                                    <span className="text-[11px] bg-red-500/10 text-red-300 px-2 py-0.5 rounded-md">
                                      {sub.type}
                                    </span>
                                  )}
                                  <span className="text-[11px] text-red-400 px-2 py-0.5 rounded-md border border-red-400/30">
                                    Failed
                                  </span>
                                </div>

                                <div className="text-base text-red-200 font-medium">
                                  {getSubjectName(sub.code)}{" "}
                                  <span className="text-sm text-red-300/70">
                                    ({getSubjectSem(sub.code)})
                                  </span>
                                </div>
                              </div>

                              <button className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 rounded-md border border-red-500/20 transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* No Backlog Message */}
              {result.Status === "Passed" && (
                <div className="text-center py-8 bg-gray-700/20 rounded-xl border-2 border-dashed border-gray-600/30">
                  <div className="text-4xl mb-3">🎓</div>
                  <h4 className="text-lg font-medium text-white">
                    No Backlog Subjects
                  </h4>
                  <p className="text-gray-400 mt-1">
                    You're doing great! Keep up the good work!
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-800/50 border-t border-gray-700/30 flex justify-end">
              <button
                onClick={() => {
                  setResult(null);
                  setSearchTerm("");
                  setSemester("");
                }}
                className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <span>New Search</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckResult;
