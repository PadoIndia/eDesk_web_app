import React from "react";

interface TransactionsPaginationProps {
  filteredCount: number;
  totalCount: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

export const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  filteredCount,
  totalCount,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(filteredCount / itemsPerPage);

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, currentPage + halfVisible);

      if (startPage === 1) {
        endPage = Math.min(totalPages, maxVisiblePages);
      }

      if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredCount);

  return (
    <div className="card-footer bg-light">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted">
            Showing {filteredCount > 0 ? startIndex : 0} to {endIndex} of{" "}
            {filteredCount} entries
            {totalCount !== filteredCount &&
              ` (filtered from ${totalCount} total entries)`}
          </div>
          <div className="d-flex align-items-center gap-2">
            <label className="form-label mb-0 text-muted">Show:</label>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-muted">per page</span>
          </div>
        </div>

        {totalPages > 1 && (
          <nav>
            <ul className="pagination pagination-sm mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>

              {getVisiblePages()[0] > 1 && (
                <>
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageClick(1)}
                    >
                      1
                    </button>
                  </li>
                  {getVisiblePages()[0] > 2 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                </>
              )}

              {getVisiblePages().map((page) => (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}

              {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
                <>
                  {getVisiblePages()[getVisiblePages().length - 1] <
                    totalPages - 1 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() => handlePageClick(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </li>
                </>
              )}

              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};
