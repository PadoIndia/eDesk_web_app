import React from "react";
import { Punch } from "../../../types/attendance.types";

interface ApproveRejectModalProps {
  currentRequest: Punch;
  actionType: "approve" | "reject" | null;
  rejectionReason: string;
  setRejectionReason: React.Dispatch<React.SetStateAction<string>>;
  confirmApproveReject: () => Promise<void>;
  setShowApproveRejectModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({
  currentRequest,
  actionType,
  rejectionReason,
  setRejectionReason,
  confirmApproveReject,
  setShowApproveRejectModal,
}) => {
  const formatDate = (date: number, month: number, year: number): string => {
    return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <div className="modal fade show" style={{ display: "block" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {actionType === "approve" ? "Approve" : "Reject"} Miss Punch
              Request
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShowApproveRejectModal(false)}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-sm-6">
                <p className="mb-1 fw-bold">Employee:</p>
                <p>{currentRequest.user?.name || "N/A"}</p>
              </div>
              <div className="col-sm-6">
                <p className="mb-1 fw-bold">Department:</p>
                <p>{currentRequest.userDepartment || "N/A"}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-sm-6">
                <p className="mb-1 fw-bold">Date:</p>
                <p>
                  {formatDate(
                    currentRequest.date,
                    currentRequest.month,
                    currentRequest.year
                  )}
                </p>
              </div>
              <div className="col-sm-6">
                <p className="mb-1 fw-bold">Time:</p>
                <p>{currentRequest.time}</p>
              </div>
            </div>
            <div className="mb-3">
              <p className="mb-1 fw-bold">Reason:</p>
              <p>{currentRequest.missPunchReason || "No reason provided"}</p>
            </div>

            {actionType === "reject" && (
              <div className="mb-3">
                <label htmlFor="rejectionReason" className="form-label">
                  Rejection Reason:
                </label>
                <textarea
                  className="form-control"
                  id="rejectionReason"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                ></textarea>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowApproveRejectModal(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={confirmApproveReject}
              disabled={actionType === "reject" && !rejectionReason}
            >
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
