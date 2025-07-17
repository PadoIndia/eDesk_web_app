import { FC, useState } from "react";
import { ATTENDANCE_STATUS } from "../../../types/attendance.types";
import { toast } from "react-toastify";
import attendanceDashboardService from "../../../services/api-services/attendance-dashboard.service";
import { Spinner } from "../../../components/loading";
import { AutoAttendanceStatus } from "../../../types/attendance-dashboard.types";

type Props = {
  attendanceId: number;
  status: AutoAttendanceStatus;
  onSuccess: (id: number, status: AutoAttendanceStatus) => void;
};

const AttendanceStatusForm: FC<Props> = ({
  attendanceId,
  status,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<{
    status: AutoAttendanceStatus;
    comment?: string;
  }>({
    status,
  });
  const [loading, setLoading] = useState(false);

  const updateStatus = async () => {
    try {
      if (formData.status == status) return toast.error("Nothing to update!");
      setLoading(true);
      const resp = await attendanceDashboardService.updateAttendanceStatus(
        attendanceId,
        {
          status: formData.status,
          ...(formData.comment && { comment: formData.comment }),
        }
      );
      if (resp.status === "success") {
        toast.success(resp.message);
        onSuccess(attendanceId, formData.status);
      } else toast.error(resp.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Some error!");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = <T extends keyof typeof formData>(
    key: T,
    value: (typeof formData)[T]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-1 d-flex flex-column gap-3">
      <div className="d-flex flex-column gap-2">
        <label htmlFor="attendanceStatus">Status</label>
        <select
          id="attendanceStatus"
          className="form-select form-select-sm"
          size={1}
          style={{ fontSize: "12px" }}
          value={formData.status}
          disabled={loading}
          onChange={(e) =>
            handleChange("status", e.target.value as AutoAttendanceStatus)
          }
        >
          {ATTENDANCE_STATUS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="d-flex flex-column gap-2">
        <label htmlFor="statusComment">Comment</label>

        <textarea
          id="statusComment"
          disabled={loading}
          className="form-control"
          placeholder="Write comment here.."
          value={formData.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
        />
      </div>
      <div className="d-flex">
        <button
          className="btn btn-primary btn-sm "
          disabled={loading}
          onClick={updateStatus}
        >
          {loading ? `${(<Spinner />)}Loading` : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceStatusForm;
