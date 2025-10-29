import React, { useState, useEffect } from 'react';
import { SUBJECT_AND_CODES } from '../../assets/SUB_CODES';
import Footer from '../layouts/Footer';
import NavBar from '../layouts/NavBar';
import CGPAReactor from './CGPAReactor';
import StudentName from './StudentName';

const CheckResult = () => {
  const [result, setResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchResult = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/results/26-10-25-all.json');
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      const data = await response.json();
      const foundResult = data.find(
        item => item.Roll.toLowerCase() === searchTerm.toLowerCase().trim()
      );
      
      if (foundResult) {
        setResult(foundResult);
      } else {
        setError('No result found for this roll number');
        setResult(null);
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectName = (code) => {
    const cleanCode = code.replace(/\D/g, '').substring(0, 5);
    const subject = SUBJECT_AND_CODES[cleanCode];
    return subject ? `${subject[0]} (${subject[1]})` : 'Unknown Subject';
  };

  const formatFailedSubjects = (failedSubs) => {
    if (!failedSubs || failedSubs === '-') return [];
    return failedSubs.split(',').map(sub => {
      const [code, type] = sub.trim().split('(');
      return {
        code: code.trim(),
        type: type ? type.replace(')', '') : ''
      };
    });
  };

const renderResult = () => {
  if (!result) return null;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700/50 shadow-2xl overflow-hidden mt-10">
      {/* <CGPAReactor cgpa={result.GPA5} /> */}
      {/* Header Section */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-6 py-5 border-b border-gray-700/50 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col justify-center items-center text-center sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                {/* <div className="h-10 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-full"></div> */}
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Academic Transcript
                </h2>
              </div>
              <p className="text-gray-300/90 text-sm pl-4">
                Roll: <span className="font-mono font-medium text-emerald-300">{result.Roll}</span>
              </p>
              <StudentName roll={result.Roll} />
            </div>
            
            <div className={`flex  gap-2 items-center px-4 py-2 rounded-full font-medium backdrop-blur-sm transition-all duration-200 ${
              result.Status === 'Passed' 
                ? 'bg-green-500/10 text-green-300 border border-green-500/20 hover:bg-green-500/15' :
              result.Status === 'Failed' 
                ? 'bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/15' :
                'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20 hover:bg-yellow-500/15'
            }`}>
              <span className="relative flex h-2 w-2 mr-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  result.Status === 'Passed' ? 'bg-green-400' :
                  result.Status === 'Failed' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  result.Status === 'Passed' ? 'bg-green-400' :
                  result.Status === 'Failed' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></span>
              </span>
              {result.Status}
              {result.Status === 'Passed' && (
                <span className="ml-3 px-2 text-3xl py-0.5 text-xs bg-green-500/10 text-green-200 rounded-full border border-green-500/20">
                  আপ্নে তো চ্যালচ্যালায়া ইঞ্জিনিয়ার হয়া যাবেন 😎
                </span>
              )}
              {result.Status === 'Failed' && (
                <span className="ml-3 px-2 text-3xl py-0.5 text-xs bg-red-500/10 text-red-200 rounded-full border border-red-500/20">
                  পেরা নাই চিল আসছে বছর অবার হবে 🥸
                </span>
              )}
              {result.Status === 'Drop' && (
                <span className="ml-3 px-2 text-3xl py-0.5 text-xs bg-yellow-500/10 text-yellow-200 rounded-full border border-yellow-500/20">
                  বিয়ে শাদি করে সংসর করো 🙃
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 md:p-8">
        {/* GPA Summary */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700/50">
            Academic Performance
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
              const gpa = result[`GPA${sem}`] || '-';
              const isRef = gpa === 'ref';
              const isEmpty = gpa === '-';
              const isPassing = !isRef && !isEmpty && parseFloat(gpa) >= 3;
              
              return (
                <div 
                  key={sem} 
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    isRef ? 'bg-red-900/20 border border-red-900/30' :
                    isEmpty ? 'bg-gray-800/40 border border-gray-700/50' :
                    'bg-gray-800/30 hover:bg-gray-700/40 border border-gray-700/50 hover:border-emerald-500/20'
                  }`}
                >
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">Sem {sem}</div>
                  <div className={`text-xl font-bold font-mono ${
                    isRef ? 'text-red-400' : 
                    isEmpty ? 'text-gray-500' : 
                    isPassing ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {gpa}
                    {!isRef && !isEmpty && (
                      <span className="text-xs ml-1 text-gray-400">CGPA</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Failed Subjects */}
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4 pb-2 border-b border-gray-700/50">
            {result.Status === 'Passed' ? 'No Backlog' : 'Backlog Subjects'}
          </h3>
          {result.Status !== 'Passed' && formatFailedSubjects(result['Failed Subs']).length > 0 ? (
            <div className="space-y-3">
              {formatFailedSubjects(result['Failed Subs']).map((sub, i) => {
                const subjectName = getSubjectName(sub.code);
                return (
                  <div 
                    key={i} 
                    className="group bg-gray-800/40 hover:bg-gray-700/60 p-4 rounded-xl border border-gray-700/50 hover:border-emerald-500/20 transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-emerald-400">{sub.code}</span>
                          {sub.type && (
                            <span className="text-xs bg-gray-700/80 text-gray-300 px-2 py-0.5 rounded">
                              {sub.type}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          {subjectName}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <button className="text-xs bg-gray-700/80 hover:bg-gray-600/90 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-700/50">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-gray-400">No backlog subjects</p>
              <p className="text-sm text-gray-500 mt-1">All clear for this semester!</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-800/50 flex justify-end">
        <button
          onClick={() => {
            setResult(null);
            setSearchTerm('');
          }}
          className="px-5 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-gray-200 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 group"
        >
          <span>Search Again</span>
          <svg 
            className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

  return (
    <>
    <div className=" text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-400 mb-2 text-center">
          Check Your Result
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Enter your roll number to view your result <br />
         <span className="text-rose-200">
          *Only For Rajshahi Polytechnic Institute Students
          </span>

        </p>

        <form onSubmit={searchResult} className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
          <div className="mb-4">
            <label htmlFor="roll" className="block text-sm font-medium text-gray-300 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              id="roll"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g., 400413"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              loading || !searchTerm.trim()
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </span>
            ) : (
              'View Result'
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
        </form>

        {renderResult()}
      </div>
    </div>
    </>
  );
};

export default CheckResult;