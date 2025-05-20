import React from "react";
import { Punch } from "../../../types/attendance.types";

interface ApproveRejectModalProps {
  currentRequest: Punch;
  actionType: "approve" | "reject" | null;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  confirmApproveReject: () => void;
  setShowApproveRejectModal: (show: boolean) => void;
}

const ApproveRejectModal: React.FC<ApproveRejectModalProps> = ({
  currentRequest,
  actionType,
  rejectionReason,
  setRejectionReason,
  confirmApproveReject,
  setShowApproveRejectModal
}) => {
  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">
              {actionType === "approve" ? "Approve Request" : "Reject Request"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowApproveRejectModal(false)}
            />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <p>
                <strong>Employee:</strong> {currentRequest.userName}
              </p>
              <p>
                <strong>Date:</strong> {currentRequest.date}
              </p>
              <p>
                <strong>Time:</strong> {currentRequest.time}
              </p>
              <p>
                <strong>Reason:</strong> {currentRequest.reason}
              </p>
            </div>
            {actionType === "reject" && (
              <div className="mb-3">
                <label className="form-label">Rejection Reason</label>
                <textarea
                  className="form-control"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  rows={3}
                />
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
              className={`btn ${
                actionType === "approve" ? "btn-success" : "btn-danger"
              }`}
              onClick={confirmApproveReject}
              disabled={actionType === "reject" && !rejectionReason}
            >
              {actionType === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveRejectModal;