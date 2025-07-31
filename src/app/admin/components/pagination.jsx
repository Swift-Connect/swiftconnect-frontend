
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Helper to generate Google-style pagination page numbers
function getPageNumbers(current, total) {
  const pages = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 4) pages.push("...");
  for (let i = Math.max(2, current - 2); i <= Math.min(total - 1, current + 2); i++) {
    pages.push(i);
  }
  if (current < total - 3) pages.push("...");
  if (total > 1) pages.push(total);
  return pages;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage = 10, 
  totalItems = 0,
  showItemsInfo = true 
}) => {
  const pageNumbers = getPageNumbers(currentPage, totalPages);
  
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 px-4">
      {showItemsInfo && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} entries
        </div>
      )}
      
      <div className="flex items-center space-x-1">
        <button
          className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          disabled={currentPage === 1}    
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FaChevronLeft className="w-3 h-3" />
          Previous
        </button>

        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentPage === page
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => onPageChange(page)}
                disabled={currentPage === page}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <FaChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      {!showItemsInfo && (
        <div></div>
      )}
    </div>
  );
};

export default Pagination;
