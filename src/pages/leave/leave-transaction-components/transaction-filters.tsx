import React from "react";
import { FaSearch } from "react-icons/fa";

interface TransactionFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  leaveTypeFilter: string;
  setLeaveTypeFilter: (value: string) => void;
  yearFilter: number | "";
  setYearFilter: (value: number | "") => void;
  transactionLeaveTypes: (string | undefined)[];
  years: number[];
  onClearFilters: () => void;
}

export const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  leaveTypeFilter,
  setLeaveTypeFilter,
  yearFilter,
  setYearFilter,
  transactionLeaveTypes,
  years,
  onClearFilters,
}) => {
  return (
    <div className="card-body border-bottom">
      <div className="row g-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={leaveTypeFilter}
            onChange={(e) => setLeaveTypeFilter(e.target.value)}
          >
            <option value="">All Leave Types</option>
            {transactionLeaveTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={yearFilter}
            onChange={(e) =>
              setYearFilter(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-outline-secondary w-100"
            onClick={onClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};