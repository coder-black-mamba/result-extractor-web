import React, { useState } from 'react';
import CGPAViewer from './CGPAViewer';
import SubName from '../../extractor/SubName';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const StudentResultTable = ({ data, sortConfig, onSort }) => {
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCgpa, setSelectedCgpa] = useState('');

  if (!data || data.length === 0) return null;

  const status = (student) => {
    if (student.result?.Status === 'Drop') return 'Drop';
    if (student.result?.Status === 'Failed') return 'Failed';
    return 'Passed';
  };

  const handleSort = (key) => {
    onSort(key);
  };

  const handleCgpaSort = (e) => {
    const gpaKey = e.target.value;
    setSelectedCgpa(gpaKey);
    if (gpaKey) {
      onSort(`result.${gpaKey}`);
    }
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
    // Re-sort with the current CGPA if selected
    if (selectedCgpa) {
      onSort(`result.${selectedCgpa}`);
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1" />;
    return sortConfig.direction === 'ascending' ? (
      <FaSortUp className="ml-1" />
    ) : (
      <FaSortDown className="ml-1" />
    );
  };

  return (
    <div className="overflow-x-auto">
      {/* Sorting Controls */}
      <div className="flex items-center gap-4 mb-4 p-2 -50 rounded-lg w-full">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Sort By:</span>
          <select
            value={selectedCgpa}
            onChange={handleCgpaSort}
            className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select CGPA Semester</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={`GPA${num}`}>
                Semester {num} GPA
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Order:</span>
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="block w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="-50">
            <tr>
              {[
                { key: 'roll', label: 'Roll' },
                { key: 'name', label: 'Name' },
                { key: 'dept/sem/shift', label: 'Dpt/Sem/Sh' },
                { key: 'result.Status', label: 'Status' },
                { key: 'cgpa', label: 'CGPA' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  scope="col"
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:-100 ${
                    key === 'cgpa' ? 'w-48' : ''
                  }`}
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center">
                    {label}
                    {getSortIcon(key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" divide-y divide-gray-200">
            {data.map((student) => (
              <tr key={student.roll} className={student.result?.Status === "Drop" ? "bg-red-300" : ""}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top">
                  {student.roll}
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="text-sm font-medium ">
                    {student.name || 'N/A'}
                  </div>
                  {student.result?.Status !== "Passed" && (
                    <div className="mt-1 text-xs text-red-600">
                      <SubName subject={student.result?.["Failed Subs"]} />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm  align-top">
                  {student['dept/sem/shift'] || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap align-top">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      status(student) === "Drop"
                        ? 'bg-red-500 text-white'
                        : status(student) === "Failed"
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {status(student)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <div
                        key={num}
                        className={`flex items-center gap-2 text-sm ${
                          selectedCgpa === `GPA${num}`
                            ? 'font-semibold text-blue-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="w-8">S{num}:</span>
                        <CGPAViewer CGPA={student.result?.[`GPA${num}`]} />
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentResultTable;