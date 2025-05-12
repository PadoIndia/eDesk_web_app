// Pagination.tsx
import React from "react";
import styles from "./styles.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5,
}) => {
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range of pages to show around current page
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxVisiblePages / 2)
    );

    // Adjust if we're near the beginning
    if (startPage <= 2) {
      startPage = 2;
      endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 2);
    }

    // Adjust if we're near the end
    if (endPage >= totalPages - 1) {
      endPage = totalPages - 1;
      startPage = Math.max(2, endPage - maxVisiblePages + 2);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push("ellipsis");
    }

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <div className={styles.paginationWrapper}>
        <button
          className={`${styles.paginationButton} ${styles.navButton}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className={styles.icon}>←</span>
          <span className={styles.srOnly}>Previous</span>
        </button>

        <div className={styles.paginationNumbers}>
          {pages.map((page, index) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                …
              </span>
            ) : (
              <button
                key={page}
                className={`${styles.paginationButton} ${
                  currentPage === page ? styles.active : ""
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          className={`${styles.paginationButton} ${styles.navButton}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className={styles.icon}>→</span>
          <span className={styles.srOnly}>Next</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
