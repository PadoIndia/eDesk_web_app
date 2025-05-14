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
} from "react-icons/fa";

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

export const validateEmail = (email: string) =>
  /^\S+@\S+\.\S+$/.test(email);

export const validatePhone = (phone: string) =>
  /^\+?\d{10,15}$/.test(phone);

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();
