import React, {
  useEffect,
  useReducer,
  useMemo,
  useCallback,
  useState,
} from "react";
import ResultAnalytics from "./ResultAnalytics";
import SearchAndFilters from "./components/SearchAndFilters";
import StudentResultTable from "./components/StudentResultTable";
import PaginationControls from "./components/PaginationControls";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import EmptyState from "./components/EmptyState";

// Initial state
const initialState = {
  resultData: [],
  dataWithResult: [],
  loading: true,
  error: "",
  filters: {
    department: "",
    semester: "",
    shift: "",
    hasFailed: "all",
    hasDropSubject: "all",
  },
  searchTerm: "",
  sortConfig: {
    key: null,
    direction: "ascending", // 'ascending' or 'descending'
  },
  page: 0,
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_RESULT_DATA":
      return { ...state, resultData: action.payload };
    case "SET_DATA_WITH_RESULT":
      return { ...state, dataWithResult: action.payload, loading: false };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        page: 0,
      };
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, page: 0 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SORT":
      return {
        ...state,
        sortConfig: {
          key: action.payload.key,
          direction:
            state.sortConfig.key === action.payload.key &&
            state.sortConfig.direction === "ascending"
              ? "descending"
              : "ascending",
        },
        page: 0, // Reset to first page when sorting changes
      };
    default:
      return state;
  }
};

const ROWS_PER_PAGE = 10;

const ReportResultViewer = ({ data: studentData }) => {
  const [isShowingAnalytics, setIsShowingAnalytics] = useState(true);
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    resultData,
    dataWithResult,
    loading,
    error,
    filters,
    searchTerm,
    page,
  } = state;

  // Fetch result data
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const response = await fetch("/results/5th-rpi-26-10-25.json");
        const data = await response.json();
        dispatch({ type: "SET_RESULT_DATA", payload: data });

        const combinedData = studentData.map((student) => {
          const result = data.find((r) => r.Roll == student.roll);
          return { ...student, result };
        });

        dispatch({ type: "SET_DATA_WITH_RESULT", payload: combinedData });
      } catch (err) {
        dispatch({
          type: "SET_ERROR",
          payload: err.message || "Failed to fetch results",
        });
      }
    };

    fetchData();
  }, [studentData]);

  // Extract unique values for filters
  const { departments, semesters, shifts } = useMemo(() => {
    const deptSet = new Set();
    const semSet = new Set();
    const shiftSet = new Set();

    dataWithResult.forEach((student) => {
      const [dept, sem, shift] =
        student["dept/sem/shift"]?.split("/").map((s) => s?.trim()) || [];
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
    return Object.entries(student.result).some(
      ([key, value]) =>
        key.startsWith("GPA") &&
        typeof value === "string" &&
        (value.toLowerCase().includes("f") ||
          value.toLowerCase().includes("fail"))
    );
  }, []);

  // Filter and search data
  const filteredData = useMemo(() => {
    return dataWithResult.filter((student) => {
      // Search filter
      const matchesSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll?.toString().includes(searchTerm) ||
        student.reg?.toString().includes(searchTerm);

      // Department/Semester/Shift filter
      const [dept, sem, shift] =
        student["dept/sem/shift"]?.split("/").map((s) => s?.trim()) || [];
      const matchesDept = !filters.department || dept === filters.department;
      const matchesSem = !filters.semester || sem === filters.semester;
      const matchesShift = !filters.shift || shift === filters.shift;

      // Failed subjects filter
      const matchesFailedFilter =
        filters.hasFailed === "all" ||
        (filters.hasFailed === "passed" &&
          student.result?.Status === "Passed") ||
        (filters.hasFailed === "failed" &&
          student.result?.Status === "Failed") ||
        (filters.hasFailed === "drop" && student.result?.Status === "Drop");

      const matchesDropSubject =
        filters.hasDropSubject === "all" ||
        (student.result?.["Failed Subs"] &&
          student.result["Failed Subs"]
            .split(",")
            .some((sub) => sub.trim().slice(0, 5) === filters.hasDropSubject));

      return (
        matchesSearch &&
        matchesDept &&
        matchesSem &&
        matchesShift &&
        matchesFailedFilter &&
        matchesDropSubject
      );
    });
  }, [dataWithResult, searchTerm, filters]);

  // Update the pagination and sorting logic
  const { paginatedData, totalPages } = useMemo(() => {
    // Apply sorting
    let sortedData = [...filteredData];

    if (state.sortConfig.key) {
      sortedData.sort((a, b) => {
        // Handle nested properties (e.g., result.Status)
        let aValue = state.sortConfig.key
          .split(".")
          .reduce((obj, key) => obj?.[key], a);
        let bValue = state.sortConfig.key
          .split(".")
          .reduce((obj, key) => obj?.[key], b);

        // Handle numeric values (like GPAs)
        if (state.sortConfig.key.startsWith("result.GPA")) {
          aValue = parseFloat(aValue) || 0;
          bValue = parseFloat(bValue) || 0;
          return state.sortConfig.direction === "ascending"
            ? aValue - bValue
            : bValue - aValue;
        }

        // Handle string values
        if (typeof aValue === "string" && typeof bValue === "string") {
          return state.sortConfig.direction === "ascending"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Fallback for other types
        if (aValue < bValue) {
          return state.sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return state.sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    // Apply pagination
    const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE);
    const paginated = sortedData.slice(
      page * ROWS_PER_PAGE,
      (page + 1) * ROWS_PER_PAGE
    );

    return {
      paginatedData: paginated,
      totalPages,
      sortedData, // Optional: if you need the full sorted data elsewhere
    };
  }, [filteredData, page, state.sortConfig]);

  // Handlers
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FILTERS", payload: { [name]: value } });
  }, []);

  const handleSearchChange = useCallback((e) => {
    dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value });
  }, []);

  const handlePageChange = useCallback((newPage) => {
    dispatch({ type: "SET_PAGE", payload: newPage });
  }, []);

  const handleSort = useCallback((key) => {
    dispatch({ type: "SET_SORT", payload: { key } });
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
        <button
          onClick={() => setIsShowingAnalytics(!isShowingAnalytics)}
          className="pointer px-4 py-2 flex items-center gap-2 bg-green-400 text-gray-600 rounded"
        >
          {isShowingAnalytics ? "Hide Analytics" : "Show Analytics"}
        </button>
        {isShowingAnalytics && <ResultAnalytics data={filteredData} />}
      </div>
      {/* Results Table */}
      <div className="overflow-x-auto">
        <StudentResultTable
          data={paginatedData}
          hasFailed={hasFailed}
          sortConfig={state.sortConfig}
          onSort={handleSort}
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
