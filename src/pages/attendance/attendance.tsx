// import { useState, useEffect } from "react";
// import { 
//   FaEdit, 
//   FaUser, 
//   FaCalendarAlt, 
//   FaPhone, 
//   FaBusinessTime, 
//   FaSave, 
//   FaTimes, 
//   FaPlus,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaFilter,
//   FaDownload,
//   FaSearch,
//   FaUserShield,
//   FaClipboardList,
//   FaCheck,
//   FaBan,
//   FaChevronLeft,
//   FaUserClock,
//   FaBuilding
// } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Badge from "../../components/badge";

// // Define interfaces
// interface Punch {
//   id: number;
//   userId: number;
//   userName: string;
//   userDepartment: string;
//   date: string;
//   time: string;
//   type: "manual" | "auto";
//   isApproved?: boolean;
//   reason?: string;
//   approvedBy?: string;
//   approvedOn?: string;
//   rejectionReason?: string;
// }

// interface AttendanceUser {
//   id: number;
//   name: string;
//   department: string;
//   isAdmin: boolean;
//   punchData: Punch[];
//   attendance: {
//     status: string;
//     statusManual: string;
//     comment: string;
//   };
//   callDetails?: {
//     callDuration: number;
//     missedCalls: number;
//     incoming: number;
//     outgoing: number;
//   };  
//   classDetails?: {
//     glcScheduled: number;
//     glcTaken: number;
//     oplcScheduled: number;
//     oplcTaken: number;
//     gdcScheduled: number;
//     gdcTaken: number;
//     opdcScheduled: number;
//     opdcTaken: number;
//   };
// }

// // Mock data
// const mockUsers: AttendanceUser[] = [
//   { 
//     id: 1, 
//     name: "John Doe", 
//     department: "Sales",
//     isAdmin: true,
//     punchData: [
//       { id: 1, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "09:00", type: "auto", isApproved: true },
//       { id: 2, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "12:30", type: "auto", isApproved: true },
//       { id: 3, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "13:30", type: "auto", isApproved: true },
//       { id: 4, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "18:00", type: "auto", isApproved: true }
//     ],
//     attendance: { 
//       status: "P", 
//       statusManual: "", 
//       comment: "" 
//     },
//     callDetails: {
//       callDuration: 240,
//       missedCalls: 2,
//       incoming: 15,
//       outgoing: 20
//     }
//   },
//   { 
//     id: 2, 
//     name: "Jane Smith", 
//     department: "Marketing",
//     isAdmin: false,
//     punchData: [
//       { id: 5, userId: 2, userName: "Jane Smith", userDepartment: "Marketing", date: "2025-05-08", time: "09:15", type: "auto", isApproved: true },
//       { id: 6, userId: 2, userName: "Jane Smith", userDepartment: "Marketing", date: "2025-05-08", time: "13:45", type: "manual", isApproved: false, rejectionReason: "Inconsistent with work schedule" },
//       { id: 7, userId: 2, userName: "Jane Smith", userDepartment: "Marketing", date: "2025-05-08", time: "17:30", type: "auto", isApproved: true }
//     ],
//     attendance: { 
//       status: "P", 
//       statusManual: "", 
//       comment: "" 
//     }
//   },
//   { 
//     id: 3, 
//     name: "Robert Taylor", 
//     department: "Faculty",
//     isAdmin: true,
//     punchData: [
//       { id: 8, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", date: "2025-05-08", time: "08:45", type: "auto", isApproved: true },
//       { id: 9, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", date: "2025-05-08", time: "18:15", type: "auto", isApproved: true }
//     ],
//     attendance: { 
//       status: "P", 
//       statusManual: "", 
//       comment: "" 
//     },
//     classDetails: {
//       glcScheduled: 2,
//       glcTaken: 2,
//       oplcScheduled: 1,
//       oplcTaken: 1,
//       gdcScheduled: 0,
//       gdcTaken: 0,
//       opdcScheduled: 1,
//       opdcTaken: 1
//     }
//   },
//   { 
//     id: 4, 
//     name: "Alice Johnson", 
//     department: "HR",
//     isAdmin: true,
//     punchData: [
//       { id: 10, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "09:30", type: "auto", isApproved: true },
//       { id: 11, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "13:00", type: "manual", isApproved: true, approvedBy: "Admin", reason: "Forgot to punch", approvedOn: "2025-05-08" },
//       { id: 12, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "14:00", type: "auto", isApproved: true },
//       { id: 13, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "17:45", type: "auto", isApproved: true }
//     ],
//     attendance: { 
//       status: "P", 
//       statusManual: "P", 
//       comment: "Manual approval for missing punch" 
//     }
//   },
//   { 
//     id: 5, 
//     name: "David Wilson", 
//     department: "IT",
//     isAdmin: false,
//     punchData: [
//       { id: 14, userId: 5, userName: "David Wilson", userDepartment: "IT", date: "2025-05-08", time: "09:05", type: "auto", isApproved: true },
//       { id: 15, userId: 5, userName: "David Wilson", userDepartment: "IT", date: "2025-05-08", time: "12:00", type: "auto", isApproved: true },
//       { id: 16, userId: 5, userName: "David Wilson", userDepartment: "IT", date: "2025-05-08", time: "13:00", type: "auto", isApproved: true }
//     ],
//     attendance: { 
//       status: "P", 
//       statusManual: "", 
//       comment: "" 
//     }
//   },
//   {
//     id: 6,
//     name: "Sarah Brown",
//     department: "Mentor",
//     isAdmin: false,
//     punchData: [],
//     attendance: {
//       status: "A",
//       statusManual: "",
//       comment: ""
//     },
//     callDetails: {
//       callDuration: 180,
//       missedCalls: 1,
//       incoming: 12,
//       outgoing: 15
//     }
//   },
//   {
//     id: 7,
//     name: "Michael Chen",
//     department: "Sales",
//     isAdmin: false,
//     punchData: [
//       { id: 17, userId: 7, userName: "Michael Chen", userDepartment: "Sales", date: "2025-05-08", time: "09:10", type: "auto", isApproved: true },
//       { id: 18, userId: 7, userName: "Michael Chen", userDepartment: "Sales", date: "2025-05-07", time: "17:00", type: "manual", isApproved: undefined, reason: "Forgot to punch out" }
//     ],
//     attendance: {
//       status: "P",
//       statusManual: "",
//       comment: ""
//     },
//     callDetails: {
//       callDuration: 150,
//       missedCalls: 3,
//       incoming: 10,
//       outgoing: 22
//     }
//   },
//   {
//     id: 8,
//     name: "Emily Davis",
//     department: "Marketing",
//     isAdmin: false,
//     punchData: [
//       { id: 19, userId: 8, userName: "Emily Davis", userDepartment: "Marketing", date: "2025-05-08", time: "09:20", type: "auto", isApproved: true },
//       { id: 20, userId: 8, userName: "Emily Davis", userDepartment: "Marketing", date: "2025-05-08", time: "12:15", type: "auto", isApproved: true },
//       { id: 21, userId: 8, userName: "Emily Davis", userDepartment: "Marketing", date: "2025-05-08", time: "13:30", type: "auto", isApproved: true }
//     ],
//     attendance: {
//       status: "P",
//       statusManual: "",
//       comment: ""
//     }
//   }
// ];

// // Mock miss punch requests
// const mockMissPunchRequests: Punch[] = [
//   { 
//     id: 22, 
//     userId: 7, 
//     userName: "Michael Chen", 
//     userDepartment: "Sales", 
//     date: "2025-05-07", 
//     time: "17:00", 
//     type: "manual", 
//     isApproved: undefined, 
//     reason: "Forgot to punch out" 
//   },
//   { 
//     id: 23, 
//     userId: 8, 
//     userName: "Emily Davis", 
//     userDepartment: "Marketing", 
//     date: "2025-05-06", 
//     time: "18:15", 
//     type: "manual", 
//     isApproved: undefined, 
//     reason: "System was down" 
//   },
//   { 
//     id: 24, 
//     userId: 5, 
//     userName: "David Wilson", 
//     userDepartment: "IT", 
//     date: "2025-05-07", 
//     time: "17:45", 
//     type: "manual", 
//     isApproved: undefined, 
//     reason: "Working remotely, forgot to log" 
//   }
// ];

// const AttendanceDashboard = () => {
//   // Current user - in a real app would come from auth system
//   const [currentUser, setCurrentUser] = useState<AttendanceUser>(mockUsers[0]);
//   const [users, setUsers] = useState(mockUsers);
//   const [missPunchRequests, setMissPunchRequests] = useState(mockMissPunchRequests);
  
//   // UI state
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [showMissPunchForm, setShowMissPunchForm] = useState(false);
//   const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
//   const [currentRequest, setCurrentRequest] = useState<Punch | null>(null);
//   const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
//   const [rejectionReason, setRejectionReason] = useState("");
  
//   // Form data
//   const [formData, setFormData] = useState({
//     name: "",
//     date: "",
//     time: "",
//     reason: ""
//   });
  
//   // Search and filter
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("All");
  
//   // View state
//   const [currentView, setCurrentView] = useState<"personal" | "department" | "requests">("personal");

//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const years = Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i);
  
//   // Get unique departments for filtering
//   const departments = ["All", ...Array.from(new Set(users.map(user => user.department)))];
  
//   // Get the maximum number of punches for any user
//   const maxPunches = Math.max(...users.map(user => user.punchData ? user.punchData.length : 0));

//   // Filter users based on search, department, and permissions
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment = filterDepartment === "All" || user.department === filterDepartment;
    
//     // For department view, only show users from current user's department
//     if (currentView === "department") {
//       return matchesSearch && matchesDepartment && user.department === currentUser.department;
//     }
    
//     // For personal view, only show current user
//     if (currentView === "personal") {
//       return user.id === currentUser.id;
//     }
    
//     return matchesSearch && matchesDepartment;
//   });

//   // Filter miss punch requests for current user's department
//   const filteredRequests = missPunchRequests.filter(request => 
//     request.userDepartment === currentUser.department && request.isApproved === undefined
//   );

//   useEffect(() => {
//     // Update selectedDate when month or year changes
//     const newDate = new Date(selectedYear, selectedMonth, 1);
//     setSelectedDate(newDate.toISOString().split('T')[0].substring(0, 8) + "01");
//   }, [selectedMonth, selectedYear]);

//   const handleMissPunchRequest = () => {
//     setFormData({
//       name: currentUser.name,
//       date: selectedDate,
//       time: "",
//       reason: ""
//     });
//     setShowMissPunchForm(true);
//   };

//   const handleManualStatusChange = (userId: number, newStatus: string) => {
//     // Update logic (e.g., state update, API call)
//     console.log(`Manual status for user ${userId} changed to ${newStatus}`);
//   };
  

//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
    
//     if (!formData.time || !formData.reason) {
//       toast.error("Please fill all required fields");
//       return;
//     }
    
//     // Create a new miss punch request
//     const newPunch: Punch = {
//       id: Math.max(...missPunchRequests.map(p => p.id), ...users.flatMap(u => u.punchData.map(p => p.id))) + 1,
//       userId: currentUser.id,
//       userName: currentUser.name,
//       userDepartment: currentUser.department,
//       date: formData.date,
//       time: formData.time,
//       type: "manual",
//       reason: formData.reason
//     };
    
//     // Add to miss punch requests
//     setMissPunchRequests([...missPunchRequests, newPunch]);
    
//     // Add to user's punch data as pending
//     const updatedUsers = users.map(user => {
//       if (user.id === currentUser.id) {
//         return {
//           ...user,
//           punchData: [...user.punchData, newPunch]
//         };
//       }
//       return user;
//     });
    
//     setUsers(updatedUsers);
    
//     toast.success("Miss punch request submitted successfully!");
//     setShowMissPunchForm(false);
//   };

//   const handleApproveReject = (request: Punch, action: "approve" | "reject") => {
//     setCurrentRequest(request);
//     setActionType(action);
//     setRejectionReason("");
//     setShowApproveRejectModal(true);
//   };

//   const confirmApproveReject = () => {
//     if (!currentRequest || !actionType) return;
    
//     // Update miss punch requests
//     const updatedRequests = missPunchRequests.map(req => {
//       if (req.id === currentRequest.id) {
//         if (actionType === "approve") {
//           return {
//             ...req,
//             isApproved: true,
//             approvedBy: currentUser.name,
//             approvedOn: new Date().toISOString().split('T')[0]
//           };
//         } else {
//           return {
//             ...req,
//             isApproved: false,
//             rejectionReason
//           };
//         }
//       }
//       return req;
//     });
    
//     // Update the punch data for the user
//     const updatedUsers = users.map(user => {
//       if (user.id === currentRequest.userId) {
//         const updatedPunchData = user.punchData.map(punch => {
//           if (punch.id === currentRequest.id) {
//             if (actionType === "approve") {
//               return {
//                 ...punch,
//                 isApproved: true,
//                 approvedBy: currentUser.name,
//                 approvedOn: new Date().toISOString().split('T')[0]
//               };
//             } else {
//               return {
//                 ...punch,
//                 isApproved: false,
//                 rejectionReason
//               };
//             }
//           }
//           return punch;
//         });
        
//         return {
//           ...user,
//           punchData: updatedPunchData
//         };
//       }
//       return user;
//     });
    
//     setMissPunchRequests(updatedRequests);
//     setUsers(updatedUsers);
    
//     toast.success(`Request ${actionType === "approve" ? "approved" : "rejected"} successfully!`);
//     setShowApproveRejectModal(false);
//   };

//   const getPunchRowColor = (user: AttendanceUser): string => {
//     if (!user.punchData || user.punchData.length === 0) {
//       if (user.attendance.status === "A") {
//         return "table-danger";
//       }
//       return "";
//     }
    
//     // Check if odd number of punches and not in specified departments
//     if (user.punchData.length % 2 !== 0 && 
//         !["BD", "Mentor", "Faculty"].includes(user.department)) {
//       return "table-warning";
//     }
    
//     // Check if any punch is not approved
//     const hasPendingRequest = user.punchData.some((punch: Punch) => 
//       punch.type === "manual" && punch.isApproved === undefined);
//     if (hasPendingRequest) return "table-warning";
    
//     // Check if any punch request was rejected
//     const hasRejectedRequest = user.punchData.some((punch: Punch) => 
//       punch.type === "manual" && punch.isApproved === false);
//     if (hasRejectedRequest) return "table-danger";
    
//     // Check if any punch request was approved
//     const hasApprovedRequest = user.punchData.some((punch: Punch) => 
//       punch.type === "manual" && punch.isApproved === true);
//     if (hasApprovedRequest) return "table-success";
    
//     return "";
//   };

//   const getStatusBadge = (status: string): React.ReactElement => {
//     switch(status) {
//       case "P":
//         return <Badge label="Present" status="SUCCESS"/> ;
//       case "A":
//         return <Badge label="Absent" status="DANGER"/>;
//       case "L":
//         return <Badge label="Leave" status="WARNING"/>;
//       case "H":
//         return <Badge label="Holiday" status="PRIMARY"/> ;
//       default:
//         return <Badge label={status} />;
//     }
//   };

//   const getPunchApprovalIcon = (punch: Punch): React.ReactElement | null => {
//     if (punch.type !== "manual") return null;
    
//     if (punch.isApproved === true) {
//       return <FaCheckCircle className="text-success ms-2" title={`Approved by ${punch.approvedBy} on ${punch.approvedOn}`} />;
//     } else if (punch.isApproved === false) {
//       return <FaTimesCircle className="text-danger ms-2" title={`Rejected: ${punch.rejectionReason}`} />;
//     } else {
//       return <FaHourglassHalf className="text-warning ms-2" title="Pending Approval" />;
//     }
//   };

//   const exportAttendanceData = () => {
//     // In a real app, this would generate a CSV or Excel file
//     toast.info("Exporting attendance data...");
//   };
  
//   // UI Components
//   const renderHeader = () => (
//     <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
//       <h3 className="mb-0 d-flex align-items-center gap-3">
//         {currentView === "personal" && (
//           <>
//             <FaUserClock className="me-2" />
//             Personal Attendance
//           </>
//         )}
//         {currentView === "department" && (
//           <>
//             <FaBuilding className="me-2" />
//             {currentUser.department} Department Attendance
//           </>
//         )}
//         {currentView === "requests" && (
//           <>
//             <FaClipboardList className="me-2" />
//             Miss Punch Requests
//           </>
//         )}
//       </h3>
//       {/* Admin Controls */}
//       {currentUser.isAdmin && (
//         <div className="d-flex gap-2">
//           <button 
//             className={`btn ${currentView === "personal" ? "btn-light" : "btn-outline-light"}`}
//             onClick={() => setCurrentView("personal")}
//           >
//             <FaUser className="me-1" /> My Attendance
//           </button>
//           <button 
//             className={`btn ${currentView === "department" ? "btn-light" : "btn-outline-light"}`}
//             onClick={() => setCurrentView("department")}
//           >
//             <FaBuilding className="me-1" /> Department
//           </button>
//           <button 
//             className={`btn ${currentView === "requests" ? "btn-light" : "btn-outline-light"}`}
//             onClick={() => setCurrentView("requests")}
//             style={{ position: 'relative' }}
//           >
//             <FaClipboardList className="me-1" /> Requests
//             {filteredRequests.length > 0 && (
//               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                 {filteredRequests.length}
//               </span>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
  
//   const renderControls = () => (
//     <>
//       {/* Controls and Filters */}
//       <div className="row g-3 mb-4 align-items-end">
//         {/* Date Controls */}
//         <div className="col-md-6 col-lg-3">
//           <label htmlFor="month" className="form-label">Month</label>
//           <select
//             id="month"
//             className="form-select"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//           >
//             {months.map((month, index) => (
//               <option key={month} value={index}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="col-md-6 col-lg-2">
//           <label htmlFor="year" className="form-label">Year</label>
//           <select
//             id="year"
//             className="form-select"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//           >
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="col-md-6 col-lg-3">
//           <label htmlFor="date" className="form-label">Specific Date</label>
//           <input
//             type="date"
//             id="date"
//             className="form-control"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//         </div>
        
//         {/* Search and Filter - Only show in department view */}
//         {currentView === "department" && (
//           <div className="col-md-6 col-lg-4">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <FaSearch />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search by name"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button 
//                 className="btn btn-outline-secondary" 
//                 type="button" 
//                 onClick={exportAttendanceData}
//                 title="Export Data"
//               >
//                 <FaDownload />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Request Miss Punch - Only in personal view */}
//         {currentView === "personal" && currentUser.punchData.length % 2 !== 0 && (
//           <div className="col-md-4 col-lg-4 ms-auto">
//             <button
//               className="btn btn-primary w-100"
//               onClick={handleMissPunchRequest}
//             >
//               <FaPlus className="me-2" /> Request Miss Punch
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Color indicators */}
//       {currentView !== "requests" && (
//         <div className="mb-3 d-flex justify-content-end">
//           <div className="d-flex align-items-center me-3">
//             <span className="badge bg-warning me-1">&nbsp;</span>
//             <small>Pending/Missing Punch</small>
//           </div>
//           <div className="d-flex align-items-center me-3">
//             <span className="badge bg-success me-1">&nbsp;</span>
//             <small>Approved Manual Punch</small>
//           </div>
//           <div className="d-flex align-items-center">
//             <span className="badge bg-danger me-1">&nbsp;</span>
//             <small>Rejected Request/Absent</small>
//           </div>
//         </div>
//       )}
//     </>
//   );
  
//   // const renderAttendanceTable = () => (
//   //   <div className="table-responsive">
//   //     <table className="table table-bordered table-hover">
//   //       <thead className="table-light">
//   //         <tr>
//   //           <th className="text-center" style={{ width: "40px" }}>#</th>
//   //           <th>Name</th>
//   //           {currentView === "department" && <th>Department</th>}
            
//   //           {/* Punch columns - dynamic based on max punches */}
//   //           {Array.from({ length: maxPunches }, (_, i) => (
//   //             <th key={`punch-${i}`} className="text-center">
//   //               Punch {i + 1}
//   //             </th>
//   //           ))}
            
//   //           <th className="text-center">Status</th>
//   //           <th className="text-center">Manual Status</th>
//   //           <th>Additional Info</th>
//   //           <th className="text-center">Actions</th>
//   //         </tr>
//   //       </thead>
//   //       <tbody>
//   //         {filteredUsers.length > 0 ? (
//   //           filteredUsers.map((user, index) => (
//   //             <tr key={user.id} className={getPunchRowColor(user)}>
//   //               <td className="text-center">{index + 1}</td>
//   //               <td>
//   //                 <div className="d-flex align-items-center">
//   //                   <FaUser className="text-primary me-2" />
//   //                   {user.name}
//   //                 </div>
//   //               </td>
//   //               {currentView === "department" && <td>{user.department}</td>}
                
//   //               {/* Punch data cells */}
//   //               {Array.from({ length: maxPunches }, (_, i) => (
//   //                 <td key={`punch-${user.id}-${i}`} className="text-center">
//   //                   {user.punchData && user.punchData[i] ? (
//   //                     <div className="d-flex justify-content-center align-items-center">
//   //                       <span className={user.punchData[i].type === "manual" ? "text-primary fw-bold" : ""}>
//   //                         {user.punchData[i].time}
//   //                       </span>
//   //                       {getPunchApprovalIcon(user.punchData[i])}
//   //                     </div>
//   //                   ) : "—"}
//   //                 </td>
//   //               ))}
                
//   //               {/* Status cells */}
//   //               <td className="text-center">{getStatusBadge(user.attendance.status)}</td>
//   //               <td className="text-center">
//   //                 {user.attendance.statusManual ? 
//   //                   getStatusBadge(user.attendance.statusManual) : 
//   //                   <span className="text-muted">—</span>}
//   //               </td>
                
//   //               {/* Department specific info */}
//   //               <td>
//   //                 {user.department === "Sales" || user.department === "Mentor" ? (
//   //                   <div className="small">
//   //                     <div><span className="fw-bold">GLC:</span> {user.classDetails?.glcTaken}/{user.classDetails?.glcScheduled}</div>
//   //                     <div><span className="fw-bold">OPLC:</span> {user.classDetails?.oplcTaken}/{user.classDetails?.oplcScheduled}</div>
//   //                     <div><span className="fw-bold">GDC:</span> {user.classDetails?.gdcTaken}/{user.classDetails?.gdcScheduled}</div>
//   //                     <div><span className="fw-bold">OPDC:</span> {user.classDetails?.opdcTaken}/{user.classDetails?.opdcScheduled}</div>
//   //                   </div>
//   //                 ) : (
//   //                   <span className="text-muted">—</span>
//   //                 )}
//   //               </td>
                
//   //               {/* Actions */}
//   //               <td className="text-center">
//   //                 {user.id === currentUser.id && user.punchData && user.punchData.length % 2 !== 0 && 
//   //                 !["BD", "Mentor", "Faculty"].includes(user.department) && (
//   //                   <button
//   //                     className="btn btn-sm btn-primary"
//   //                     onClick={handleMissPunchRequest}
//   //                     title="Request Missing Punch"
//   //                   >
//   //                     <FaPlus className="me-1" />
//   //                     Miss Punch
//   //                   </button>
//   //                 )}
//   //               </td>
//   //             </tr>
//   //           ))
//   //         ) : (
//   //           <tr>
//   //             <td colSpan={maxPunches + (currentView === "department" ? 7 : 6)} className="text-center py-3">
//   //               No users found matching your search criteria
//   //             </td>
//   //           </tr>
//   //         )}
//   //       </tbody>
//   //     </table>
//   //   </div>
//   // );
  




//   // const renderAttendanceTable = () => (
//   //   <div className="table-responsive">
//   //     <table className="table table-bordered table-hover">
//   //       <thead className="table-light">
//   //         <tr>
//   //           <th className="text-center" style={{ width: "40px" }}>#</th>
//   //           <th>Name</th>
//   //           {currentView === "department" && <th>Department</th>}
  
//   //           {/* Punch columns - dynamic based on max punches */}
//   //           {Array.from({ length: maxPunches }, (_, i) => (
//   //             <th key={`punch-${i}`} className="text-center">
//   //               Punch {i + 1}
//   //             </th>
//   //           ))}
  
//   //           <th className="text-center">Status</th>
//   //           <th className="text-center">Manual Status</th>
//   //           <th>Additional Info</th>
//   //           <th className="text-center">Actions</th>
//   //         </tr>
//   //       </thead>
//   //       <tbody>
//   //         {filteredUsers.length > 0 ? (
//   //           filteredUsers.map((user, index) => (
//   //             <tr key={user.id} className={getPunchRowColor(user)}>
//   //               <td className="text-center">{index + 1}</td>
//   //               <td>
//   //                 <div className="d-flex align-items-center">
//   //                   <FaUser className="text-primary me-2" />
//   //                   {user.name}
//   //                 </div>
//   //               </td>
//   //               {currentView === "department" && <td>{user.department}</td>}
  
//   //               {/* Punch data cells */}
//   //               {Array.from({ length: maxPunches }, (_, i) => (
//   //                 <td key={`punch-${user.id}-${i}`} className="text-center">
//   //                   {user.punchData && user.punchData[i] ? (
//   //                     <div className="d-flex justify-content-center align-items-center">
//   //                       <span className={user.punchData[i].type === "manual" ? "text-primary fw-bold" : ""}>
//   //                         {user.punchData[i].time}
//   //                       </span>
//   //                       {getPunchApprovalIcon(user.punchData[i])}
//   //                     </div>
//   //                   ) : "—"}
//   //                 </td>
//   //               ))}
  
//   //               {/* Status cells */}
//   //               <td className="text-center">{getStatusBadge(user.attendance.status)}</td>
//   //               <td className="text-center">
//   //                 {user.attendance.statusManual ?
//   //                   getStatusBadge(user.attendance.statusManual) :
//   //                   <span className="text-muted">—</span>}
//   //               </td>
  
//   //               {/* Additional Info: show any available details */}
//   //               <td>
//   //                 {user.classDetails || user.callDetails ? (
//   //                   <div className="small">
//   //                     {user.classDetails && (
//   //                       <>
//   //                         {user.classDetails.glcScheduled != null && (
//   //                           <div><span className="fw-bold">GLC:</span> {user.classDetails.glcTaken}/{user.classDetails.glcScheduled}</div>
//   //                         )}
//   //                         {user.classDetails.oplcScheduled != null && (
//   //                           <div><span className="fw-bold">OPLC:</span> {user.classDetails.oplcTaken}/{user.classDetails.oplcScheduled}</div>
//   //                         )}
//   //                         {user.classDetails.gdcScheduled != null && (
//   //                           <div><span className="fw-bold">GDC:</span> {user.classDetails.gdcTaken}/{user.classDetails.gdcScheduled}</div>
//   //                         )}
//   //                         {user.classDetails.opdcScheduled != null && (
//   //                           <div><span className="fw-bold">OPDC:</span> {user.classDetails.opdcTaken}/{user.classDetails.opdcScheduled}</div>
//   //                         )}
//   //                       </>
//   //                     )}
//   //                     {user.callDetails && (
//   //                       <>
//   //                         <div><span className="fw-bold">Call Duration:</span> {user.callDetails.callDuration} mins</div>
//   //                         <div><span className="fw-bold">Missed Calls:</span> {user.callDetails.missedCalls}</div>
//   //                         <div><span className="fw-bold">Incoming:</span> {user.callDetails.incoming}</div>
//   //                         <div><span className="fw-bold">Outgoing:</span> {user.callDetails.outgoing}</div>
//   //                       </>
//   //                     )}
//   //                   </div>
//   //                 ) : (
//   //                   <span className="text-muted">—</span>
//   //                 )}
//   //               </td>
  
//   //               {/* Actions */}
//   //               <td className="text-center">
//   //                 {user.id === currentUser.id && user.punchData && user.punchData.length % 2 !== 0 &&
//   //                   !["BD", "Mentor", "Faculty"].includes(user.department) && (
//   //                     <button
//   //                       className="btn btn-sm btn-primary"
//   //                       onClick={handleMissPunchRequest}
//   //                       title="Request Missing Punch"
//   //                     >
//   //                       <FaPlus className="me-1" />
//   //                       Miss Punch
//   //                     </button>
//   //                   )}
//   //               </td>
//   //             </tr>
//   //           ))
//   //         ) : (
//   //           <tr>
//   //             <td colSpan={maxPunches + (currentView === "department" ? 7 : 6)} className="text-center py-3">
//   //               No users found matching your search criteria
//   //             </td>
//   //           </tr>
//   //         )}
//   //       </tbody>
//   //     </table>
//   //   </div>
//   // );
  

//   const renderAttendanceTable = () => (
//     <div className="table-responsive">
//       <table className="table table-bordered table-hover">
//         <thead className="table-light">
//           <tr>
//             <th className="text-center" style={{ width: "40px" }}>#</th>
//             <th>Name</th>
//             {currentView === "department" && <th>Department</th>}
  
//             {/* Punch columns - dynamic based on max punches */}
//             {Array.from({ length: maxPunches }, (_, i) => (
//               <th key={`punch-${i}`} className="text-center">
//                 Punch {i + 1}
//               </th>
//             ))}
  
//             <th className="text-center">Status</th>
//             <th className="text-center">Manual Status</th>
//             <th>Additional Info</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredUsers.length > 0 ? (
//             filteredUsers.map((user, index) => (
//               <tr key={user.id} className={getPunchRowColor(user)}>
//                 <td className="text-center">{index + 1}</td>
//                 <td>
//                   <div className="d-flex align-items-center">
//                     <FaUser className="text-primary me-2" />
//                     {user.name}
//                   </div>
//                 </td>
//                 {currentView === "department" && <td>{user.department}</td>}
  
//                 {/* Punch data cells */}
//                 {Array.from({ length: maxPunches }, (_, i) => (
//                   <td key={`punch-${user.id}-${i}`} className="text-center">
//                     {user.punchData && user.punchData[i] ? (
//                       <div className="d-flex justify-content-center align-items-center">
//                         <span className={user.punchData[i].type === "manual" ? "text-primary fw-bold" : ""}>
//                           {user.punchData[i].time}
//                         </span>
//                         {getPunchApprovalIcon(user.punchData[i])}
//                       </div>
//                     ) : "—"}
//                   </td>
//                 ))}
  
//                 {/* Status */}
//                 <td className="text-center">{getStatusBadge(user.attendance.status)}</td>
  
//                 {/* Manual Status - dropdown if in department tab and not current user */}
//                 <td className="text-center">
//                   {currentView === "department" && user.id !== currentUser.id ? (
//                     <select
//                       className="form-select form-select-sm"
//                       value={user.attendance.statusManual || ""}
//                       onChange={(e) => handleManualStatusChange(user.id, e.target.value)}
//                     >
//                       <option value="">—</option>
//                       <option value="P">Present</option>
//                       <option value="A">Absent</option>
//                     </select>
//                   ) : (
//                     user.attendance.statusManual ?
//                       getStatusBadge(user.attendance.statusManual) :
//                       <span className="text-muted">—</span>
//                   )}
//                 </td>
  
//                 {/* Additional Info */}
//                 <td>
//                   {user.classDetails || user.callDetails ? (
//                     <div className="small">
//                       {user.classDetails && (
//                         <>
//                           {user.classDetails.glcScheduled != null && (
//                             <div><span className="fw-bold">GLC:</span> {user.classDetails.glcTaken}/{user.classDetails.glcScheduled}</div>
//                           )}
//                           {user.classDetails.oplcScheduled != null && (
//                             <div><span className="fw-bold">OPLC:</span> {user.classDetails.oplcTaken}/{user.classDetails.oplcScheduled}</div>
//                           )}
//                           {user.classDetails.gdcScheduled != null && (
//                             <div><span className="fw-bold">GDC:</span> {user.classDetails.gdcTaken}/{user.classDetails.gdcScheduled}</div>
//                           )}
//                           {user.classDetails.opdcScheduled != null && (
//                             <div><span className="fw-bold">OPDC:</span> {user.classDetails.opdcTaken}/{user.classDetails.opdcScheduled}</div>
//                           )}
//                         </>
//                       )}
//                       {user.callDetails && (
//                         <>
//                           <div><span className="fw-bold">Call Duration:</span> {user.callDetails.callDuration} mins</div>
//                           <div><span className="fw-bold">Missed Calls:</span> {user.callDetails.missedCalls}</div>
//                           <div><span className="fw-bold">Incoming:</span> {user.callDetails.incoming}</div>
//                           <div><span className="fw-bold">Outgoing:</span> {user.callDetails.outgoing}</div>
//                         </>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="text-muted">—</span>
//                   )}
//                 </td>
  
//                 {/* Actions */}
//                 <td className="text-center">
//                   {user.id === currentUser.id && user.punchData && user.punchData.length % 2 !== 0 &&
//                     !["BD", "Mentor", "Faculty"].includes(user.department) && (
//                       <button
//                         className="btn btn-sm btn-primary"
//                         onClick={handleMissPunchRequest}
//                         title="Request Missing Punch"
//                       >
//                         <FaPlus className="me-1" />
//                         Miss Punch
//                       </button>
//                     )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={maxPunches + (currentView === "department" ? 7 : 6)} className="text-center py-3">
//                 No users found matching your search criteria
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
  


//   const renderRequestsTable = () => (
//     <div className="table-responsive">
//       <table className="table table-bordered table-hover">
//         <thead className="table-light">
//           <tr>
//             <th className="text-center" style={{ width: "40px" }}>#</th>
//             <th>Employee</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Reason</th>
//             <th className="text-center">Status</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredRequests.length > 0 ? (
//             filteredRequests.map((request, index) => (
//               <tr key={request.id}>
//                 <td className="text-center">{index + 1}</td>
//                 <td>
//                   <div className="d-flex align-items-center">
//                     <FaUser className="text-primary me-2" />
//                     {request.userName}
//                   </div>
//                 </td>
//                 <td>{request.date}</td>
//                 <td>{request.time}</td>
//                 <td>{request.reason}</td>
//                 <td className="text-center">
//                   <Badge label="Pending" status="WARNING" />
//                 </td>
//                 <td className="text-center">
//                   <div className="btn-group">
//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => handleApproveReject(request, "approve")}
//                       title="Approve Request"
//                     >
//                       <FaCheck className="me-1" />
//                       Approve
//                     </button>
//                     <button
//                       className="btn btn-sm btn-danger"
//                       onClick={() => handleApproveReject(request, "reject")}
//                       title="Reject Request"
//                     >
//                       <FaBan className="me-1" />
//                       Reject
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={7} className="text-center py-3">
//                 No pending miss punch requests for your department
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Main render
//   return (
//     <div className="container py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       {/* User welcome banner */}
//       <div className="alert alert-primary d-flex align-items-center mb-4">
//         <FaUserShield className="me-2" size={24} />
//         <div>
//           <strong>Welcome, {currentUser.name}!</strong> 
//           <span className="ms-2">
//             {currentUser.isAdmin ? `You have admin privileges for the ${currentUser.department} department.` : "Here's your attendance data."}
//           </span>
//         </div>
//       </div>
      
//       <div className="card shadow mb-4">
//         {renderHeader()}
        
//         <div className="card-body">
//           {renderControls()}
          
//           {/* Content based on current view */}
//           {currentView !== "requests" ? renderAttendanceTable() : renderRequestsTable()}
//         </div>
//       </div>
      
//       {/* Miss Punch Form Modal */}
//       {showMissPunchForm && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   <FaBusinessTime className="me-2" />
//                   Miss Punch Request
//                 </h5>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowMissPunchForm(false)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <form onSubmit={handleFormSubmit}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label d-flex align-items-center" htmlFor="name">
//                       <FaUser className="me-2 text-primary" />
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       readOnly
//                       className="form-control bg-light"
//                     />
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label d-flex align-items-center" htmlFor="date">
//                       <FaCalendarAlt className="me-2 text-primary" />
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       id="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleFormChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label d-flex align-items-center" htmlFor="time">
//                       <FaBusinessTime className="me-2 text-primary" />
//                       Time
//                     </label>
//                     <input
//                       type="time"
//                       id="time"
//                       name="time"
//                       value={formData.time}
//                       onChange={handleFormChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label" htmlFor="reason">
//                       Reason for Miss Punch
//                     </label>
//                     <textarea
//                       id="reason"
//                       name="reason"
//                       value={formData.reason}
//                       onChange={handleFormChange}
//                       className="form-control"
//                       rows={3}
//                       required
//                       placeholder="Please provide a detailed reason..."
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowMissPunchForm(false)}
//                   >
//                     <FaTimes className="me-1" /> Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                   >
//                     <FaSave className="me-1" /> Submit Request
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Approve/Reject Modal */}
//       {showApproveRejectModal && currentRequest && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   {actionType === "approve" ? (
//                     <><FaCheckCircle className="me-2" /> Approve Request</>
//                   ) : (
//                     <><FaTimesCircle className="me-2" /> Reject Request</>
//                   )}
//                 </h5>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowApproveRejectModal(false)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <h6 className="card-subtitle mb-2 text-muted">Request Details</h6>
//                     <div className="mb-2">
//                       <strong>Employee: </strong>{currentRequest.userName}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Date: </strong>{currentRequest.date}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Time: </strong>{currentRequest.time}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Reason: </strong>{currentRequest.reason}
//                     </div>
//                   </div>
//                 </div>
                
//                 {actionType === "reject" && (
//                   <div className="mb-3">
//                     <label className="form-label" htmlFor="rejectionReason">
//                       Rejection Reason
//                     </label>
//                     <textarea
//                       id="rejectionReason"
//                       value={rejectionReason}
//                       onChange={(e) => setRejectionReason(e.target.value)}
//                       className="form-control"
//                       rows={3}
//                       required
//                       placeholder="Please provide a reason for rejection..."
//                     ></textarea>
//                   </div>
//                 )}
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowApproveRejectModal(false)}
//                 >
//                   <FaTimes className="me-1" /> Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className={`btn ${actionType === "approve" ? "btn-success" : "btn-danger"}`}
//                   onClick={confirmApproveReject}
//                   disabled={actionType === "reject" && !rejectionReason}
//                 >
//                   {actionType === "approve" ? (
//                     <><FaCheck className="me-1" /> Confirm Approval</>
//                   ) : (
//                     <><FaBan className="me-1" /> Confirm Rejection</>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* User selector - For demo purposes only */}
//       <div className="card mt-4">
//         <div className="card-header bg-secondary text-white">
//           <h5 className="mb-0">Demo Controls</h5>
//         </div>
//         <div className="card-body">
//           <div className="mb-3">
//             <label className="form-label">Switch User (Demo Only)</label>
//             <select 
//               className="form-select"
//               value={currentUser.id}
//               onChange={(e) => {
//                 const userId = parseInt(e.target.value);
//                 const user = users.find(u => u.id === userId);
//                 if (user) {
//                   setCurrentUser(user);
//                   setCurrentView("personal");
//                 }
//               }}
//             >
//               {users.map(user => (
//                 <option key={user.id} value={user.id}>
//                   {user.name} ({user.department}{user.isAdmin ? " - Admin" : ""})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceDashboard;







//////////////////////////////// Above is the already working code ////////////////////////////////////////////















// import { useState, useEffect } from "react";
// import { 
//   FaEdit, 
//   FaUser, 
//   FaCalendarAlt, 
//   FaPhone, 
//   FaBusinessTime, 
//   FaSave, 
//   FaTimes, 
//   FaPlus,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaFilter,
//   FaDownload,
//   FaSearch,
//   FaUserShield,
//   FaClipboardList,
//   FaCheck,
//   FaBan,
//   FaChevronLeft,
//   FaUserClock,
//   FaBuilding
// } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Badge from "../../components/badge";
// import AttendanceTables from "./AttendanceTable";

// // Define interfaces
// interface Punch {
//   id: number;
//   userId: number;
//   userName: string;
//   userDepartment: string;
//   date: string;
//   time: string;
//   type: "manual" | "auto";
//   isApproved?: boolean;
//   reason?: string;
//   approvedBy?: string;
//   approvedOn?: string;
//   rejectionReason?: string;
// }

// interface CallDetails {
//   id: number;
//   callDuration: number;
//   missedCalls: number;
//   incoming: number;
//   outgoing: number;
//   date: string;
// }

// interface ClassDetails {
//   id: number;
//   glcScheduled: number;
//   glcTaken: number;
//   oplcScheduled: number;
//   oplcTaken: number;
//   gdcScheduled: number;
//   gdcTaken: number;
//   opdcScheduled: number;
//   opdcTaken: number;
//   date: string;
// }


// interface AttendanceUser {
//   id: number;
//   name: string;
//   department: string;
//   isAdmin: boolean;
//   punchData: Punch[];
//   attendance: {
//     status: string;
//     statusManual: string;
//     comment: string;
//   };
//   callDetails?: CallDetails[];
//   classDetails?: ClassDetails[];
// }

// // Mock data
// // const mockUsers: AttendanceUser[] = [
// //   { 
// //     id: 1, 
// //     name: "John Doe", 
// //     department: "Sales",
// //     isAdmin: true,
// //     punchData: [
     
// //     ],
// //     attendance: { 
// //       status: "P", 
// //       statusManual: "", 
// //       comment: "" 
// //     },
// //     callDetails: [
// //       {id:1, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-08"},
// //       {id:2, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-09"},
// //       {id:3, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-10"}
// //     ],
// //   },
// //   { 
// //     id: 2, 
// //     name: "Jane Smith", 
// //     department: "Marketing",
// //     isAdmin: false,
// //     punchData: [
// //       { id: 5, userId: 2, userName: "Jane Smith", userDepartment: "Marketing", date: "2025-05-08", time: "09:15", type: "auto", isApproved: true },
// //       { id: 6, userId: 2, userName: "Jane Smith", userDepartment: "Marketing", date: "2025-05-08", time: "13:45", type: "manual", isApproved: false, rejectionReason: "Inconsistent with work schedule" },
// //       { id: 7, userId: 2, userName: "Jane Smith", userDepartment: "Marketing", date: "2025-05-08", time: "17:30", type: "auto", isApproved: true }
// //     ],
// //     attendance: { 
// //       status: "P", 
// //       statusManual: "", 
// //       comment: "" 
// //     }
// //   },
// //   { 
// //     id: 3, 
// //     name: "Robert Taylor", 
// //     department: "Faculty",
// //     isAdmin: true,
// //     punchData: [
// //       { id: 8, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", date: "2025-05-08", time: "08:45", type: "auto", isApproved: true },
// //       { id: 9, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", date: "2025-05-08", time: "18:15", type: "auto", isApproved: true }
// //     ],
// //     attendance: { 
// //       status: "P", 
// //       statusManual: "", 
// //       comment: "" 
// //     },
// //     classDetails: {
// //       glcScheduled: 2,
// //       glcTaken: 2,
// //       oplcScheduled: 1,
// //       oplcTaken: 1,
// //       gdcScheduled: 0,
// //       gdcTaken: 0,
// //       opdcScheduled: 1,
// //       opdcTaken: 1
// //     }
// //   },
// //   { 
// //     id: 4, 
// //     name: "Alice Johnson", 
// //     department: "HR",
// //     isAdmin: true,
// //     punchData: [
// //       { id: 10, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "09:30", type: "auto", isApproved: true },
// //       { id: 11, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "13:00", type: "manual", isApproved: true, approvedBy: "Admin", reason: "Forgot to punch", approvedOn: "2025-05-08" },
// //       { id: 12, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "14:00", type: "auto", isApproved: true },
// //       { id: 13, userId: 4, userName: "Alice Johnson", userDepartment: "HR", date: "2025-05-08", time: "17:45", type: "auto", isApproved: true }
// //     ],
// //     attendance: { 
// //       status: "P", 
// //       statusManual: "P", 
// //       comment: "Manual approval for missing punch" 
// //     }
// //   },
// //   { 
// //     id: 5, 
// //     name: "David Wilson", 
// //     department: "IT",
// //     isAdmin: false,
// //     punchData: [
// //       { id: 14, userId: 5, userName: "David Wilson", userDepartment: "IT", date: "2025-05-08", time: "09:05", type: "auto", isApproved: true },
// //       { id: 15, userId: 5, userName: "David Wilson", userDepartment: "IT", date: "2025-05-08", time: "12:00", type: "auto", isApproved: true },
// //       { id: 16, userId: 5, userName: "David Wilson", userDepartment: "IT", date: "2025-05-08", time: "13:00", type: "auto", isApproved: true }
// //     ],
// //     attendance: { 
// //       status: "P", 
// //       statusManual: "", 
// //       comment: "" 
// //     }
// //   },
// //   {
// //     id: 6,
// //     name: "Sarah Brown",
// //     department: "Mentor",
// //     isAdmin: false,
// //     punchData: [],
// //     attendance: {
// //       status: "A",
// //       statusManual: "",
// //       comment: ""
// //     },
// //     callDetails: {
// //       callDuration: 180,
// //       missedCalls: 1,
// //       incoming: 12,
// //       outgoing: 15
// //     }
// //   },
// //   {
// //     id: 7,
// //     name: "Michael Chen",
// //     department: "Sales",
// //     isAdmin: false,
// //     punchData: [
// //       { id: 17, userId: 7, userName: "Michael Chen", userDepartment: "Sales", date: "2025-05-08", time: "09:10", type: "auto", isApproved: true },
// //       { id: 18, userId: 7, userName: "Michael Chen", userDepartment: "Sales", date: "2025-05-07", time: "17:00", type: "manual", isApproved: undefined, reason: "Forgot to punch out" }
// //     ],
// //     attendance: {
// //       status: "P",
// //       statusManual: "",
// //       comment: ""
// //     },
// //     callDetails: {
// //       callDuration: 150,
// //       missedCalls: 3,
// //       incoming: 10,
// //       outgoing: 22
// //     }
// //   },
// //   {
// //     id: 8,
// //     name: "Emily Davis",
// //     department: "Marketing",
// //     isAdmin: false,
// //     punchData: [
// //       { id: 19, userId: 8, userName: "Emily Davis", userDepartment: "Marketing", date: "2025-05-08", time: "09:20", type: "auto", isApproved: true },
// //       { id: 20, userId: 8, userName: "Emily Davis", userDepartment: "Marketing", date: "2025-05-08", time: "12:15", type: "auto", isApproved: true },
// //       { id: 21, userId: 8, userName: "Emily Davis", userDepartment: "Marketing", date: "2025-05-08", time: "13:30", type: "auto", isApproved: true }
// //     ],
// //     attendance: {
// //       status: "P",
// //       statusManual: "",
// //       comment: ""
// //     }
// //   },
// // ];


// const mockUsers: AttendanceUser[] = [
//   // Existing users corrected
//   { 
//     id: 1, 
//     name: "John Doe", 
//     department: "Sales",
//     isAdmin: true,
//     punchData: [
//       // ... keep existing punch data
//       { id: 1, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "09:00", type: "auto", isApproved: true },
//       { id: 2, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "12:30", type: "auto", isApproved: true },
//       { id: 3, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "13:30", type: "auto", isApproved: true },
//       { id: 4, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "18:00", type: "auto", isApproved: true },
//       { id: 5, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "09:00", type: "auto", isApproved: true },
//       { id: 6, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "12:30", type: "auto", isApproved: true },
//       { id: 7, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "13:30", type: "auto", isApproved: true },
//       { id: 8, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "18:00", type: "auto", isApproved: true },
//       { id: 9, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "09:00", type: "auto", isApproved: true },
//       { id: 10, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "12:30", type: "auto", isApproved: true },
//       { id: 11, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "13:30", type: "auto", isApproved: true },
//       { id: 12, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "18:00", type: "auto", isApproved: true },
//     ],
//     attendance: { status: "P", statusManual: "", comment: "" },
//     callDetails: [
//       {id:1, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-08"},
//       {id:2, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-09"},
//       {id:3, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-10"}
//     ],
//   },
//   { 
//     id: 3, 
//     name: "Robert Taylor", 
//     department: "Faculty",
//     isAdmin: true,
//     punchData: [
//       { id: 8, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", 
//         date: "2025-05-08", time: "08:45", type: "auto", isApproved: true },
//       { id: 9, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", 
//         date: "2025-05-08", time: "18:15", type: "auto", isApproved: true }
//     ],
//     attendance: { status: "P", statusManual: "", comment: "" },
//     classDetails: [
//       {
//         id: 1,
//         date: "2025-05-08",
//         glcScheduled: 2,
//         glcTaken: 2,
//         oplcScheduled: 1,
//         oplcTaken: 1,
//         gdcScheduled: 0,
//         gdcTaken: 0,
//         opdcScheduled: 1,
//         opdcTaken: 1
//       }
//     ]
//   },
//   {
//     id: 6,
//     name: "Sarah Brown",
//     department: "Mentor",
//     isAdmin: false,
//     punchData: [],
//     attendance: { status: "A", statusManual: "", comment: "" },
//     callDetails: [
//       {
//         id: 4,
//         date: "2025-05-08",
//         callDuration: 180,
//         missedCalls: 1,
//         incoming: 12,
//         outgoing: 15
//       }
//     ]
//   },

//   // New users with varied scenarios
//   {
//     id: 9,
//     name: "Laura Wilson",
//     department: "Faculty",
//     isAdmin: false,
//     punchData: [
//       { id: 22, userId: 9, userName: "Laura Wilson", userDepartment: "Faculty", 
//         date: "2025-05-08", time: "08:50", type: "auto", isApproved: true },
//       { id: 23, userId: 9, userName: "Laura Wilson", userDepartment: "Faculty", 
//         date: "2025-05-08", time: "17:45", type: "auto", isApproved: true }
//     ],
//     classDetails: [
//       {
//         id: 2,
//         date: "2025-05-08",
//         glcScheduled: 3,
//         glcTaken: 3,
//         oplcScheduled: 2,
//         oplcTaken: 1,
//         gdcScheduled: 1,
//         gdcTaken: 1,
//         opdcScheduled: 2,
//         opdcTaken: 2
//       }
//     ],
//     attendance: { status: "P", statusManual: "", comment: "" }
//   },
//   {
//     id: 10,
//     name: "Mark Thompson",
//     department: "IT",
//     isAdmin: true,
//     punchData: [
//       { id: 24, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
//         date: "2025-05-08", time: "09:05", type: "auto", isApproved: true },
//       { id: 25, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
//         date: "2025-05-08", time: "12:30", type: "manual", isApproved: undefined, reason: "System error" },
//       { id: 26, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
//         date: "2025-05-08", time: "13:45", type: "auto", isApproved: true },
//       { id: 27, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
//         date: "2025-05-08", time: "18:15", type: "auto", isApproved: true }
//     ],
//     attendance: { status: "P", statusManual: "", comment: "" },
//     callDetails: [
//       {
//         id: 5,
//         date: "2025-05-08",
//         callDuration: 300,
//         missedCalls: 0,
//         incoming: 20,
//         outgoing: 18
//       }
//     ]
//   },
//   {
//     id: 11,
//     name: "Sophia Lee",
//     department: "Mentor",
//     isAdmin: false,
//     punchData: [
//       { id: 28, userId: 11, userName: "Sophia Lee", userDepartment: "Mentor", 
//         date: "2025-05-08", time: "09:15", type: "auto", isApproved: true },
//       { id: 29, userId: 11, userName: "Sophia Lee", userDepartment: "Mentor", 
//         date: "2025-05-08", time: "17:30", type: "auto", isApproved: true }
//     ],
//     classDetails: [
//       {
//         id: 3,
//         date: "2025-05-08",
//         glcScheduled: 2,
//         glcTaken: 2,
//         oplcScheduled: 1,
//         oplcTaken: 1,
//         gdcScheduled: 0,
//         gdcTaken: 0,
//         opdcScheduled: 0,
//         opdcTaken: 0
//       }
//     ],
//     callDetails: [
//       {
//         id: 6,
//         date: "2025-05-08",
//         callDuration: 420,
//         missedCalls: 3,
//         incoming: 25,
//         outgoing: 30
//       }
//     ],
//     attendance: { status: "P", statusManual: "", comment: "" }
//   },
//   {
//     id: 12,
//     name: "Daniel Kim",
//     department: "BD",
//     isAdmin: false,
//     punchData: [
//       { id: 30, userId: 12, userName: "Daniel Kim", userDepartment: "BD", 
//         date: "2025-05-08", time: "10:00", type: "manual", isApproved: true, reason: "Client meeting" },
//       { id: 31, userId: 12, userName: "Daniel Kim", userDepartment: "BD", 
//         date: "2025-05-08", time: "15:30", type: "auto", isApproved: true }
//     ],
//     attendance: { 
//       status: "P", 
//       statusManual: "L", 
//       comment: "Half-day leave approved" 
//     },
//     callDetails: [
//       {
//         id: 7,
//         date: "2025-05-08",
//         callDuration: 180,
//         missedCalls: 5,
//         incoming: 10,
//         outgoing: 15
//       }
//     ]
//   }
// ];

// // Mock miss punch requests
// const mockMissPunchRequests: Punch[] = [
//   { 
//     id: 22, 
//     userId: 7, 
//     userName: "Michael Chen", 
//     userDepartment: "Sales", 
//     date: "2025-05-07", 
//     time: "17:00", 
//     type: "manual", 
//     isApproved: undefined, 
//     reason: "Forgot to punch out" 
//   },
//   { 
//     id: 23, 
//     userId: 8, 
//     userName: "Emily Davis", 
//     userDepartment: "Marketing", 
//     date: "2025-05-06", 
//     time: "18:15", 
//     type: "manual", 
//     isApproved: undefined, 
//     reason: "System was down" 
//   },
//   { 
//     id: 24, 
//     userId: 5, 
//     userName: "David Wilson", 
//     userDepartment: "IT", 
//     date: "2025-05-07", 
//     time: "17:45", 
//     type: "manual", 
//     isApproved: undefined, 
//     reason: "Working remotely, forgot to log" 
//   }
// ];

// const AttendanceDashboard = () => {
//   const [currentUser, setCurrentUser] = useState<AttendanceUser>(mockUsers[0]);
//   const [users, setUsers] = useState(mockUsers);
//   const [missPunchRequests, setMissPunchRequests] = useState(mockMissPunchRequests);
  
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
//   const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
//   const [showMissPunchForm, setShowMissPunchForm] = useState(false);
//   const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
//   const [currentRequest, setCurrentRequest] = useState<Punch | null>(null);
//   const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
//   const [rejectionReason, setRejectionReason] = useState("");
  
//   const [formData, setFormData] = useState({
//     name: "",
//     date: "",
//     time: "",
//     reason: ""
//   });
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("All");
  
//   const [currentView, setCurrentView] = useState<"personal" | "department" | "requests">("personal");

//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];

//   const years = Array.from({ length: 5 }, (_, i) => selectedYear - 2 + i);
  
//   const departments = ["All", ...Array.from(new Set(users.map(user => user.department)))];
  
//   const maxPunches = Math.max(...users.map(user => user.punchData ? user.punchData.length : 0));

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment = filterDepartment === "All" || user.department === filterDepartment;
    
//     if (currentView === "department") {
//       return matchesSearch && matchesDepartment && user.department === currentUser.department;
//     }
    
//     if (currentView === "personal") {
//       return user.id === currentUser.id;
//     }
    
//     return matchesSearch && matchesDepartment;
//   });

//   const filteredRequests = missPunchRequests.filter(request => 
//     request.userDepartment === currentUser.department && request.isApproved === undefined
//   );

//   useEffect(() => {
//     const newDate = new Date(selectedYear, selectedMonth, 1);
//     setSelectedDate(newDate.toISOString().split('T')[0].substring(0, 8) + "01");
//   }, [selectedMonth, selectedYear]);

//   const handleMissPunchRequest = () => {
//     setFormData({
//       name: currentUser.name,
//       date: selectedDate,
//       time: "",
//       reason: ""
//     });
//     setShowMissPunchForm(true);
//   };

//   const handleManualStatusChange = (userId: number, newStatus: string) => {
//     console.log(`Manual status for user ${userId} changed to ${newStatus}`);
//   };
  

//   const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
//     e.preventDefault();
    
//     if (!formData.time || !formData.reason) {
//       toast.error("Please fill all required fields");
//       return;
//     }
    
//     const newPunch: Punch = {
//       id: Math.max(...missPunchRequests.map(p => p.id), ...users.flatMap(u => u.punchData.map(p => p.id))) + 1,
//       userId: currentUser.id,
//       userName: currentUser.name,
//       userDepartment: currentUser.department,
//       date: formData.date,
//       time: formData.time,
//       type: "manual",
//       reason: formData.reason
//     };
    
//     setMissPunchRequests([...missPunchRequests, newPunch]);
    
//     const updatedUsers = users.map(user => {
//       if (user.id === currentUser.id) {
//         return {
//           ...user,
//           punchData: [...user.punchData, newPunch]
//         };
//       }
//       return user;
//     });
    
//     setUsers(updatedUsers);
    
//     toast.success("Miss punch request submitted successfully!");
//     setShowMissPunchForm(false);
//   };

//   const handleApproveReject = (request: Punch, action: "approve" | "reject") => {
//     setCurrentRequest(request);
//     setActionType(action);
//     setRejectionReason("");
//     setShowApproveRejectModal(true);
//   };

//   const confirmApproveReject = () => {
//     if (!currentRequest || !actionType) return;
    
//     const updatedRequests = missPunchRequests.map(req => {
//       if (req.id === currentRequest.id) {
//         if (actionType === "approve") {
//           return {
//             ...req,
//             isApproved: true,
//             approvedBy: currentUser.name,
//             approvedOn: new Date().toISOString().split('T')[0]
//           };
//         } else {
//           return {
//             ...req,
//             isApproved: false,
//             rejectionReason
//           };
//         }
//       }
//       return req;
//     });
    
//     const updatedUsers = users.map(user => {
//       if (user.id === currentRequest.userId) {
//         const updatedPunchData = user.punchData.map(punch => {
//           if (punch.id === currentRequest.id) {
//             if (actionType === "approve") {
//               return {
//                 ...punch,
//                 isApproved: true,
//                 approvedBy: currentUser.name,
//                 approvedOn: new Date().toISOString().split('T')[0]
//               };
//             } else {
//               return {
//                 ...punch,
//                 isApproved: false,
//                 rejectionReason
//               };
//             }
//           }
//           return punch;
//         });
        
//         return {
//           ...user,
//           punchData: updatedPunchData
//         };
//       }
//       return user;
//     });
    
//     setMissPunchRequests(updatedRequests);
//     setUsers(updatedUsers);
    
//     toast.success(`Request ${actionType === "approve" ? "approved" : "rejected"} successfully!`);
//     setShowApproveRejectModal(false);
//   };

//   const getPunchRowColor = (user: AttendanceUser): string => {
//     if (!user.punchData || user.punchData.length === 0) {
//       if (user.attendance.status === "A") {
//         return "table-danger";
//       }
//       return "";
//     }
    
//     // Check if odd number of punches and not in specified departments
//     if (user.punchData.length % 2 !== 0 && 
//         !["BD", "Mentor", "Faculty"].includes(user.department)) {
//       return "table-warning";
//     }
    
//     // Check if any punch is not approved
//     const hasPendingRequest = user.punchData.some((punch: Punch) => 
//       punch.type === "manual" && punch.isApproved === undefined);
//     if (hasPendingRequest) return "table-warning";
    
//     // Check if any punch request was rejected
//     const hasRejectedRequest = user.punchData.some((punch: Punch) => 
//       punch.type === "manual" && punch.isApproved === false);
//     if (hasRejectedRequest) return "table-danger";
    
//     // Check if any punch request was approved
//     const hasApprovedRequest = user.punchData.some((punch: Punch) => 
//       punch.type === "manual" && punch.isApproved === true);
//     if (hasApprovedRequest) return "table-success";
    
//     return "";
//   };

//   const getStatusBadge = (status: string): React.ReactElement => {
//     switch(status) {
//       case "P":
//         return <Badge label="Present" status="SUCCESS"/> ;
//       case "A":
//         return <Badge label="Absent" status="DANGER"/>;
//       case "L":
//         return <Badge label="Leave" status="WARNING"/>;
//       case "H":
//         return <Badge label="Holiday" status="PRIMARY"/> ;
//       default:
//         return <Badge label={status} />;
//     }
//   };

//   const getPunchApprovalIcon = (punch: Punch): React.ReactElement | null => {
//     if (punch.type !== "manual") return null;
    
//     if (punch.isApproved === true) {
//       return <FaCheckCircle className="text-success ms-2" title={`Approved by ${punch.approvedBy} on ${punch.approvedOn}`} />;
//     } else if (punch.isApproved === false) {
//       return <FaTimesCircle className="text-danger ms-2" title={`Rejected: ${punch.rejectionReason}`} />;
//     } else {
//       return <FaHourglassHalf className="text-warning ms-2" title="Pending Approval" />;
//     }
//   };

//   const exportAttendanceData = () => {
//     // In a real app, this would generate a CSV or Excel file
//     toast.info("Exporting attendance data...");
//   };
  
//   // UI Components
//   const renderHeader = () => (
//     <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
//       <h3 className="mb-0 d-flex align-items-center gap-3">
//         {currentView === "personal" && (
//           <>
//             <FaUserClock className="me-2" />
//             Personal Attendance
//           </>
//         )}
//         {currentView === "department" && (
//           <>
//             <FaBuilding className="me-2" />
//             Attendance Data
//           </>
//         )}
//         {currentView === "requests" && (
//           <>
//             <FaClipboardList className="me-2" />
//             Miss Punch Requests
//           </>
//         )}
//       </h3>
//       {/* Admin Controls */}
//       {currentUser.isAdmin && (
//         <div className="d-flex gap-2">
//           <button 
//             className={`btn ${currentView === "personal" ? "btn-light" : "btn-outline-light"}`}
//             onClick={() => setCurrentView("personal")}
//           >
//             <FaUser className="me-1" /> My Attendance
//           </button>
//           <button 
//             className={`btn ${currentView === "department" ? "btn-light" : "btn-outline-light"}`}
//             onClick={() => setCurrentView("department")}
//           >
//             <FaBuilding className="me-1" /> Department
//           </button>
//           <button 
//             className={`btn ${currentView === "requests" ? "btn-light" : "btn-outline-light"}`}
//             onClick={() => setCurrentView("requests")}
//             style={{ position: 'relative' }}
//           >
//             <FaClipboardList className="me-1" /> Requests
//             {filteredRequests.length > 0 && (
//               <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
//                 {filteredRequests.length}
//               </span>
//             )}
//           </button>
//         </div>
//       )}
//     </div>
//   );
  
//   const renderControls = () => (
//     <>
//       {/* Controls and Filters */}
//       <div className="row g-3 mb-4 align-items-end">
//         {/* Date Controls */}
//         <div className="col-md-6 col-lg-3">
//           <label htmlFor="month" className="form-label">Month</label>
//           <select
//             id="month"
//             className="form-select"
//             value={selectedMonth}
//             onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
//           >
//             {months.map((month, index) => (
//               <option key={month} value={index}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="col-md-6 col-lg-2">
//           <label htmlFor="year" className="form-label">Year</label>
//           <select
//             id="year"
//             className="form-select"
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//           >
//             {years.map((year) => (
//               <option key={year} value={year}>
//                 {year}
//               </option>
//             ))}
//           </select>
//         </div>
        
//         <div className="col-md-6 col-lg-3">
//           <label htmlFor="date" className="form-label">Specific Date</label>
//           <input
//             type="date"
//             id="date"
//             className="form-control"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//           />
//         </div>
        
//         {/* Search and Filter - Only show in department view */}
//         {currentView === "department" && (
//           <div className="col-md-6 col-lg-4">
//             <div className="input-group">
//               <span className="input-group-text">
//                 <FaSearch />
//               </span>
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Search by name"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button 
//                 className="btn btn-outline-secondary" 
//                 type="button" 
//                 onClick={exportAttendanceData}
//                 title="Export Data"
//               >
//                 <FaDownload />
//               </button>
//             </div>
//           </div>
//         )}
        
//         {/* Request Miss Punch - Only in personal view */}
//         {currentView === "personal" && currentUser.punchData.length % 2 !== 0 && (
//           <div className="col-md-4 col-lg-4 ms-auto">
//             <button
//               className="btn btn-primary w-100"
//               onClick={handleMissPunchRequest}
//             >
//               <FaPlus className="me-2" /> Request Miss Punch
//             </button>
//           </div>
//         )}
//       </div>
      
//       {/* Color indicators */}
//       {currentView !== "requests" && (
//         <div className="mb-3 d-flex justify-content-end">
//           <div className="d-flex align-items-center me-3">
//             <span className="badge bg-warning me-1">&nbsp;</span>
//             <small>Pending/Missing Punch</small>
//           </div>
//           <div className="d-flex align-items-center me-3">
//             <span className="badge bg-success me-1">&nbsp;</span>
//             <small>Approved Manual Punch</small>
//           </div>
//           <div className="d-flex align-items-center">
//             <span className="badge bg-danger me-1">&nbsp;</span>
//             <small>Rejected Request/Absent</small>
//           </div>
//         </div>
//       )}
//     </>
//   );
  
  


//   const renderRequestsTable = () => (
//     <div className="table-responsive">
//       <table className="table table-bordered table-hover">
//         <thead className="table-light">
//           <tr>
//             <th className="text-center" style={{ width: "40px" }}>#</th>
//             <th>Employee</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Reason</th>
//             <th className="text-center">Status</th>
//             <th className="text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredRequests.length > 0 ? (
//             filteredRequests.map((request, index) => (
//               <tr key={request.id}>
//                 <td className="text-center">{index + 1}</td>
//                 <td>
//                   <div className="d-flex align-items-center">
//                     <FaUser className="text-primary me-2" />
//                     {request.userName}
//                   </div>
//                 </td>
//                 <td>{request.date}</td>
//                 <td>{request.time}</td>
//                 <td>{request.reason}</td>
//                 <td className="text-center">
//                   <Badge label="Pending" status="WARNING" />
//                 </td>
//                 <td className="text-center">
//                   <div className="btn-group">
//                     <button
//                       className="btn btn-sm btn-success"
//                       onClick={() => handleApproveReject(request, "approve")}
//                       title="Approve Request"
//                     >
//                       <FaCheck className="me-1" />
//                       Approve
//                     </button>
//                     <button
//                       className="btn btn-sm btn-danger"
//                       onClick={() => handleApproveReject(request, "reject")}
//                       title="Reject Request"
//                     >
//                       <FaBan className="me-1" />
//                       Reject
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={7} className="text-center py-3">
//                 No pending miss punch requests for your department
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );

//   // Main render
//   return (
//     <div className="container py-4">
//       <ToastContainer position="top-right" autoClose={3000} />
      
//       {/* User welcome banner */}
//       <div className="alert alert-primary d-flex align-items-center mb-4">
//         <FaUserShield className="me-2" size={24} />
//         <div>
//           <strong>Welcome, {currentUser.name}!</strong> 
//           <span className="ms-2">
//             {currentUser.isAdmin ? `You have admin privileges for the ${currentUser.department} department.` : "Here's your attendance data."}
//           </span>
//         </div>
//       </div>
      
//       <div className="card shadow mb-4">
//         {renderHeader()}
          
//         <div className="card-body">
//           {/* Content based on current view */}
//           {currentView !== "requests" ? <AttendanceTables 
//           users={users} 
//           currentUser={currentUser}
//           selectedYear={selectedYear}
//           selectedMonth={selectedMonth}
//           selectedDate={selectedDate}
//           onManualStatusChange={handleManualStatusChange}
//           onMissPunchRequest={handleMissPunchRequest}
//           currentView={currentView}
//           /> : 
//           renderRequestsTable()}
//         </div>
//       </div>
      
//       {/* Miss Punch Form Modal */}
//       {showMissPunchForm && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   <FaBusinessTime className="me-2" />
//                   Miss Punch Request
//                 </h5>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowMissPunchForm(false)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <form onSubmit={handleFormSubmit}>
//                 <div className="modal-body">
//                   <div className="mb-3">
//                     <label className="form-label d-flex align-items-center" htmlFor="name">
//                       <FaUser className="me-2 text-primary" />
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       readOnly
//                       className="form-control bg-light"
//                     />
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label d-flex align-items-center" htmlFor="date">
//                       <FaCalendarAlt className="me-2 text-primary" />
//                       Date
//                     </label>
//                     <input
//                       type="date"
//                       id="date"
//                       name="date"
//                       value={formData.date}
//                       onChange={handleFormChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label d-flex align-items-center" htmlFor="time">
//                       <FaBusinessTime className="me-2 text-primary" />
//                       Time
//                     </label>
//                     <input
//                       type="time"
//                       id="time"
//                       name="time"
//                       value={formData.time}
//                       onChange={handleFormChange}
//                       className="form-control"
//                       required
//                     />
//                   </div>
                  
//                   <div className="mb-3">
//                     <label className="form-label" htmlFor="reason">
//                       Reason for Miss Punch
//                     </label>
//                     <textarea
//                       id="reason"
//                       name="reason"
//                       value={formData.reason}
//                       onChange={handleFormChange}
//                       className="form-control"
//                       rows={3}
//                       required
//                       placeholder="Please provide a detailed reason..."
//                     ></textarea>
//                   </div>
//                 </div>
//                 <div className="modal-footer">
//                   <button
//                     type="button"
//                     className="btn btn-secondary"
//                     onClick={() => setShowMissPunchForm(false)}
//                   >
//                     <FaTimes className="me-1" /> Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-primary"
//                   >
//                     <FaSave className="me-1" /> Submit Request
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Approve/Reject Modal */}
//       {showApproveRejectModal && currentRequest && (
//         <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header bg-primary text-white">
//                 <h5 className="modal-title">
//                   {actionType === "approve" ? (
//                     <><FaCheckCircle className="me-2" /> Approve Request</>
//                   ) : (
//                     <><FaTimesCircle className="me-2" /> Reject Request</>
//                   )}
//                 </h5>
//                 <button 
//                   type="button" 
//                   className="btn-close btn-close-white"
//                   onClick={() => setShowApproveRejectModal(false)}
//                   aria-label="Close"
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <div className="card mb-3">
//                   <div className="card-body">
//                     <h6 className="card-subtitle mb-2 text-muted">Request Details</h6>
//                     <div className="mb-2">
//                       <strong>Employee: </strong>{currentRequest.userName}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Date: </strong>{currentRequest.date}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Time: </strong>{currentRequest.time}
//                     </div>
//                     <div className="mb-2">
//                       <strong>Reason: </strong>{currentRequest.reason}
//                     </div>
//                   </div>
//                 </div>
                
//                 {actionType === "reject" && (
//                   <div className="mb-3">
//                     <label className="form-label" htmlFor="rejectionReason">
//                       Rejection Reason
//                     </label>
//                     <textarea
//                       id="rejectionReason"
//                       value={rejectionReason}
//                       onChange={(e) => setRejectionReason(e.target.value)}
//                       className="form-control"
//                       rows={3}
//                       required
//                       placeholder="Please provide a reason for rejection..."
//                     ></textarea>
//                   </div>
//                 )}
//               </div>
//               <div className="modal-footer">
//                 <button
//                   type="button"
//                   className="btn btn-secondary"
//                   onClick={() => setShowApproveRejectModal(false)}
//                 >
//                   <FaTimes className="me-1" /> Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className={`btn ${actionType === "approve" ? "btn-success" : "btn-danger"}`}
//                   onClick={confirmApproveReject}
//                   disabled={actionType === "reject" && !rejectionReason}
//                 >
//                   {actionType === "approve" ? (
//                     <><FaCheck className="me-1" /> Confirm Approval</>
//                   ) : (
//                     <><FaBan className="me-1" /> Confirm Rejection</>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* User selector - For demo purposes only */}
//       <div className="card mt-4">
//         <div className="card-header bg-secondary text-white">
//           <h5 className="mb-0">Demo Controls</h5>
//         </div>
//         <div className="card-body">
//           <div className="mb-3">
//             <label className="form-label">Switch User (Demo Only)</label>
//             <select 
//               className="form-select"
//               value={currentUser.id}
//               onChange={(e) => {
//                 const userId = parseInt(e.target.value);
//                 const user = users.find(u => u.id === userId);
//                 if (user) {
//                   setCurrentUser(user);
//                   setCurrentView("personal");
//                 }
//               }}
//             >
//               {users.map(user => (
//                 <option key={user.id} value={user.id}>
//                   {user.name} ({user.department}{user.isAdmin ? " - Admin" : ""})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendanceDashboard;


import { useState, useEffect } from "react";
import { 
  FaUser, 
  FaCalendarAlt, 
  FaBusinessTime, 
  FaSave, 
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaFilter,
  FaDownload,
  FaSearch,
  FaUserShield,
  FaClipboardList,
  FaCheck,
  FaBan,
  FaPlus,
  FaBuilding
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Badge from "../../components/badge";
import AttendanceTables from "./attendance-table";

interface Punch {
  id: number;
  userId: number;
  userName: string;
  userDepartment: string;
  date: string;
  time: string;
  type: "manual" | "auto";
  isApproved?: boolean;
  reason?: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

interface CallDetails {
  id: number;
  callDuration: number;
  missedCalls: number;
  incoming: number;
  outgoing: number;
  date: string;
}

interface ClassDetails {
  id: number;
  glcScheduled: number;
  glcTaken: number;
  oplcScheduled: number;
  oplcTaken: number;
  gdcScheduled: number;
  gdcTaken: number;
  opdcScheduled: number;
  opdcTaken: number;
  date: string;
}

interface AttendanceUser {
  id: number;
  name: string;
  department: string;
  isAdmin: boolean;
  punchData: Punch[];
  attendance: {
    status: string;
    statusManual: string;
    comment: string;
  };
  callDetails?: CallDetails[];
  classDetails?: ClassDetails[];
}

const mockUsers: AttendanceUser[] = [
  // Existing users corrected
  { 
    id: 1, 
    name: "John Doe", 
    department: "Sales",
    isAdmin: true,
    punchData: [
      // ... keep existing punch data
      { id: 1, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "09:00", type: "auto", isApproved: true },
      { id: 2, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "12:30", type: "auto", isApproved: true },
      { id: 3, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "13:30", type: "auto", isApproved: true },
      { id: 4, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-08", time: "18:00", type: "auto", isApproved: true },
      { id: 5, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "09:00", type: "auto", isApproved: true },
      { id: 6, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "12:30", type: "auto", isApproved: true },
      { id: 7, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "13:30", type: "auto", isApproved: true },
      { id: 8, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-09", time: "18:00", type: "auto", isApproved: true },
      { id: 9, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "09:00", type: "auto", isApproved: true },
      { id: 10, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "12:30", type: "auto", isApproved: true },
      { id: 11, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "13:30", type: "auto", isApproved: true },
      { id: 12, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-10", time: "18:00", type: "auto", isApproved: true },
      { id: 13, userId: 1, userName: "John Doe", userDepartment: "Sales", date: "2025-05-11", time: "18:00", type: "auto", isApproved: true },
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
    callDetails: [
      {id:1, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-08"},
      {id:2, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-09"},
      {id:3, callDuration: 240, missedCalls: 2, incoming: 15, outgoing: 20, date: "2025-05-10"}
    ],
  },
  { 
    id: 3, 
    name: "Robert Taylor", 
    department: "Faculty",
    isAdmin: true,
    punchData: [
      { id: 8, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", 
        date: "2025-05-08", time: "08:45", type: "auto", isApproved: true },
      { id: 9, userId: 3, userName: "Robert Taylor", userDepartment: "Faculty", 
        date: "2025-05-08", time: "18:15", type: "auto", isApproved: true }
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
    classDetails: [
      {
        id: 1,
        date: "2025-05-08",
        glcScheduled: 2,
        glcTaken: 2,
        oplcScheduled: 1,
        oplcTaken: 1,
        gdcScheduled: 0,
        gdcTaken: 0,
        opdcScheduled: 1,
        opdcTaken: 1
      }
    ]
  },
  {
    id: 6,
    name: "Sarah Brown",
    department: "Mentor",
    isAdmin: false,
    punchData: [],
    attendance: { status: "A", statusManual: "", comment: "" },
    callDetails: [
      {
        id: 4,
        date: "2025-05-08",
        callDuration: 180,
        missedCalls: 1,
        incoming: 12,
        outgoing: 15
      }
    ]
  },

  // New users with varied scenarios
  {
    id: 9,
    name: "Laura Wilson",
    department: "Faculty",
    isAdmin: false,
    punchData: [
      { id: 22, userId: 9, userName: "Laura Wilson", userDepartment: "Faculty", 
        date: "2025-05-08", time: "08:50", type: "auto", isApproved: true },
      { id: 23, userId: 9, userName: "Laura Wilson", userDepartment: "Faculty", 
        date: "2025-05-08", time: "17:45", type: "auto", isApproved: true }
    ],
    classDetails: [
      {
        id: 2,
        date: "2025-05-08",
        glcScheduled: 3,
        glcTaken: 3,
        oplcScheduled: 2,
        oplcTaken: 1,
        gdcScheduled: 1,
        gdcTaken: 1,
        opdcScheduled: 2,
        opdcTaken: 2
      }
    ],
    attendance: { status: "P", statusManual: "", comment: "" }
  },
  {
    id: 10,
    name: "Mark Thompson",
    department: "IT",
    isAdmin: true,
    punchData: [
      { id: 24, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
        date: "2025-05-08", time: "09:05", type: "auto", isApproved: true },
      { id: 25, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
        date: "2025-05-08", time: "12:30", type: "manual", isApproved: undefined, reason: "System error" },
      { id: 26, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
        date: "2025-05-08", time: "13:45", type: "auto", isApproved: true },
      { id: 27, userId: 10, userName: "Mark Thompson", userDepartment: "IT", 
        date: "2025-05-08", time: "18:15", type: "auto", isApproved: true }
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
    callDetails: [
      {
        id: 5,
        date: "2025-05-08",
        callDuration: 300,
        missedCalls: 0,
        incoming: 20,
        outgoing: 18
      }
    ]
  },
  {
    id: 11,
    name: "Sophia Lee",
    department: "Mentor",
    isAdmin: false,
    punchData: [
      { id: 28, userId: 11, userName: "Sophia Lee", userDepartment: "Mentor", 
        date: "2025-05-08", time: "09:15", type: "auto", isApproved: true },
      { id: 29, userId: 11, userName: "Sophia Lee", userDepartment: "Mentor", 
        date: "2025-05-08", time: "17:30", type: "auto", isApproved: true }
    ],
    classDetails: [
      {
        id: 3,
        date: "2025-05-08",
        glcScheduled: 2,
        glcTaken: 2,
        oplcScheduled: 1,
        oplcTaken: 1,
        gdcScheduled: 0,
        gdcTaken: 0,
        opdcScheduled: 0,
        opdcTaken: 0
      }
    ],
    callDetails: [
      {
        id: 6,
        date: "2025-05-08",
        callDuration: 420,
        missedCalls: 3,
        incoming: 25,
        outgoing: 30
      }
    ],
    attendance: { status: "P", statusManual: "", comment: "" }
  },
  {
    id: 12,
    name: "Daniel Kim",
    department: "BD",
    isAdmin: false,
    punchData: [
      { id: 30, userId: 12, userName: "Daniel Kim", userDepartment: "BD", 
        date: "2025-05-08", time: "10:00", type: "manual", isApproved: true, reason: "Client meeting" },
      { id: 31, userId: 12, userName: "Daniel Kim", userDepartment: "BD", 
        date: "2025-05-08", time: "15:30", type: "auto", isApproved: true }
    ],
    attendance: { 
      status: "P", 
      statusManual: "L", 
      comment: "Half-day leave approved" 
    },
    callDetails: [
      {
        id: 7,
        date: "2025-05-08",
        callDuration: 180,
        missedCalls: 5,
        incoming: 10,
        outgoing: 15
      }
    ]
  }
];

// Mock miss punch requests
const mockMissPunchRequests: Punch[] = [
  { 
    id: 22, 
    userId: 7, 
    userName: "Michael Chen", 
    userDepartment: "Sales", 
    date: "2025-05-07", 
    time: "17:00", 
    type: "manual", 
    isApproved: undefined, 
    reason: "Forgot to punch out" 
  },
  { 
    id: 23, 
    userId: 8, 
    userName: "Emily Davis", 
    userDepartment: "Marketing", 
    date: "2025-05-06", 
    time: "18:15", 
    type: "manual", 
    isApproved: undefined, 
    reason: "System was down" 
  },
  { 
    id: 24, 
    userId: 5, 
    userName: "David Wilson", 
    userDepartment: "IT", 
    date: "2025-05-07", 
    time: "17:45", 
    type: "manual", 
    isApproved: undefined, 
    reason: "Working remotely, forgot to log" 
  }
];


const AttendanceDashboard = () => {
  const [currentUser, setCurrentUser] = useState<AttendanceUser>(mockUsers[0]);
  const [users, setUsers] = useState(mockUsers);
  const [missPunchRequests, setMissPunchRequests] = useState(mockMissPunchRequests);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showMissPunchForm, setShowMissPunchForm] = useState(false);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Punch | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [currentView, setCurrentView] = useState<"department" | "requests">("department");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  const departments = ["All", ...Array.from(new Set(users.map(user => user.department)))];

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    setSelectedDate(newDate.toISOString().split('T')[0].substring(0, 8) + "01");
  }, [selectedMonth, selectedYear]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "All" || user.department === filterDepartment;
    
    if (!currentUser.isAdmin) return user.id === currentUser.id;
    return matchesSearch && matchesDepartment && user.department === currentUser.department;
  });

  const filteredRequests = missPunchRequests.filter(request => 
    request.userDepartment === currentUser.department && request.isApproved === undefined
  );

  const handleMissPunchRequest = () => {
    setFormData({
      name: currentUser.name,
      date: selectedDate,
      time: "",
      reason: ""
    });
    setShowMissPunchForm(true);
  };

  const handleManualStatusChange = (userId: number, date: string, newStatus: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          attendance: {
            ...user.attendance,
            statusManual: newStatus
          }
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    toast.success("Manual status updated successfully");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.time || !formData.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    const newPunch: Punch = {
      id: Math.max(...missPunchRequests.map(p => p.id), ...users.flatMap(u => u.punchData.map(p => p.id))) + 1,
      userId: currentUser.id,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      date: formData.date,
      time: formData.time,
      type: "manual",
      reason: formData.reason
    };

    setMissPunchRequests([...missPunchRequests, newPunch]);
    setUsers(users.map(user => 
      user.id === currentUser.id ? 
      { ...user, punchData: [...user.punchData, newPunch] } : 
      user
    ));
    toast.success("Miss punch request submitted successfully!");
    setShowMissPunchForm(false);
  };

  const handleApproveReject = (request: Punch, action: "approve" | "reject") => {
    setCurrentRequest(request);
    setActionType(action);
    setRejectionReason("");
    setShowApproveRejectModal(true);
  };

  const confirmApproveReject = () => {
    if (!currentRequest || !actionType) return;

    const updatedRequests = missPunchRequests.map(req => 
      req.id === currentRequest.id ? {
        ...req,
        isApproved: actionType === "approve",
        ...(actionType === "approve" ? {
          approvedBy: currentUser.name,
          approvedOn: new Date().toISOString().split('T')[0]
        } : {
          rejectionReason
        })
      } : req
    );

    const updatedUsers = users.map(user => 
      user.id === currentRequest.userId ? {
        ...user,
        punchData: user.punchData.map(punch => 
          punch.id === currentRequest.id ? {
            ...punch,
            isApproved: actionType === "approve",
            ...(actionType === "approve" ? {
              approvedBy: currentUser.name,
              approvedOn: new Date().toISOString().split('T')[0]
            } : {
              rejectionReason
            })
          } : punch
        )
      } : user
    );

    setMissPunchRequests(updatedRequests);
    setUsers(updatedUsers);
    toast.success(`Request ${actionType === "approve" ? "approved" : "rejected"} successfully!`);
    setShowApproveRejectModal(false);
  };

  const renderHeader = () => (
    <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h3 className="mb-0 d-flex align-items-center gap-3">
        
        {currentUser.isAdmin ? (
          <>
            <FaBuilding className="me-2" />
            {currentView === "department" ? "Department Attendance" : "Miss Punch Requests"}
          </>
        ) : (
          <>
            <FaUser className="me-2" />
            My Attendance
          </>
        )}
      </h3>

      {currentUser.isAdmin && (
        <div className="d-flex gap-2">
          <button 
            className={`btn ${currentView === "department" ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setCurrentView("department")}
          >
            <FaBuilding className="me-1" /> Department
          </button>
          <button 
            className={`btn ${currentView === "requests" ? "btn-light" : "btn-outline-light"}`}
            onClick={() => setCurrentView("requests")}
            style={{ position: 'relative' }}
          >
            <FaClipboardList className="me-1" /> Requests
            {filteredRequests.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {filteredRequests.length}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );

  const renderControls = () => (
    <div className="row g-3 mb-4 align-items-end">
      
      {!currentUser.isAdmin && currentUser.punchData.length % 2 !== 0 && (
        <div className="col-md-4 col-lg-3 ms-auto">
          <button
            className="btn btn-primary w-100"
            onClick={handleMissPunchRequest}
          >
            <FaPlus className="me-2" /> Request Miss Punch
          </button>
        </div>
      )}
    </div>
  );

  const renderRequestsTable = () => (
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
          {filteredRequests.map((request, index) => (
            <tr key={request.id}>
              <td>{request.userName}</td>
              <td>{request.date}</td>
              <td>{request.time}</td>
              <td>{request.reason}</td>
              <td className="text-center">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="alert alert-primary d-flex align-items-center mb-4">
        <FaUserShield className="me-2" size={24} />
        <div>
          <strong>Welcome, {currentUser.name}!</strong> 
          <span className="ms-2">
            {currentUser.isAdmin ? 
              `Managing ${currentUser.department} department` : 
              "Viewing your attendance records"}
          </span>
        </div>
      </div>

      <div className="card shadow mb-4">
        {renderHeader()}
        <div className="card-body">
          {currentView === "department" && (
            <>
              {renderControls()}
              <AttendanceTables 
                users={filteredUsers} 
                currentUser={currentUser}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDate={selectedDate}
                onManualStatusChange={handleManualStatusChange}
                onMissPunchRequest={handleMissPunchRequest}
                isAdmin={currentUser.isAdmin}
                currentView={currentView}
              />
            </>
          )}
          {currentView === "requests" && renderRequestsTable()}
        </div>
      </div>

      {showMissPunchForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Miss Punch Request</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowMissPunchForm(false)}
                />
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      value={formData.reason}
                      onChange={(e) => setFormData({...formData, reason: e.target.value})}
                      required
                      rows={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMissPunchForm(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showApproveRejectModal && currentRequest && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
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
                  <p><strong>Employee:</strong> {currentRequest.userName}</p>
                  <p><strong>Date:</strong> {currentRequest.date}</p>
                  <p><strong>Time:</strong> {currentRequest.time}</p>
                  <p><strong>Reason:</strong> {currentRequest.reason}</p>
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
                  className={`btn ${actionType === "approve" ? "btn-success" : "btn-danger"}`}
                  onClick={confirmApproveReject}
                  disabled={actionType === "reject" && !rejectionReason}
                >
                  {actionType === "approve" ? "Confirm Approval" : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser.isAdmin && (
        <div className="card mt-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Admin Controls</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Switch User View</label>
              <select 
                className="form-select"
                value={currentUser.id}
                onChange={(e) => {
                  const user = users.find(u => u.id === parseInt(e.target.value));
                  if (user) setCurrentUser(user);
                }}
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;