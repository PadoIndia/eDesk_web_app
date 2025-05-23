import React, { useCallback } from "react";

interface UserDepartment {
  id: number;
  name: string;
}

interface MissPunchFormProps {
  formData: {
    name: string;
    date: string;
    time: string;
    reason: string;
    departmentId: number;
    targetUserId: number;
  };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      date: string;
      time: string;
      reason: string;
      departmentId: number;
      targetUserId: number;
    }>
  >;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  setShowMissPunchForm: React.Dispatch<React.SetStateAction<boolean>>;
  userDepartments: UserDepartment[];
  handleDepartmentChange: (departmentId: number) => void;
}

const MissPunchForm: React.FC<MissPunchFormProps> = React.memo(({
  formData,
  setFormData,
  handleFormSubmit,
  setShowMissPunchForm,
  userDepartments,
  handleDepartmentChange,
}) => {
  // OPTIMIZED: Memoized handlers to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    setShowMissPunchForm(false);
  }, [setShowMissPunchForm]);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, date: e.target.value }));
  }, [setFormData]);

  const handleTimeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, time: e.target.value }));
  }, [setFormData]);

  const handleReasonChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, reason: e.target.value }));
  }, [setFormData]);

  const handleDepartmentSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = parseInt(e.target.value);
    handleDepartmentChange(departmentId);
  }, [handleDepartmentChange]);

  // OPTIMIZED: Prevent event bubbling for modal backdrop clicks
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div 
      className="modal fade show" 
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdropClick}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Miss Punch Request {formData.name && `for ${formData.name}`}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            />
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              {/* Show target user name if it's set (for admin requests) */}
              {formData.name && (
                <div className="mb-3">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    disabled
                    style={{ backgroundColor: "#f8f9fa" }}
                  />
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="date" className="form-label">
                  Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  value={formData.date}
                  onChange={handleDateChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="time" className="form-label">
                  Time <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  className="form-control"
                  id="time"
                  value={formData.time}
                  onChange={handleTimeChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="department" className="form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="department"
                  value={formData.departmentId}
                  onChange={handleDepartmentSelect}
                  required
                >
                  <option value="">Select Department</option>
                  {userDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">
                  Reason <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={handleReasonChange}
                  placeholder="Please provide a reason for the miss punch request..."
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!formData.time || !formData.reason || !formData.departmentId}
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

MissPunchForm.displayName = 'MissPunchForm';

export default MissPunchForm;