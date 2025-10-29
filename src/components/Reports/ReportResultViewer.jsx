import React, { useEffect, useReducer, useMemo, useCallback,useState } from 'react';
import ResultAnalytics from './ResultAnalytics';
import SearchAndFilters from './components/SearchAndFilters';
import StudentResultTable from './components/StudentResultTable';
import PaginationControls from './components/PaginationControls';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';

// Initial state
const initialState = {
  resultData: [],
  dataWithResult: [],
  loading: true,
  error: '',
  filters: {
    department: '',
    semester: '',
    shift: '',
    hasFailed: 'all',
  },
  searchTerm: '',
  page: 0,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_RESULT_DATA':
      return { ...state, resultData: action.payload };
    case 'SET_DATA_WITH_RESULT':
      return { ...state, dataWithResult: action.payload, loading: false };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        page: 0,
      };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload, page: 0 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    default:
      return state;
  }
};

const ROWS_PER_PAGE = 10;

const ReportResultViewer = ({ data: studentData }) => {
    const [isShowingAnalytics, setIsShowingAnalytics] = useState(true)
  const [state, dispatch] = useReducer(reducer, initialState);
  const { resultData, dataWithResult, loading, error, filters, searchTerm, page } = state;

  // Fetch result data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const response = await fetch('/results/5th-rpi-26-10-25.json');
        const data = await response.json();
        dispatch({ type: 'SET_RESULT_DATA', payload: data });

        const combinedData = studentData.map((student) => {
          const result = data.find(r => r.Roll == student.roll);
          return { ...student, result };
        });

        dispatch({ type: 'SET_DATA_WITH_RESULT', payload: combinedData });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err.message || 'Failed to fetch results' });
      }
    };

    fetchData();
  }, [studentData]);

  // Extract unique values for filters
  const { departments, semesters, shifts } = useMemo(() => {
    const deptSet = new Set();
    const semSet = new Set();
    const shiftSet = new Set();

    dataWithResult.forEach(student => {
      const [dept, sem, shift] = student['dept/sem/shift']?.split('/').map(s => s?.trim()) || [];
      if (dept) deptSet.add(dept);
      if (sem) semSet.add(sem);
      if (shift) shiftSet.add(shift);
    });

    return {
      departments: Array.from(deptSet).sort(),
      semesters: Array.from(semSet).sort(),
      shifts: Array.from(shiftSet).sort(),
    };
  }, [dataWithResult]);

  // Check if student has failed any subject
  const hasFailed = useCallback((student) => {
    if (!student.result) return false;
    return Object.entries(student.result)
      .some(([key, value]) => 
        key.startsWith('GPA') && 
        typeof value === 'string' && 
        (value.toLowerCase().includes('f') || value.toLowerCase().includes('fail'))
      );
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    return dataWithResult.filter(student => {
      // Search filter
      const matchesSearch = 
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll?.toString().includes(searchTerm) ||
        student.reg?.toString().includes(searchTerm);

      // Department/Semester/Shift filter
      const [dept, sem, shift] = student['dept/sem/shift']?.split('/').map(s => s?.trim()) || [];
      const matchesDept = !filters.department || dept === filters.department;
      const matchesSem = !filters.semester || sem === filters.semester;
      const matchesShift = !filters.shift || shift === filters.shift;

      // Failed subjects filter
      const studentHasFailed = hasFailed(student);
      const matchesFailedFilter = 
        filters.hasFailed === 'all' || 
        (filters.hasFailed === 'yes' && studentHasFailed) || 
        (filters.hasFailed === 'no' && !studentHasFailed);

      return matchesSearch && matchesDept && matchesSem && matchesShift && matchesFailedFilter;
    });
  }, [dataWithResult, searchTerm, filters, hasFailed]);

  // Pagination
  const { paginatedData, totalPages } = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    const paginatedData = filteredData.slice(
      page * ROWS_PER_PAGE,
      (page + 1) * ROWS_PER_PAGE
    );
    return { paginatedData, totalPages };
  }, [filteredData, page]);

  // Handlers
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FILTERS', payload: { [name]: value } });
  }, []);

  const handleSearchChange = useCallback((e) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value });
  }, []);

  const handlePageChange = useCallback((newPage) => {
    dispatch({ type: 'SET_PAGE', payload: newPage });
  }, []);

  // Loading state
  if (loading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty state
  if (dataWithResult.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className=" rounded-lg shadow overflow-hidden">

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-200">
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filters}
          onFilterChange={handleFilterChange}
          departments={departments}
          semesters={semesters}
          shifts={shifts}
          filteredData={filteredData}
        />
      </div>
        {/* analytics */}
        <div className="my-5">
        <button onClick={()=>setIsShowingAnalytics(!isShowingAnalytics)} className="pointer px-4 py-2 flex items-center gap-2 bg-green-400 text-gray-600 rounded">{isShowingAnalytics ? "Hide Analytics" : "Show Analytics"}</button>
        {isShowingAnalytics && <ResultAnalytics data={filteredData} />}
        </div>
      {/* Results Table */}
      <div className="overflow-x-auto">
        <StudentResultTable 
          data={paginatedData} 
          hasFailed={hasFailed}
        />
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredData.length}
          itemsPerPage={ROWS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>


    </div>
  );
};

export default ReportResultViewer;