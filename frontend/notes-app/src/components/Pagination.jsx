import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(
      <button
        key={i}
        className={`px-3 py-1 border rounded ${
          currentPage === i ? "bg-blue-500 text-white" : "bg-white text-black"
        }`}
        onClick={() => onPageChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex gap-2 justify-center mt-4">
      {pages}
    </div>
  );
};

export default Pagination;