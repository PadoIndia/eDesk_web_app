import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import { TransactionRow } from "./transaction-rows";
import { LeaveTransactionResponse } from "../../../types/leave.types";
import { Table } from "../../../components/ui/table";

interface Props {
  transactions: LeaveTransactionResponse[];
  loading: boolean;
}

export const TransactionTable: React.FC<Props> = ({
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
    <Table.Container>
      <Table>
        <Table.Head variant="light">
          <Table.Row>
            <Table.Header>DATE</Table.Header>
            <Table.Header>EMPLOYEE</Table.Header>
            <Table.Header>LEAVE TYPE</Table.Header>
            <Table.Header>DAYS</Table.Header>
            <Table.Header>COMMENT</Table.Header>
            <Table.Header>ASSIGNED BY</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </Table.Body>
      </Table>
    </Table.Container>
  );
};
