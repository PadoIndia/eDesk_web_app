import React from "react";
import { LeaveTransactionResponse } from "../../../types/leave.types";
import { Table } from "../../../components/ui/table";

interface Props {
  transaction: LeaveTransactionResponse;
}

export const TransactionRow: React.FC<Props> = ({ transaction }) => {
  return (
    <Table.Row>
      <Table.Cell>
        {new Date(transaction.createdOn).toLocaleDateString()}
      </Table.Cell>
      <Table.Cell>
        <div className="d-flex align-items-center">
          {transaction.user?.name || "Unknown User"}
        </div>
      </Table.Cell>
      <Table.Cell>
        {transaction.leaveType.name || "Unknown Leave Type"}
      </Table.Cell>
      <Table.Cell
        className={transaction.count > 0 ? "text-success" : "text-danger"}
      >
        {transaction.count > 0 ? "+" : ""}
        {transaction.count}
      </Table.Cell>
      <Table.Cell>
        <small className="text-muted">{transaction.comment || "-"}</small>
      </Table.Cell>
      <Table.Cell>{transaction.assignedBy?.name || "System"}</Table.Cell>
    </Table.Row>
  );
};
