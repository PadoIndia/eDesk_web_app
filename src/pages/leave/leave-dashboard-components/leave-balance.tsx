import { FC, useEffect, useState } from "react";
import { LeaveBalance } from "../../../types/leave.types";
import { buildLeaveBalances } from "../../../utils/helper";
import leaveTypeService from "../../../services/api-services/leave-type.service";
import leaveTransactionService from "../../../services/api-services/leave-transaction.service";
import { toast } from "react-toastify";
import { Spinner } from "../../../components/loading";
import { IoCheckmarkCircle } from "react-icons/io5";
import { Table } from "../../../components/ui/table";

type Props = {
  userId?: number;
};

const LeaveBalanceComponent: FC<Props> = ({ userId }) => {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resp = await leaveTransactionService.getLeaveTransactions({
          userId,
        });

        if (resp.status === "success") {
          const typesResp = await leaveTypeService.getLeaveTypes();
          if (typesResp.status === "success") {
            setLeaveBalance(buildLeaveBalances(typesResp.data, resp.data));
          }
        } else toast.error(resp.message);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-0 m-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Leave Dashboard</h1>
      </div>
      {leaveBalance.length > 0 ? (
        <Table.Container className="rounded-lg p-0">
          <Table hover>
            <Table.Head>
              <Table.Row>
                <Table.Header className="rounded-tl-lg">
                  <span className="ms-1">ID</span>
                </Table.Header>
                <Table.Header>LEAVE TYPE</Table.Header>
                <Table.Header className="text-center">TOTAL</Table.Header>
                <Table.Header className="text-center">USED</Table.Header>
                <Table.Header className="text-center rounded-tr-lg">
                  REMAINING
                </Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {leaveBalance.map((leave) => (
                <Table.Row key={leave.id}>
                  <Table.Cell>
                    <span className="ms-1">{leave.id}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="d-flex align-items-center">
                      {leave.type}
                      {leave.isPaid && (
                        <span className="ms-2 badge bg-success-ultralight text-dark d-flex align-items-center gap-1">
                          <div>
                            <IoCheckmarkCircle
                              size={14}
                              className="text-success opacity-75"
                            />
                          </div>
                          Paid
                        </span>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell className="text-center">{leave.total}</Table.Cell>
                  <Table.Cell className="text-center">{leave.used}</Table.Cell>
                  <Table.Cell className="text-center">
                    {leave.remaining}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Table.Container>
      ) : (
        <div className="text-center text-muted py-4">
          <p>No leave balance data available</p>
        </div>
      )}
    </div>
  );
};

export default LeaveBalanceComponent;
