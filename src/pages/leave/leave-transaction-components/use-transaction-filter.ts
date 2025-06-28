import { useState, useMemo } from "react";
import { LeaveTransaction } from "./type";

export const useTransactionFilters = (transactions: LeaveTransaction[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState<number | "">(
    new Date().getFullYear()
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesSearch =
        (transaction.userName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (transaction.leaveType || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.comment?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLeaveType = leaveTypeFilter
        ? transaction.leaveType === leaveTypeFilter
        : true;
      const matchesYear = yearFilter ? transaction.year === yearFilter : true;

      return matchesSearch && matchesLeaveType && matchesYear;
    });
  }, [transactions, searchTerm, leaveTypeFilter, yearFilter]);

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
    () => Array.from(new Set(transactions.map((t) => t.year))),
    [transactions]
  );

  const clearFilters = () => {
    setSearchTerm("");
    setLeaveTypeFilter("");
    setYearFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Reset page to 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, leaveTypeFilter, yearFilter]);

  return {
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
  };
};
