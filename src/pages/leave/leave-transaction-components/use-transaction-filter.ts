import { useState, useMemo } from "react";
import { LeaveTransaction } from "./type";

export const useTransactionFilters = (transactions: LeaveTransaction[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "">(new Date().getFullYear());

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        (transaction.userName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.leaveType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.comment?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesLeaveType = leaveTypeFilter ? transaction.leaveType === leaveTypeFilter : true;
      const matchesYear = yearFilter ? transaction.year === yearFilter : true;

      return matchesSearch && matchesLeaveType && matchesYear;
    });
  }, [transactions, searchTerm, leaveTypeFilter, yearFilter]);

  const transactionLeaveTypes = useMemo(() => 
    Array.from(new Set(transactions.map((t) => t.leaveType))), 
    [transactions]
  );

  const years = useMemo(() => 
    Array.from(new Set(transactions.map((t) => t.year))), 
    [transactions]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setLeaveTypeFilter("");
    setYearFilter("");
  };

  return {
    searchTerm,
    setSearchTerm,
    leaveTypeFilter,
    setLeaveTypeFilter,
    yearFilter,
    setYearFilter,
    filteredTransactions,
    transactionLeaveTypes,
    years,
    clearFilters
  };
};