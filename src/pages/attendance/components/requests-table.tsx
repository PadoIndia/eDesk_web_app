// import React from "react";
// import { FaCheck, FaBan } from "react-icons/fa";
// import { Punch } from "../../../types/attendance.types";

// interface RequestsTableProps {
//   filteredRequests: Punch[];
//   handleApproveReject: (request: Punch, action: "approve" | "reject") => void;
//   isAdmin: boolean;
// }

// const RequestsTable: React.FC<RequestsTableProps> = ({
//   filteredRequests,
//   handleApproveReject,
// }) => {
//   if (filteredRequests.length === 0) {
//     return (
//       <div className="alert alert-info">
//         No pending miss punch requests found.
//       </div>
//     );
//   }

//   return (
//     <div className="table-responsive">
//       <table className="table table-bordered table-hover">
//         <thead className="table-light">
//           <tr>
//             <th>Employee</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Reason</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredRequests.map((request) => (
//             <tr key={request.id}>
//               <td>{request.userName}</td>
//               <td>
//                 {`${request.date.toString().padStart(2, "0")}/${request.month
//                   .toString()
//                   .padStart(2, "0")}/${request.year}`}
//               </td>
//               <td>
//                 {`${request.hh.toString().padStart(2, "0")}:${request.mm
//                   .toString()
//                   .padStart(2, "0")}`}
//               </td>
//               <td className="text-center">
//                 <div className="btn-group">
//                   <button
//                     className="btn btn-sm btn-success"
//                     onClick={() => handleApproveReject(request, "approve")}
//                   >
//                     <FaCheck className="me-1" /> Approve
//                   </button>
//                   <button
//                     className="btn btn-sm btn-danger"
//                     onClick={() => handleApproveReject(request, "reject")}
//                   >
//                     <FaBan className="me-1" /> Reject
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RequestsTable;



import React from "react";
import { FaCheck, FaBan } from "react-icons/fa";
import { Punch } from "../../../types/attendance.types";

interface RequestsTableProps {
  filteredRequests: Punch[];
  handleApproveReject: (request: Punch, action: "approve" | "reject") => void;
  isAdmin: boolean;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  filteredRequests,
  handleApproveReject,
  isAdmin,
}) => {
  if (filteredRequests.length === 0) {
    return (
      <div className="alert alert-info">
        No pending miss punch requests found.
      </div>
    );
  }

  // Format date as DD/MM/YYYY
  const formatDate = (date: number, month: number, year: number): string => {
    return `${String(date).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  };

  // Format time as HH:MM
  const formatTime = (hh: number, mm: number): string => {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.userName || 'Unknown User'}</td>
              <td>{formatDate(request.date, request.month, request.year)}</td>
              <td>{formatTime(request.hh, request.mm)}</td>
              <td>{request.missPunchReason || 'No reason provided'}</td>
              <td className="text-center">
                {isAdmin && request.isApproved === undefined && (
                  <div className="btn-group">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleApproveReject(request, "approve")}
                    >
                      <FaCheck className="me-1" /> Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleApproveReject(request, "reject")}
                    >
                      <FaBan className="me-1" /> Reject
                    </button>
                  </div>
                )}
                {!isAdmin && (
                  <span className="badge bg-warning">Pending</span>
                )}
                {request.isApproved === true && (
                  <span className="badge bg-success">Approved</span>
                )}
                {request.isApproved === false && (
                  <span className="badge bg-danger">Rejected</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;