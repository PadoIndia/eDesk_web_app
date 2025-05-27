import React, { useState } from "react";
import { CreateLeaveTypeRequest, LeaveType } from "../../../types/leave.types";

interface LeaveTypeFormProps {
  type: LeaveType | null;
  onSave: (type: LeaveType) => void;
  onCancel: () => void;
}

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({
  type,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateLeaveTypeRequest>({
    name: type?.name || "",
    isPaid: type?.isPaid ?? true,
    description: type?.description || ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Leave type name is required");
      return;
    }

    onSave({ 
      ...(type || { id: 0, schemesCount: 0 }), // Existing type or new stub
      ...formData 
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Leave Type Name *</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          aria-label="Leave type name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Leave Type *</label>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="paidLeave"
            checked={formData.isPaid}
            onChange={() => setFormData({...formData, isPaid: true})}
            aria-label="Paid leave"
          />
          <label className="form-check-label" htmlFor="paidLeave">
            Paid Leave
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="unpaidLeave"
            checked={!formData.isPaid}
            onChange={() => setFormData({...formData, isPaid: false})}
            aria-label="Unpaid leave"
          />
          <label className="form-check-label" htmlFor="unpaidLeave">
            Unpaid Leave
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value })}
          aria-label="Leave type description"
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default LeaveTypeForm;