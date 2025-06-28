import React, { useState } from "react";
import {
  LeaveTypeResponse,
  CreateLeaveTransactionRequest,
} from "../../../types/leave.types";
import { User } from "../../../types/user.types";
import { toast } from "react-toastify";
import leaveTransactionService from "../../../services/api-services/leave-transaction.service";

interface AddTransactionFormProps {
  users: User[];
  leaveTypes: LeaveTypeResponse[];
  onSave: (transaction: CreateLeaveTransactionRequest) => void;
  onCancel: () => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  users,
  leaveTypes,
  onSave,
  onCancel,
}) => {
  const [userId, setUserId] = useState<number | "">("");
  const [emailInput, setEmailInput] = useState("");
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">("");
  const [count, setCount] = useState<number | "">("");
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast.error("Please select an employee");
      return;
    }

    if (!leaveTypeId) {
      toast.error("Please select a leave type");
      return;
    }

    if (count === "") {
      toast.error("Please enter a count value");
      return;
    }

    const selectedUser = users.find((u) => u.id === userId);
    if (!selectedUser) {
      toast.error("Invalid employee selected");
      return;
    }
    try {
      const date = new Date();
      const transactionData: CreateLeaveTransactionRequest = {
        userId: Number(userId),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        leaveTypeId: Number(leaveTypeId),
        count: Number(count),
        comment: comment || undefined,
      };
      const resp = await leaveTransactionService.createLeaveTransaction(
        transactionData
      );
      if (resp.status === "success") {
        toast.success(resp.message);
        onSave(transactionData);
        setComment("");
        setCount("");
        setLeaveTypeId("");
      } else toast.error(resp.message);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      toast.error("Error creating transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Employee Email</label>
          <input
            type="email"
            className="form-control"
            list="userEmailList"
            value={emailInput}
            onChange={(e) => {
              const value = e.target.value;
              setEmailInput(value);
              const user = users.find((u) => u.username === value);
              if (user) {
                setUserId(user.id);
              } else {
                setUserId("");
              }
            }}
            placeholder="Search by email"
            required
          />
          <datalist id="userEmailList">
            {users.map((user) => (
              <option key={user.id} value={user.username} />
            ))}
          </datalist>
        </div>
        <div className="col-md-4">
          <label className="form-label">Leave Type</label>
          <select
            className="form-select"
            value={leaveTypeId}
            onChange={(e) =>
              setLeaveTypeId(e.target.value ? Number(e.target.value) : "")
            }
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Days</label>
          <input
            type="number"
            className="form-control"
            step="0.5"
            min="-365"
            max="365"
            value={count}
            onChange={(e) =>
              setCount(e.target.value ? Number(e.target.value) : "")
            }
            required
          />
        </div>

        <div className="col-md-8">
          <label className="form-label">Comment</label>
          <input
            type="text"
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment"
          />
        </div>

        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
        </div>
      </div>
    </form>
  );
};
