interface Props extends React.HTMLAttributes<HTMLSpanElement> {
    label: string;
    colorClassName?: string;
    status?: 'PRIMARY' | 'DANGER' | 'SUCCESS' | 'WARNING' | 'INFO';
}


const getStatusColor = (status: Props['status']) => {
    switch (status) {
      case "SUCCESS":
        return "badge-approved";
      case "PRIMARY":
        return "badge-pending";
      case "DANGER":
        return "badge-rejected";
      case "WARNING":
        return "badge-cancelled";
      default:
        return "badge-default";
    }
  };

const Badge = ({label, colorClassName, status, className,...props}:Props) => {
  return (
    <span className={`badge ${ colorClassName ||  getStatusColor(status)} ${className} ` } {...props} >
      {label}
    </span>
  );
};


export default Badge;