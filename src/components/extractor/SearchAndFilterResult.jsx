import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const SearchAndFilterResult = ({ data = [], onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    minGPA: '',
    maxGPA: '',
    hasFailed: false,
  });

  // Available status options
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'Passed', label: 'Passed' },
    { value: 'Failed', label: 'Failed' },
    { value: 'Drop', label: 'Dropped' },
  ];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Apply filters and search
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        searchTerm: searchTerm.toLowerCase(),
        ...filters
      });
    }
  }, [searchTerm, filters, onFilterChange]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      status: 'all',
      minGPA: '',
      maxGPA: '',
      hasFailed: false,
    });
  };

  // Check if any filter is active
  const isFilterActive = filters.status !== 'all' || 
                        filters.minGPA || 
                        filters.maxGPA || 
                        filters.hasFailed;

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Search by roll number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              <FiX className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${
            isFilterActive 
              ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' 
              : 'border-gray-700 text-gray-300 hover:border-gray-600'
          } transition-colors`}
        >
          <FiFilter className="h-5 w-5" />
          <span>Filters</span>
          {isFilterOpen ? (
            <FiChevronUp className="h-4 w-4" />
          ) : (
            <FiChevronDown className="h-4 w-4" />
          )}
          {isFilterActive && (
            <span className="ml-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {isFilterOpen && (
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min GPA Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Min GPA
              </label>
              <input
                type="number"
                name="minGPA"
                min="0"
                max="4"
                step="0.01"
                placeholder="0.00"
                value={filters.minGPA}
                onChange={handleFilterChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Max GPA Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Max GPA
              </label>
              <input
                type="number"
                name="maxGPA"
                min="0"
                max="4"
                step="0.01"
                placeholder="4.00"
                value={filters.maxGPA}
                onChange={handleFilterChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Has Failed Filter */}
            <div className="flex items-end">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="hasFailed"
                    checked={filters.hasFailed}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  <div className={`block w-10 h-6 rounded-full ${
                    filters.hasFailed ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}></div>
                  <div
                    className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      filters.hasFailed ? 'transform translate-x-4' : ''
                    }`}
                  ></div>
                </div>
                <span className="ml-3 text-sm font-medium text-gray-300">
                  Show only with failed subjects
                </span>
              </label>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              disabled={!isFilterActive}
            >
              <FiX className="h-4 w-4" />
              Clear all filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters */}
      {(searchTerm || isFilterActive) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-300 border border-emerald-800">
              Search: {searchTerm}
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-emerald-800/50 hover:bg-emerald-700/50"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
          
          {filters.status !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300 border border-blue-800">
              Status: {filters.status}
              <button
                onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-800/50 hover:bg-blue-700/50"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {(filters.minGPA || filters.maxGPA) && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300 border border-purple-800">
              GPA: {filters.minGPA || '0.00'} - {filters.maxGPA || '4.00'}
              <button
                onClick={() => setFilters(prev => ({ ...prev, minGPA: '', maxGPA: '' }))}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-purple-800/50 hover:bg-purple-700/50"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}

          {filters.hasFailed && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-900/30 text-amber-300 border border-amber-800">
              With Failed Subjects
              <button
                onClick={() => setFilters(prev => ({ ...prev, hasFailed: false }))}
                className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-800/50 hover:bg-amber-700/50"
              >
                <FiX className="h-2.5 w-2.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterResult;