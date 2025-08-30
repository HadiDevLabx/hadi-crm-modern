import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/shadcn-utils';
import Icon from '../AppIcon';

const DataTable = ({
  data = [],
  columns = [],
  pagination = true,
  sorting = true,
  filtering = true,
  rowsPerPageOptions = [5, 10, 25, 50],
  initialRowsPerPage = 10,
  className,
  emptyMessage = "No data available",
  onRowClick,
  rowClassName,
  isLoading = false,
  loadingRows = 5,
}) => {
  // State for pagination, sorting and filtering
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(0); // Reset to first page when filtering
  };

  // Apply sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data];
    
    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        result = result.filter(row => {
          const value = row[key];
          return String(value).toLowerCase().includes(String(filters[key]).toLowerCase());
        });
      }
    });
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
        
        if (valueA < valueB) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [data, sortConfig, filters]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return processedData;
    const start = page * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, page, rowsPerPage, pagination]);

  // Calculate total pages
  const totalPages = Math.ceil(processedData.length / rowsPerPage);

  // Generate loading skeleton
  const loadingSkeleton = useMemo(() => {
    return Array(loadingRows).fill(0).map((_, rowIndex) => (
      <tr key={`skeleton-row-${rowIndex}`} className="animate-pulse">
        {columns.map((column, colIndex) => (
          <td 
            key={`skeleton-cell-${rowIndex}-${colIndex}`}
            className="py-4 px-4 border-b border-gray-200 dark:border-gray-700"
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </td>
        ))}
      </tr>
    ));
  }, [loadingRows, columns]);

  // Table row animations
  const tableRowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, y: -10 }
  };

  return (
    <div className={cn("w-full overflow-hidden rounded-lg shadow", className)}>
      {/* Filters */}
      {filtering && (
        <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {columns
            .filter(column => column.filterable !== false)
            .map(column => (
              <div key={`filter-${column.key}`} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder={`Filter ${column.header}`}
                  value={filters[column.key] || ''}
                  onChange={(e) => handleFilterChange(column.key, e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>
            ))}
          {Object.keys(filters).length > 0 && (
            <button
              onClick={() => {
                setFilters({});
                setPage(0);
              }}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md flex items-center space-x-1"
            >
              <Icon name="X" size={14} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map(column => (
                <th 
                  key={column.key} 
                  scope="col" 
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider",
                    sorting && column.sortable !== false ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""
                  )}
                  onClick={() => {
                    if (sorting && column.sortable !== false) {
                      handleSort(column.key);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {sorting && column.sortable !== false && (
                      <span>
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <Icon name="ArrowUp" size={14} />
                          ) : (
                            <Icon name="ArrowDown" size={14} />
                          )
                        ) : (
                          <Icon name="ArrowUpDown" size={14} className="opacity-30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading ? (
              loadingSkeleton
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={row.id || rowIndex}
                  className={cn(
                    onRowClick ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800" : "",
                    rowClassName ? rowClassName(row) : ""
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                  custom={rowIndex}
                  initial="hidden"
                  animate="visible"
                  variants={tableRowVariants}
                  exit="exit"
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={`${row.id || rowIndex}-${column.key || colIndex}`}
                      className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100"
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <Icon name="AlertCircle" size={24} className="mb-2 text-gray-400" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && processedData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              <span>
                Showing {page * rowsPerPage + 1} to{" "}
                {Math.min((page + 1) * rowsPerPage, processedData.length)} of{" "}
                {processedData.length} results
              </span>
              <div className="mx-4">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPage(0);
                  }}
                  className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm dark:bg-gray-700"
                >
                  {rowsPerPageOptions.map(option => (
                    <option key={option} value={option}>
                      {option} rows
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <nav className="flex items-center">
                <button
                  onClick={() => setPage(0)}
                  disabled={page === 0}
                  className={cn(
                    "relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-l-md",
                    page === 0
                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="sr-only">First</span>
                  <Icon name="ChevronsLeft" size={18} />
                </button>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  className={cn(
                    "relative inline-flex items-center px-2 py-2 text-sm font-medium",
                    page === 0
                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="sr-only">Previous</span>
                  <Icon name="ChevronLeft" size={18} />
                </button>
                
                <span className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                  {page + 1} / {totalPages}
                </span>
                
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages - 1}
                  className={cn(
                    "relative inline-flex items-center px-2 py-2 text-sm font-medium",
                    page >= totalPages - 1
                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="sr-only">Next</span>
                  <Icon name="ChevronRight" size={18} />
                </button>
                <button
                  onClick={() => setPage(totalPages - 1)}
                  disabled={page >= totalPages - 1}
                  className={cn(
                    "relative inline-flex items-center px-2 py-2 text-sm font-medium rounded-r-md",
                    page >= totalPages - 1
                      ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                >
                  <span className="sr-only">Last</span>
                  <Icon name="ChevronsRight" size={18} />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

