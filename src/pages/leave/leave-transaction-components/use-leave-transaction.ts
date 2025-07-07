import { useState, useEffect } from "react";
import leaveTransactionService from "../../../services/api-services/leave-transaction.service";
import userService from "../../../services/api-services/user.service";
import { LeaveTransactionFilters } from "../../../types/leave.types";
import { User } from "../../../types/user.types";
import { LeaveTransaction } from "./type";

export const useLeaveTransactions = () => {
  const [transactions, setTransactions] = useState<LeaveTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: LeaveTransactionFilters = {
        page: 1,
        limit: 2000,
      };
      const transactionResponse =
        await leaveTransactionService.getLeaveTransactions(params);

      const transformedTransactions =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionResponse.data.map((transaction: any) => {
          return {
            ...transaction,
            leaveType: transaction.leaveType?.name || "N/A",
          };
        });

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchTransactions(),
        userService.getAllUsers().then((response) => setUsers(response.data)),
      ]);
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return {
    transactions,
    loading,
    users,
    refetchTransactions: fetchTransactions,
  };
};
