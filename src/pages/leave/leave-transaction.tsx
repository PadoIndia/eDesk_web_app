// import React, { useState, useEffect } from "react";
// import {
//   FaSearch,
//   FaUser,
//   FaInfoCircle,
//   FaPlus,
//   FaTrash,
// } from "react-icons/fa";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import leaveTransactionService from "../../services/api-services/leave-transaction.service";
// import { LeaveTransactionFilters, CreateLeaveTransactionRequest } from "../../types/leave.types";
// import { User } from "../../types/user.types";
// import userService from "../../services/api-services/user.service";
// import { useAppSelector } from "../../store/store";

// interface LeaveTransaction {
//   id: number;
//   userId: number;
//   userName: string;
//   year: number;
//   month: number;
//   date: number;
//   leaveType: string;
//   count: number;
//   comment: string | null;
//   createdOn: string;
//   assignedByName: string | null;
// }

// const LeaveTransactions = () => {
//   const [transactions, setTransactions] = useState<LeaveTransaction[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");
//   const [yearFilter, setYearFilter] = useState<number | "">(
//     new Date().getFullYear()
//   );
//   const [showAddForm, setShowAddForm] = useState(false);
//   const [users, setUsers] = useState<User[]>([]);

//   // const userId = useAppSelector((s)=>s.auth.userData?.user.id);

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       setLoading(true);
//       try {
//         const params: LeaveTransactionFilters = {};
//         const response = await leaveTransactionService.getLeaveTransactions(params);
//         setTransactions(response.data);
//       } catch (error) {
//         console.error("Failed to fetch transactions:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchUsers = async () => {
//       try {
//         // This should be replaced with your user service
//         const response = await userService.getAllUsers();
//         setUsers(response.data);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//       }
//     };

//     fetchTransactions();
//     fetchUsers();
//   }, []);

//   // Get unique leave types for filter dropdown
//   const leaveTypes = Array.from(new Set(transactions.map((t) => t.leaveType)));

//   // Get unique years for filter dropdown
//   const years = Array.from(new Set(transactions.map((t) => t.year)));

//   const filteredTransactions = transactions.filter((transaction) => {
//     // Search filter
//     const matchesSearch =
//       transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       transaction.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (transaction.comment &&
//         transaction.comment.toLowerCase().includes(searchTerm.toLowerCase()));

//     // Leave type filter
//     const matchesLeaveType = leaveTypeFilter
//       ? transaction.leaveType === leaveTypeFilter
//       : true;

//     // Year filter
//     const matchesYear = yearFilter ? transaction.year === yearFilter : true;

//     return matchesSearch && matchesLeaveType && matchesYear;
//   });

//   const handleAddTransaction = (
//     newTransaction: Omit<CreateLeaveTransactionRequest, "id" | "createdOn">
//   ) => {

//      try {
//       const response = await leaveTransactionService.createLeaveTransaction({
//         ...newTransaction,
//         comment: newTransaction.comment || undefined,
//       });
//       setTransactions([response.data, ...transactions]);
//       setShowAddForm(false);
//     } catch (error) {
//       console.error("Failed to create transaction:", error);
//       alert("Failed to create transaction");
//     }
//   };
//   };

//   return (
//     <div className="container py-4">
//       <div className="card">
//         <div className="card-header bg-light d-flex justify-content-between align-items-center">
//           <h2 className="mb-0">Leave Transactions</h2>
//           <div className="d-flex gap-2">
//             <button
//               className="btn btn-outline-secondary"
//               onClick={() => setShowAddForm(!showAddForm)}
//             >
//               {showAddForm ? (
//                 <>
//                   <FaTrash className="me-1" />
//                   Cancel
//                 </>
//               ) : (
//                 <>
//                   <FaPlus className="me-1" />
//                   Add Transaction
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Add Transaction Form */}
//         {showAddForm && (
//           <div className="card-body border-bottom">
//             <AddTransactionForm
//               onSave={handleAddTransaction}
//               onCancel={() => setShowAddForm(false)}
//             />
//           </div>
//         )}

//         {/* Filters */}
//         <div className="card-body border-bottom">
//           <div className="row g-3">
//             <div className="col-md-4">
//               <div className="input-group">
//                 <span className="input-group-text">
//                   <FaSearch />
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search transactions..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 value={leaveTypeFilter}
//                 onChange={(e) => setLeaveTypeFilter(e.target.value)}
//               >
//                 <option value="">All Leave Types</option>
//                 {leaveTypes.map((type) => (
//                   <option key={type} value={type}>
//                     {type}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-3">
//               <select
//                 className="form-select"
//                 value={yearFilter}
//                 onChange={(e) =>
//                   setYearFilter(e.target.value ? Number(e.target.value) : "")
//                 }
//               >
//                 <option value="">All Years</option>
//                 {years.map((year) => (
//                   <option key={year} value={year}>
//                     {year}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div className="col-md-2">
//               <button
//                 className="btn btn-outline-secondary w-100"
//                 onClick={() => {
//                   setSearchTerm("");
//                   setLeaveTypeFilter("");
//                   setYearFilter("");
//                 }}
//               >
//                 Clear Filters
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Transactions Table */}
//         <div className="card-body">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : filteredTransactions.length === 0 ? (
//             <div className="text-center py-5 text-muted">
//               <FaInfoCircle size={48} className="mb-3" />
//               <h4>No transactions found</h4>
//               <p>Try adjusting your filters or add a new transaction</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover align-middle">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th>Employee</th>
//                     <th>Leave Type</th>
//                     <th>Days</th>
//                     <th>Comment</th>
//                     <th>Assigned By</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredTransactions.map((transaction) => (
//                     <tr key={transaction.id}>
//                       <td>
//                         {new Date(
//                           transaction.year,
//                           transaction.month - 1,
//                           transaction.date
//                         ).toLocaleDateString()}
//                       </td>
//                       <td>
//                         <div className="d-flex align-items-center">
//                           <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
//                             <FaUser className="text-muted" />
//                           </div>
//                           {transaction.userName}
//                         </div>
//                       </td>
//                       <td>{transaction.leaveType}</td>
//                       <td
//                         className={
//                           transaction.count > 0 ? "text-success" : "text-danger"
//                         }
//                       >
//                         {transaction.count > 0 ? "+" : ""}
//                         {transaction.count}
//                       </td>
//                       <td>
//                         <small className="text-muted">
//                           {transaction.comment || "-"}
//                         </small>
//                       </td>
//                       <td>{transaction.assignedByName || "System"}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>

//         <div className="card-footer bg-light">
//           <div className="d-flex justify-content-between align-items-center">
//             <small className="text-muted">
//               Showing {filteredTransactions.length} of {transactions.length}{" "}
//               transactions
//             </small>
//             <nav>
//               <ul className="pagination pagination-sm mb-0">
//                 <li className="page-item disabled">
//                   <a className="page-link" href="#" tabIndex={-1}>
//                     Previous
//                   </a>
//                 </li>
//                 <li className="page-item active">
//                   <a className="page-link" href="#">
//                     1
//                   </a>
//                 </li>
//                 <li className="page-item">
//                   <a className="page-link" href="#">
//                     2
//                   </a>
//                 </li>
//                 <li className="page-item">
//                   <a className="page-link" href="#">
//                     3
//                   </a>
//                 </li>
//                 <li className="page-item">
//                   <a className="page-link" href="#">
//                     Next
//                   </a>
//                 </li>
//               </ul>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Add Transaction Form Component
// interface AddTransactionFormProps {
//   onSave: (transaction: Omit<LeaveTransaction, "id" | "createdOn">) => void;
//   onCancel: () => void;
// }

// const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
//   onSave,
//   onCancel,
// }) => {
//   const [userId, setUserId] = useState<number | "">("");
//   // const [userName, setUserName] = useState("");
//   const [emailInput, setEmailInput] = useState("");
//   const [date, setDate] = useState<Date | null>(new Date());
//   const [leaveType, setLeaveType] = useState("");
//   const [count, setCount] = useState<number | "">("");
//   const [comment, setComment] = useState("");

//   // In a real app, you would fetch users and leave types from your API
//   const mockUsers = [
//     { id: 101, name: "John Doe", email: "john@gmial.com" },
//     { id: 102, name: "Jane Smith", email: "Jane@gmail.com" },
//   ];

//   const mockLeaveTypes = ["Annual Leave", "Sick Leave", "Unpaid Leave"];

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!userId) {
//       alert("Please select an employee");
//       return;
//     }

//     if (!date) {
//       alert("Please select a date");
//       return;
//     }

//     if (!leaveType) {
//       alert("Please select a leave type");
//       return;
//     }

//     if (count === "") {
//       alert("Please enter a count value");
//       return;
//     }

//     const selectedUser = mockUsers.find((u) => u.id === userId);

//     if (!selectedUser) {
//       alert("Invalid employee selected");
//       return;
//     }

//     try {
//       const selectedUser = users.find((u) => u.id === userId);
//       if (!selectedUser) throw new Error("Invalid employee selected");

//       onSave({
//         userId,
//         userName: selectedUser.name,
//         year: date.getFullYear(),
//         month: date.getMonth() + 1,
//         date: date.getDate(),
//         leaveType,
//         count: Number(count),
//         comment: comment || null,
//       });
//     } catch (error) {
//       console.error("Error submitting transaction:", error);
//       alert(error.message);
//     }
//   };
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="row g-3">
//         {/* Employee */}
//         <div className="col-md-4">
//           <label className="form-label">Employee Email</label>
//           <input
//             type="email"
//             className="form-control"
//             list="userEmailList"
//             value={emailInput}
//             onChange={(e) => {
//               const value = e.target.value;
//               setEmailInput(value);
//               const user = mockUsers.find((u) => u.email === value);
//               if (user) {
//                 setUserId(user.id);
//                 // setUserName(user.name);
//               } else {
//                 setUserId("");
//                 // setUserName("");
//               }
//             }}
//             placeholder="Search by email"
//             required
//           />
//           <datalist id="userEmailList">
//             {mockUsers.map((user) => (
//               <option key={user.id} value={user.email} />
//             ))}
//           </datalist>
//         </div>

//         {/* Date */}
//         <div className="col-md-4">
//           <label className="form-label">Date</label>
//           <div className="w-100">
//             <DatePicker
//               selected={date}
//               onChange={setDate}
//               className="form-control"
//               required
//             />
//           </div>
//         </div>

//         {/* Leave Type */}
//         <div className="col-md-4">
//           <label className="form-label">Leave Type</label>
//           <select
//             className="form-select"
//             value={leaveType}
//             onChange={(e) => setLeaveType(e.target.value)}
//             required
//           >
//             <option value="">Select leave type</option>
//             {mockLeaveTypes.map((type) => (
//               <option key={type} value={type}>
//                 {type}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Days */}
//         <div className="col-md-4">
//           <label className="form-label">Days</label>
//           <input
//             type="number"
//             className="form-control"
//             step="0.5"
//             min="-365"
//             max="365"
//             value={count}
//             onChange={(e) =>
//               setCount(e.target.value ? Number(e.target.value) : "")
//             }
//             required
//           />
//         </div>

//         {/* Comment */}
//         <div className="col-md-8">
//           <label className="form-label">Comment</label>
//           <input
//             type="text"
//             className="form-control"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Optional comment"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="col-12 d-flex justify-content-end gap-2">
//           <button
//             type="button"
//             className="btn btn-outline-secondary"
//             onClick={onCancel}
//           >
//             Cancel
//           </button>
//           <button type="submit" className="btn btn-primary">
//             Add Transaction
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default LeaveTransactions;

import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaInfoCircle,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import leaveTransactionService from "../../services/api-services/leave-transaction.service";
import leaveTypeService from "../../services/api-services/leave-type.service";
import {
  LeaveTransactionFilters,
  CreateLeaveTransactionRequest,
  LeaveType,
} from "../../types/leave.types";
import { User } from "../../types/user.types";
import userService from "../../services/api-services/user.service";
import { useAppSelector } from "../../store/store";

interface LeaveTransaction {
  id: number;
  userId: number;
  userName?: string;
  year: number;
  month: number;
  date: number;
  leaveType?: string;
  leaveTypeId: number;
  count: number;
  comment: string | null;
  createdOn: string;
  assignedByName: string | null;
}

const LeaveTransactions = () => {
  const [transactions, setTransactions] = useState<LeaveTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [leaveTypeFilter, setLeaveTypeFilter] = useState<string>("");
  const [yearFilter, setYearFilter] = useState<number | "">(
    new Date().getFullYear()
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch transactions
        const params: LeaveTransactionFilters = {};
        const transactionResponse =
          await leaveTransactionService.getLeaveTransactions(params);

        // Transform the data to ensure we have string values
        const transformedTransactions = await Promise.all(
          transactionResponse.data.map(async (transaction: any) => {
            const assignedByUser = await userService.getUserById(
              transaction.assignedBy
            );
            return {
              ...transaction,
              userName: transaction.user?.name || "N/A",
              leaveType: transaction.leaveType?.name || "N/A",
              assignedByName: assignedByUser?.data.name || "System",
            };
          })
        );

        setTransactions(transformedTransactions);

        // Fetch users
        const userResponse = await userService.getAllUsers();
        setUsers(userResponse.data);

        // Fetch leave types
        const leaveTypeResponse = await leaveTypeService.getLeaveTypes();
        setLeaveTypes(leaveTypeResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique leave types for filter dropdown from transactions
  const transactionLeaveTypes = Array.from(
    new Set(transactions.map((t) => t.leaveType))
  );

  // Get unique years for filter dropdown
  const years = Array.from(new Set(transactions.map((t) => t.year)));

  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    const matchesSearch =
      (transaction.userName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.leaveType || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.comment &&
        transaction.comment.toLowerCase().includes(searchTerm.toLowerCase()));

    // Leave type filter
    const matchesLeaveType = leaveTypeFilter
      ? transaction.leaveType === leaveTypeFilter
      : true;

    // Year filter
    const matchesYear = yearFilter ? transaction.year === yearFilter : true;

    return matchesSearch && matchesLeaveType && matchesYear;
  });

  const handleAddTransaction = async (
    newTransaction: CreateLeaveTransactionRequest
  ) => {
    try {
      await leaveTransactionService.createLeaveTransaction({
        ...newTransaction,
        comment: newTransaction.comment || undefined,
      });

      // Refresh transactions after adding
      const params: LeaveTransactionFilters = {};
      const updatedResponse =
        await leaveTransactionService.getLeaveTransactions(params);

      const transformedTransactions = await Promise.all(
          updatedResponse.data.map(async (transaction: any) => {
            const assignedByUser = await userService.getUserById(
              transaction.assignedBy
            );
            return {
              ...transaction,
              userName: transaction.user?.name || "N/A",
              leaveType: transaction.leaveType?.name || "N/A",
              assignedByName: assignedByUser?.data.name || "System",
            };
          })
        );

      setTransactions(transformedTransactions);

      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create transaction:", error);
      alert("Failed to create transaction");
    }
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Leave Transactions</h2>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? (
                <>
                  <FaTrash className="me-1" />
                  Cancel
                </>
              ) : (
                <>
                  <FaPlus className="me-1" />
                  Add Transaction
                </>
              )}
            </button>
          </div>
        </div>

        {/* Add Transaction Form */}
        {showAddForm && (
          <div className="card-body border-bottom">
            <AddTransactionForm
              users={users}
              leaveTypes={leaveTypes}
              onSave={handleAddTransaction}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Filters */}
        <div className="card-body border-bottom">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={leaveTypeFilter}
                onChange={(e) => setLeaveTypeFilter(e.target.value)}
              >
                <option value="">All Leave Types</option>
                {transactionLeaveTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={yearFilter}
                onChange={(e) =>
                  setYearFilter(e.target.value ? Number(e.target.value) : "")
                }
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("");
                  setLeaveTypeFilter("");
                  setYearFilter("");
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No transactions found</h4>
              <p>Try adjusting your filters or add a new transaction</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Days</th>
                    <th>Comment</th>
                    <th>Assigned By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        {new Date(
                          transaction.year,
                          transaction.month - 1,
                          transaction.date
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
                            <FaUser className="text-muted" />
                          </div>
                          {transaction.userName || "Unknown User"}
                        </div>
                      </td>
                      <td>{transaction.leaveType || "Unknown Leave Type"}</td>
                      <td
                        className={
                          transaction.count > 0 ? "text-success" : "text-danger"
                        }
                      >
                        {transaction.count > 0 ? "+" : ""}
                        {transaction.count}
                      </td>
                      <td>
                        <small className="text-muted">
                          {transaction.comment || "-"}
                        </small>
                      </td>
                      <td>{transaction.assignedByName || "System"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {filteredTransactions.length} of {transactions.length}{" "}
              transactions
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex={-1}>
                    Previous
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Transaction Form Component
interface AddTransactionFormProps {
  users: User[];
  leaveTypes: LeaveType[];
  onSave: (transaction: CreateLeaveTransactionRequest) => void;
  onCancel: () => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  users,
  leaveTypes,
  onSave,
  onCancel,
}) => {
  const [userId, setUserId] = useState<number | "">("");
  const [emailInput, setEmailInput] = useState("");
  const [date, setDate] = useState<Date | null>(new Date());
  const [leaveTypeId, setLeaveTypeId] = useState<number | "">("");
  const [count, setCount] = useState<number | "">("");
  const [comment, setComment] = useState("");

  const currentUser = useAppSelector((s) => s.auth.userData?.user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert("Please select an employee");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    if (!leaveTypeId) {
      alert("Please select a leave type");
      return;
    }

    if (count === "") {
      alert("Please enter a count value");
      return;
    }

    const selectedUser = users.find((u) => u.id === userId);
    if (!selectedUser) {
      alert("Invalid employee selected");
      return;
    }

    try {
      const transactionData: CreateLeaveTransactionRequest = {
        userId: Number(userId),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        date: date.getDate(),
        leaveTypeId: Number(leaveTypeId),
        count: Number(count),
        comment: comment || undefined,
        assignedBy: currentUser?.id,
      };

      onSave(transactionData);
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("Error creating transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* Employee */}
        <div className="col-md-4">
          <label className="form-label">Employee Email</label>
          <input
            type="email"
            className="form-control"
            list="userEmailList"
            value={emailInput}
            onChange={(e) => {
              const value = e.target.value;
              setEmailInput(value);
              const user = users.find((u) => u.username === value);
              if (user) {
                setUserId(user.id);
              } else {
                setUserId("");
              }
            }}
            placeholder="Search by email"
            required
          />
          <datalist id="userEmailList">
            {users.map((user) => (
              <option key={user.id} value={user.username} />
            ))}
          </datalist>
        </div>

        {/* Date */}
        <div className="col-md-4">
          <label className="form-label">Date</label>
          <div className="w-100">
            <DatePicker
              selected={date}
              onChange={setDate}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Leave Type */}
        <div className="col-md-4">
          <label className="form-label">Leave Type</label>
          <select
            className="form-select"
            value={leaveTypeId}
            onChange={(e) =>
              setLeaveTypeId(e.target.value ? Number(e.target.value) : "")
            }
            required
          >
            <option value="">Select leave type</option>
            {leaveTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Days */}
        <div className="col-md-4">
          <label className="form-label">Days</label>
          <input
            type="number"
            className="form-control"
            step="0.5"
            min="-365"
            max="365"
            value={count}
            onChange={(e) =>
              setCount(e.target.value ? Number(e.target.value) : "")
            }
            required
          />
        </div>

        {/* Comment */}
        <div className="col-md-8">
          <label className="form-label">Comment</label>
          <input
            type="text"
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional comment"
          />
        </div>

        {/* Buttons */}
        <div className="col-12 d-flex justify-content-end gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Transaction
          </button>
        </div>
      </div>
    </form>
  );
};

export default LeaveTransactions;
