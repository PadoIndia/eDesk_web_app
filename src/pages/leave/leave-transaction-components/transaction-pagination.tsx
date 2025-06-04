import React from "react";

interface TransactionsPaginationProps {
  filteredCount: number;
  totalCount: number;
}

export const TransactionsPagination: React.FC<TransactionsPaginationProps> = ({
  filteredCount,
  totalCount,
}) => {
  return (
    <div className="card-footer bg-light">
      <div className="d-flex justify-content-between align-items-center">
        <small className="text-muted">
          Showing {filteredCount} of {totalCount} transactions
        </small>
        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled">
              <a className="page-link" href="#" tabIndex={-1}>
                Previous
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
