import React, { useCallback } from "react";
import { toast } from "react-toastify";
import generalService from "../../../services/api-services/general.service";
import punchDataService from "../../../services/api-services/punch-data.service";
import { useAppSelector } from "../../../store/store";

interface Props {
  formData: {
    name: string;
    date: string;
    time: string;
    reason: string;
    targetUserId: number;
  };
  isAdmin: boolean;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      name: string;
      date: string;
      time: string;
      reason: string;
      targetUserId: number;
    }>
  >;
  onSuccess: () => void;
}

const MissPunchForm: React.FC<Props> = React.memo(
  ({ formData, isAdmin, setFormData, onSuccess }) => {
    const userId = useAppSelector((s) => s.auth.userData?.user.id);
    const handleDateChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, date: e.target.value }));
      },
      [setFormData]
    );

    const handleTimeChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, time: e.target.value }));
      },
      [setFormData]
    );

    const handleReasonChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, reason: e.target.value }));
      },
      [setFormData]
    );

    const handleFormSubmit = async (
      e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
      e.preventDefault();
      if (
        !userId ||
        !formData.time ||
        (!isAdmin && !formData.reason) ||
        (isAdmin && !formData.targetUserId)
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const [hours, minutes] = formData.time.split(":").map(Number);
      const [year, month, day] = formData.date.split("-").map(Number);

      if (!year || !month || !day) {
        toast.error("Invalid date format");
        return;
      }

      const requestData = {
        date: day,
        month,
        year,
        hh: hours,
        mm: minutes,
        userId: formData.targetUserId,
        ...(formData.reason && { missPunchReason: formData.reason }),
      };

      const isSameUser = userId == formData.targetUserId;

      const resp = isSameUser
        ? await generalService.createPunchRequest(requestData)
        : await punchDataService.createPunchData(requestData);

      if (resp.status == "success") {
        setFormData({
          name: "",
          date: "",
          time: "",
          reason: "",
          targetUserId: 0,
        });
        toast.success(resp.message);
        onSuccess();
      } else toast.error(resp.message);
    };

    return (
      <form onSubmit={handleFormSubmit}>
        <div className="modal-body">
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
              required={!isAdmin}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!formData.time || (!formData.reason && !isAdmin)}
          >
            Submit Request
          </button>
        </div>
      </form>
    );
  }
);

export default MissPunchForm;
