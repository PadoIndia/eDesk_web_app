import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useLeaveTransactions } from "./leave-transaction-components/use-leave-transaction";
import { useTransactionFilters } from "./leave-transaction-components/use-transaction-filter";
import { TransactionFilters } from "./leave-transaction-components/transaction-filters";
import { TransactionTable } from "./leave-transaction-components/transaction-tables";
import { AddTransactionForm } from "./leave-transaction-components/add-transaction-form";
import { TransactionsPagination } from "./leave-transaction-components/transaction-pagination";

const LeaveTransactions: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const { transactions, loading, users, leaveTypes, refetchTransactions } =
    useLeaveTransactions();

  const {
    searchTerm,
    setSearchTerm,
    leaveTypeFilter,
    setLeaveTypeFilter,
    yearFilter,
    setYearFilter,
    filteredTransactions,
    paginatedTransactions,
    transactionLeaveTypes,
    years,
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
    clearFilters,
  } = useTransactionFilters(transactions);

  const handleAddTransaction = async () => {
    try {
      await refetchTransactions();
    } catch (error) {
      console.error("Failed to create transaction:", error);
      alert("Failed to create transaction");
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Leave Transactions</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? (
                <>
                  <FaTrash className="me-1" />
                  Cancel
                </>
              ) : (
                <>
                  <FaPlus className="me-1" />
                  Add Transaction
                </>
              )}
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="card-body border-bottom">
            <AddTransactionForm
              users={users}
              leaveTypes={leaveTypes}
              onSave={handleAddTransaction}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          leaveTypeFilter={leaveTypeFilter}
          setLeaveTypeFilter={setLeaveTypeFilter}
          yearFilter={yearFilter}
          setYearFilter={setYearFilter}
          transactionLeaveTypes={transactionLeaveTypes}
          years={years}
          onClearFilters={clearFilters}
        />

        <div className="card-body">
          <TransactionTable
            transactions={paginatedTransactions} // Use paginated transactions instead of filtered
            loading={loading}
          />
        </div>

        <TransactionsPagination
          filteredCount={filteredTransactions.length}
          totalCount={transactions.length}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default LeaveTransactions;
