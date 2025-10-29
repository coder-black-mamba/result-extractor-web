// src/components/Reports/components/SearchAndFilters.jsx
import React from "react";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";
import { SUBJECT_AND_CODES } from "../../../assets/SUB_CODES.jsx";
const SearchAndFilters = ({
  searchTerm,
  onSearchChange,
  filters,
  onFilterChange,
  departments = [],
  semesters = [],
  shifts = [],
  filteredData,
}) => {
  const exportToExcel = (data) => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      data.map((student) => ({
        Roll: student.roll,
        Name: student.name || "N/A",
        "Department/Semester/Shift": student["dept/sem/shift"] || "N/A",
        Status: student.result?.Status || "N/A",
        "CGPA 1st": student.result?.GPA1 || "-",
        "CGPA 2nd": student.result?.GPA2 || "-",
        "CGPA 3rd": student.result?.GPA3 || "-",
        "CGPA 4th": student.result?.GPA4 || "-",
        "CGPA 5th": student.result?.GPA5 || "-",
        "CGPA 6th": student.result?.GPA6 || "-",
        "CGPA 7th": student.result?.GPA7 || "-",
        "CGPA 8th": student.result?.GPA8 || "-",
        "Failed Subjects": student.result?.["Failed Subs"] || "-",
      }))
    );

    XLSX.utils.book_append_sheet(wb, ws, "Student Results");
    XLSX.writeFile(wb, "student_results.xlsx");
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Search by name, roll, or reg..."
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Department Filter */}
        <div>
          <label
            htmlFor="department"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Department
          </label>
          <select
            id="department"
            name="department"
            value={filters.department}
            onChange={onFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Semester
          </label>
          <select
            id="semester"
            name="semester"
            value={filters.semester}
            onChange={onFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Semesters</option>
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>

        {/* Shift Filter */}
        <div>
          <label
            htmlFor="shift"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Shift
          </label>
          <select
            id="shift"
            name="shift"
            value={filters.shift}
            onChange={onFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Shifts</option>
            {shifts.map((shift) => (
              <option key={shift} value={shift}>
                {shift}
              </option>
            ))}
          </select>
        </div>

        {/* Pass/Fail Filter */}
        <div>
          <label
            htmlFor="hasFailed"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Result Status
          </label>
          <select
            id="hasFailed"
            name="hasFailed"
            value={filters.hasFailed}
            onChange={onFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All Results</option>
            <option value="failed">Failed Only</option>
            <option value="passed">Passed Only</option>
            <option value="drop">Dropped Only</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="hasDropSubject"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Has Drop Subjects
          </label>
          <select
            id="hasDropSubject"
            name="hasDropSubject"
            value={filters.hasDropSubject}
            onChange={onFilterChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="all">All</option>
            {Object.entries(SUBJECT_AND_CODES).map(
              ([code, [name, semester]]) => (
                <option key={code} value={code}>
                  {code} - {name} ({semester})
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div className="my-5">
        <button
          onClick={() => exportToExcel(filteredData)}
          className="cursor-pointer px-4 py-2 flex items-center gap-2 bg-green-400 text-gray-600 rounded"
        >
          {" "}
          <FaFileExcel /> Export To Excel
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilters;
