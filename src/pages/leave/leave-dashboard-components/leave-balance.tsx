import React from "react";
import { Link } from "react-router-dom";
import { FaChartBar, FaCircle } from "react-icons/fa";
import Badge from "../../../components/badge";

interface LeaveBalance {
  id: number;
  type: string;
  total: number;
  used: number;
  remaining: number;
  isPaid: boolean;
}

interface LeaveBalanceProps {
  leaveBalance: LeaveBalance[];
  loading?: boolean;
}

const LeaveBalanceComponent: React.FC<LeaveBalanceProps> = ({ 
  leaveBalance, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header bg-light">
          <h5 className="mb-0">
            <FaChartBar className="me-2" /> Leave Balance
          </h5>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header bg-light">
        <h5 className="mb-0">
          <FaChartBar className="me-2" /> Leave Balance
        </h5>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">
          {leaveBalance.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Total</th>
                    <th>Used</th>
                    <th>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalance.map((leave) => (
                    <tr key={leave.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCircle
                            className="me-2"
                            color={leave.isPaid ? "#28a745" : "#6c757d"}
                            size={10}
                          />
                          {leave.type}
                          {leave.isPaid && (
                            <Badge label="Paid" status="SUCCESS" />
                          )}
                        </div>
                      </td>
                      <td>{leave.total}</td>
                      <td>{leave.used}</td>
                      <td>
                        <span className="badge bg-primary">
                          {leave.remaining}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <p>No leave balance data available</p>
            </div>
          )}
        </div>
        <div className="mt-auto text-center pt-3">
          <Link
            to="/hrm/leave-transactions"
            className="btn btn-outline-primary btn-sm"
          >
            View Leave Transaction History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaveBalanceComponent;