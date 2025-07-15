import React, { useState, useMemo, lazy, useRef, useEffect } from "react";
import { FaPlus, FaTimes, FaChevronDown } from "react-icons/fa";
import { useLeaveTransactions } from "./leave-transaction-components/use-leave-transaction";
import { TransactionTable } from "./leave-transaction-components/transaction-tables";
import { TransactionsPagination } from "./leave-transaction-components/transaction-pagination";
import { useAppSelector } from "../../store/store";
import { SearchBox } from "../../components/ui/search";
import { MdFilterList } from "react-icons/md";
import Modal from "../../components/ui/modals";

const AddTransactionForm = lazy(
  () => import("./leave-transaction-components/add-transaction-form")
);

const LeaveTransactions: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const [filtersHeight, setFiltersHeight] = useState<number>(0);

  const { transactions, loading, users, refetchTransactions } =
    useLeaveTransactions();

  const userPermissions =
    useAppSelector((s) => s.auth.userData?.user.permissions) || [];

  const isAdmin = userPermissions.some((p) =>
    ["is_admin", "can_add_leaves"].includes(p)
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "">(
    new Date().getFullYear()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        (transaction.user.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (transaction.leaveType.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.comment?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLeaveType = leaveTypeFilter
        ? transaction.leaveType.name === leaveTypeFilter
        : true;
      const matchesYear = yearFilter ? transaction.year === yearFilter : true;

      let matchesDateRange = true;
      if ((dateFromFilter || dateToFilter) && transaction.createdOn) {
        const transactionDate = new Date(transaction.createdOn);

        if (!isNaN(transactionDate.getTime())) {
          if (dateFromFilter) {
            const fromDate = new Date(dateFromFilter);
            fromDate.setHours(0, 0, 0, 0);
            matchesDateRange = matchesDateRange && transactionDate >= fromDate;
          }
          if (dateToFilter) {
            const toDate = new Date(dateToFilter);
            toDate.setHours(23, 59, 59, 999);
            matchesDateRange = matchesDateRange && transactionDate <= toDate;
          }
        }
      }

      return (
        matchesSearch && matchesLeaveType && matchesYear && matchesDateRange
      );
    });
  }, [
    transactions,
    searchTerm,
    leaveTypeFilter,
    yearFilter,
    dateFromFilter,
    dateToFilter,
  ]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, itemsPerPage]);

  const transactionLeaveTypes = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.leaveType))),
    [transactions]
  );

  const years = useMemo(
    () =>
      Array.from(new Set(transactions.map((t) => t.year))).sort(
        (a, b) => b - a
      ),
    [transactions]
  );

  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, leaveTypeFilter, yearFilter, dateFromFilter, dateToFilter]);

  const clearFilters = () => {
    setSearchTerm("");
    setLeaveTypeFilter("");
    setYearFilter(new Date().getFullYear());
    setDateFromFilter("");
    setDateToFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddTransaction = async () => {
    try {
      setShowAddForm(false);
      await refetchTransactions();
    } catch (error) {
      console.error("Failed to create transaction:", error);
      alert("Failed to create transaction");
    }
  };

  const hasActiveFilters =
    searchTerm ||
    leaveTypeFilter ||
    (yearFilter && yearFilter !== new Date().getFullYear()) ||
    dateFromFilter ||
    dateToFilter;

  useEffect(() => {
    if (filtersRef.current) {
      if (showFilters) {
        const contentHeight = filtersRef.current.scrollHeight;
        setFiltersHeight(contentHeight);
      } else {
        setFiltersHeight(0);
      }
    }
  }, [showFilters]);

  useEffect(() => {
    const handleResize = () => {
      if (showFilters && filtersRef.current) {
        setFiltersHeight(filtersRef.current.scrollHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showFilters]);

  return (
    <div className="">
      <div className="bg-white p-2 border-bottom">
        <div className="row align-items-center">
          <div className="col-md-6">
            <h2 className="m-0 text-dark">Leave Transactions</h2>
            <p className="text-muted small mb-0 mt-1">
              Manage and track all leave transactions
            </p>
          </div>
          <div className="col-md-6 text-md-end mt-3 mt-md-0">
            {isAdmin && (
              <button
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? (
                  <>
                    <FaTimes className="me-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Add Transaction
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <Modal
        showCloseIcon
        isOpen={showAddForm}
        title="Add Transaction"
        onClose={() => setShowAddForm(false)}
        size="lg"
      >
        <AddTransactionForm
          users={users.map((u) => ({
            label: `${u.name} (${u.contact})`,
            value: u.id,
          }))}
          onSave={handleAddTransaction}
        />
      </Modal>

      <div className="card-body border-bottom">
        <div className="row g-3">
          <div className="col-12">
            <div className="d-flex gap-2">
              <div className="input-group flex-grow-1">
                <SearchBox value={searchTerm} onChange={setSearchTerm} />
              </div>
              <div>
                <button
                  className="btn btn-outline-secondary d-flex align-items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <MdFilterList />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="badge bg-primary">
                      {
                        [leaveTypeFilter, dateFromFilter, dateToFilter].filter(
                          Boolean
                        ).length
                      }
                    </span>
                  )}
                  <FaChevronDown
                    style={{
                      transition: "transform 0.3s ease",
                      transform: showFilters
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      fontSize: "12px",
                    }}
                  />
                </button>
              </div>
            </div>
          </div>

          <div
            className="col-12"
            style={{
              height: filtersHeight,
              overflow: "hidden",
              transition: "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            <div ref={filtersRef}>
              {showFilters && (
                <div className="row g-3">
                  <div className="col-md-3">
                    <label className="form-label small text-muted">
                      Leave Type
                    </label>
                    <select
                      className="form-select"
                      value={leaveTypeFilter}
                      onChange={(e) => setLeaveTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      {transactionLeaveTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small text-muted">Year</label>
                    <select
                      className="form-select"
                      value={yearFilter}
                      onChange={(e) =>
                        setYearFilter(
                          e.target.value ? Number(e.target.value) : ""
                        )
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

                  <div className="col-md-3">
                    <label className="form-label small text-muted">
                      From Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateFromFilter}
                      onChange={(e) => setDateFromFilter(e.target.value)}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label small text-muted">
                      To Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateToFilter}
                      onChange={(e) => setDateToFilter(e.target.value)}
                    />
                  </div>

                  {hasActiveFilters && (
                    <div className="col-12">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearFilters}
                      >
                        <FaTimes className="me-2" />
                        Clear All Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-2 bg-white border-bottom">
        <small className="text-muted">
          Showing {paginatedTransactions.length} of{" "}
          {filteredTransactions.length} transactions
          {filteredTransactions.length !== transactions.length &&
            ` (filtered from ${transactions.length} total)`}
        </small>
      </div>

      <div className="card-body p-0">
        <TransactionTable
          transactions={paginatedTransactions}
          loading={loading}
        />
      </div>

      {!loading && filteredTransactions.length > 0 && (
        <div className="card-footer bg-white border-top">
          <TransactionsPagination
            filteredCount={filteredTransactions.length}
            totalCount={transactions.length}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default LeaveTransactions;
