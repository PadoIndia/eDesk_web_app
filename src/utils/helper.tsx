// helpers.ts
import {
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
  FaIdCard,
  FaUser,
  FaCalendarAlt,
  FaTransgender,
  FaBusinessTime,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import { Punch } from "../types/attendance.types";

export const getContactTypeIcon = (type: string) => {
  switch (type) {
    case "email":
      return <FaEnvelope className="text-primary" />;
    case "whatsapp":
      return <FaWhatsapp className="text-success" />;
    case "phone":
    default:
      return <FaPhone className="text-primary" />;
  }
};

export const getDetailIcon = (label: string) => {
  switch (label) {
    case "Date of Birth":
      return <FaCalendarAlt />;
    case "Gender":
      return <FaTransgender />;
    case "Joining Date":
      return <FaBusinessTime />;
    case "Address":
      return <FaMapMarkerAlt />;
    case "Documents":
      return <FaFileAlt />;
    default:
      return <FaUser />;
  }
};

export const getDocumentTypeIcon = () => <FaIdCard className="text-primary" />;

export const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export const validatePhone = (phone: string) => /^\+?\d{10,15}$/.test(phone);

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

export const getPunchApprovalIcon = (
  punch: Punch
): React.ReactElement | null => {
  if (punch.type !== "MANUAL") return null;

  if (punch.isApproved === true) {
    return (
      <FaCheckCircle
        className="text-success ms-2"
        title={`Approved by ${punch.approvedBy || "Admin"}`}
      />
    );
  } else if (punch.isApproved === false && punch.approvedBy) {
    return (
      <FaTimesCircle
        className="text-danger ms-2"
        title={`Rejected: ${punch.missPunchReason || "No reason provided"}`}
      />
    );
  } else {
    return (
      <FaHourglassHalf className="text-warning ms-2" title="Pending Approval" />
    );
  }
};
