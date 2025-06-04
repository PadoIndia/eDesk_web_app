import { useState, useEffect } from "react";
import leaveTransactionService from "../../../services/api-services/leave-transaction.service";
import leaveTypeService from "../../../services/api-services/leave-type.service";
import userService from "../../../services/api-services/user.service";
import { LeaveTransactionFilters, LeaveType } from "../../../types/leave.types";
import { User } from "../../../types/user.types";
import { LeaveTransaction } from "./type";

export const useLeaveTransactions = () => {
  const [transactions, setTransactions] = useState<LeaveTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: LeaveTransactionFilters = {
        page: 1,
        limit: 101,
      };
      const transactionResponse =
        await leaveTransactionService.getLeaveTransactions(params);

      const transformedTransactions = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionResponse.data.map(async (transaction: any) => {
          const assignedByUser = await userService.getUserById(
            transaction.assignedBy
          );
          return {
            ...transaction,
            userName: transaction.user?.name || "N/A",
            leaveType: transaction.leaveType?.name || "N/A",
            assignedByName: assignedByUser?.data.name || "System",
          };
        })
      );

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
        leaveTypeService
          .getLeaveTypes()
          .then((response) => setLeaveTypes(response.data)),
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
    leaveTypes,
    refetchTransactions: fetchTransactions,
  };
};
