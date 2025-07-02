import React from "react";
import { FaUser } from "react-icons/fa";
import { LeaveTransaction } from "./type";

interface TransactionRowProps {
  transaction: LeaveTransaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
}) => {
  return (
    <tr>
      <td>
        {new Date(
          transaction.year,
          transaction.month - 1,
          transaction.date
        ).toLocaleDateString()}
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
            <FaUser className="text-muted" />
          </div>
          {transaction.user?.name || "Unknown User"}
        </div>
      </td>
      <td>{transaction.leaveType || "Unknown Leave Type"}</td>
      <td className={transaction.count > 0 ? "text-success" : "text-danger"}>
        {transaction.count > 0 ? "+" : ""}
        {transaction.count}
      </td>
      <td>
        <small className="text-muted">{transaction.comment || "-"}</small>
      </td>
      <td>{transaction.assignedBy?.name || "System"}</td>
    </tr>
  );
};
