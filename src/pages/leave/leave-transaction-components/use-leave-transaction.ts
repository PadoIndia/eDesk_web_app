import { useState, useEffect } from "react";
import leaveTransactionService from "../../../services/api-services/leave-transaction.service";
import userService from "../../../services/api-services/user.service";
import {
  LeaveTransactionFilters,
  LeaveTransactionResponse,
} from "../../../types/leave.types";
import { User } from "../../../types/user.types";

export const useLeaveTransactions = () => {
  const [transactions, setTransactions] = useState<LeaveTransactionResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: LeaveTransactionFilters = {
        page: 1,
        limit: 2000,
      };
      const resp = await leaveTransactionService.getLeaveTransactions(params);
      if (resp.status === "success") {
        setTransactions(resp.data);
      }
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
