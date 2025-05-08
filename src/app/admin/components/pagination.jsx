import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  console.log("from total pages", totalPages);
  
  return (
    <div className="flex items-center justify-center space-x-2 mt-4 overflow-auto ">
      <button
        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            className={`px-4 py-2 rounded-md ${
              currentPage === page
                ? "bg-green-700 text-white"
                : "bg-green-100 text-green-700 hover:bg-green-200 transition"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
