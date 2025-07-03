import React, { useState, useEffect } from "react";
import Select from "react-select";
import { CreateLeaveTransactionRequest } from "../../../types/leave.types";
import userService from "../../../services/api-services/user.service";
import { toast } from "react-toastify";
import leaveTransactionService from "../../../services/api-services/leave-transaction.service";

interface TransactionItem {
  leaveTypeId: number;
  leaveTypeName: string;
  count: number;
  comment: string;
  selected: boolean;
}

interface Props {
  users: { label: string; value: number }[];
  onSave: (transaction: CreateLeaveTransactionRequest) => void;
  onCancel: () => void;
}

export const AddTransactionForm: React.FC<Props> = ({
  users,
  onSave,
  onCancel,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch leave types when user is selected
  useEffect(() => {
    if (userId) {
      setLoading(true);
      userService
        .getLeaveTypesByUserId(userId)
        .then((res) => {
          if (res.status === "success") {
            // Initialize all leave types as transaction items
            const initialTransactions = res.data.map((leaveType) => ({
              leaveTypeId: leaveType.id,
              leaveTypeName: leaveType.name,
              count: 0,
              comment: "",
              selected: false,
            }));
            setTransactions(initialTransactions);
          }
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load leave types");
          setLoading(false);
        });
    } else {
      setTransactions([]);
    }
  }, [userId]);

  const handleTransactionChange = (
    leaveTypeId: number,
    field: "count" | "comment",
    value: string | number
  ) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.leaveTypeId === leaveTypeId ? { ...t, [field]: value } : t
      )
    );
  };

  const handleCheckboxChange = (leaveTypeId: number) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.leaveTypeId === leaveTypeId ? { ...t, selected: !t.selected } : t
      )
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setTransactions((prev) => prev.map((t) => ({ ...t, selected: checked })));
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Please select an employee");
      return;
    }

    const selectedTransactions = transactions.filter((t) => t.selected);

    if (selectedTransactions.length === 0) {
      toast.error("Please select at least one transaction");
      return;
    }

    // Validate all selected transactions have non-zero count
    const invalidTransactions = selectedTransactions.filter(
      (t) => t.count === 0
    );
    if (invalidTransactions.length > 0) {
      toast.error("Please enter count for all selected leave types");
      return;
    }

    try {
      const transactionData: CreateLeaveTransactionRequest = {
        userId,
        transactions: selectedTransactions.map((t) => ({
          leaveTypeId: t.leaveTypeId,
          count: t.count,
          comment: t.comment || undefined,
        })),
      };

      const resp = await leaveTransactionService.createLeaveTransaction(
        transactionData
      );

      if (resp.status === "success") {
        toast.success(resp.message);
        onSave(transactionData);
        // Reset form
        setUserId(null);
        setTransactions([]);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      console.error("Error submitting transactions:", error);
      toast.error("Error creating transactions");
    }
  };

  const allSelected =
    transactions.length > 0 && transactions.every((t) => t.selected);
  const someSelected = transactions.some((t) => t.selected);
  const selectedCount = transactions.filter((t) => t.selected).length;

  return (
    <div className="p-4">
      <div className="space-y-4">
        {/* User Selection */}
        <div className="mb-4">
          <label className="form-label d-block mb-2 fw-semibold">
            Employee
          </label>
          <Select
            options={users}
            placeholder="Select user"
            isSearchable
            value={users.find((u) => u.value === userId)}
            onChange={(option) => setUserId(option?.value || null)}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center p-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Transactions Table */}
        {!loading && transactions.length > 0 && (
          <div className="mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h6 className="mb-0">Available Leave Types</h6>
                <span className="badge bg-primary">
                  {selectedCount} selected
                </span>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th className="text-center" style={{ width: "50px" }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={allSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            ref={(input) => {
                              if (input) {
                                input.indeterminate =
                                  someSelected && !allSelected;
                              }
                            }}
                          />
                        </th>
                        <th>Leave Type</th>
                        <th style={{ width: "150px" }}>Days</th>
                        <th style={{ width: "300px" }}>Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction.leaveTypeId}
                          className={transaction.selected ? "table-active" : ""}
                        >
                          <td className="text-center">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={transaction.selected}
                              onChange={() =>
                                handleCheckboxChange(transaction.leaveTypeId)
                              }
                            />
                          </td>
                          <td className="align-middle">
                            <span
                              className={
                                transaction.selected ? "fw-semibold" : ""
                              }
                            >
                              {transaction.leaveTypeName}
                            </span>
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              step="0.5"
                              min="-365"
                              max="365"
                              value={transaction.count || ""}
                              onChange={(e) =>
                                handleTransactionChange(
                                  transaction.leaveTypeId,
                                  "count",
                                  e.target.value ? Number(e.target.value) : 0
                                )
                              }
                              disabled={!transaction.selected}
                              placeholder="0"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={transaction.comment}
                              onChange={(e) =>
                                handleTransactionChange(
                                  transaction.leaveTypeId,
                                  "comment",
                                  e.target.value
                                )
                              }
                              disabled={!transaction.selected}
                              placeholder="Optional comment"
                              maxLength={500}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Leave Types Message */}
        {!loading && userId && transactions.length === 0 && (
          <div className="alert alert-warning">
            <div className="d-flex align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-exclamation-triangle me-2"
                viewBox="0 0 16 16"
              >
                <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
                <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
              </svg>
              No leave types found for this user
            </div>
          </div>
        )}

        {/* Helper Text */}
        {transactions.length > 0 && selectedCount === 0 && (
          <div className="text-muted small">
            <em>
              Select leave types to create transactions. Use negative values for
              deductions.
            </em>
          </div>
        )}

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!userId || selectedCount === 0}
          >
            Create Transactions
            {selectedCount > 0 && ` (${selectedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
};
