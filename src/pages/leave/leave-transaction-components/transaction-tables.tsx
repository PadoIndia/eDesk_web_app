import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { LeaveTransaction } from "./type";
import {TransactionRow} from "./transaction-rows";

interface TransactionTableProps {
  transactions: LeaveTransaction[];
  loading: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
}) => {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <FaInfoCircle size={48} className="mb-3" />
        <h4>No transactions found</h4>
        <p>Try adjusting your filters or add a new transaction</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Days</th>
            <th>Comment</th>
            <th>Assigned By</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
