import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaInfoCircle,
  FaFilter,
  FaDownload,
} from "react-icons/fa";

interface UserLeaveBalance {
  userId: number;
  userName: string;
  leaveScheme: string;
  balances: {
    leaveType: string;
    total: number;
    used: number;
    remaining: number;
    carryForward: number;
  }[];
}

const UserLeaveBalances = () => {
  const [balances, setBalances] = useState<UserLeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [schemeFilter, setSchemeFilter] = useState<string>("");

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const mockData: UserLeaveBalance[] = [
      {
        userId: 101,
        userName: "John Doe",
        leaveScheme: "Standard Employee",
        balances: [
          {
            leaveType: "Annual Leave",
            total: 20,
            used: 8,
            remaining: 12,
            carryForward: 5,
          },
          // More sample balances...
        ],
      },
      // More sample users...
    ];

    setTimeout(() => {
      setBalances(mockData);
      setLoading(false);
    }, 800);
  }, []);

  // Get unique leave schemes for filter dropdown
  const leaveSchemes = Array.from(new Set(balances.map((b) => b.leaveScheme)));

  const filteredBalances = balances.filter((user) => {
    // Search filter
    const matchesSearch = user.userName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Scheme filter
    const matchesScheme = schemeFilter
      ? user.leaveScheme === schemeFilter
      : true;

    return matchesSearch && matchesScheme;
  });

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h2 className="mb-0">User Leave Balances</h2>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-primary">
              <FaDownload className="me-1" /> Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card-body border-bottom">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select"
                value={schemeFilter}
                onChange={(e) => setSchemeFilter(e.target.value)}
              >
                <option value="">All Leave Schemes</option>
                {leaveSchemes.map((scheme) => (
                  <option key={scheme} value={scheme}>
                    {scheme}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm("");
                  setSchemeFilter("");
                }}
              >
                <FaFilter className="me-1" /> Clear
              </button>
            </div>
          </div>
        </div>

        {/* Balances Table */}
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredBalances.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No user balances found</h4>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            // <div className="table-responsive">
            //   <table className="table table-hover">
            //     <thead>
            //       <tr>
            //         <th>User</th>
            //         <th>Scheme</th>
            //         <th>Leave Balances</th>
            //       </tr>
            //     </thead>
            //     <tbody>
            //       {filteredBalances.map(user => (
            //         <React.Fragment key={user.userId}>
            //           <tr>
            //             <td>
            //               <div className="d-flex align-items-center">
            //                 <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
            //                   <FaUser className="text-muted" />
            //                 </div>
            //                 <div>
            //                   <div>{user.userName}</div>
            //                   <small className="text-muted">ID: {user.userId}</small>
            //                 </div>
            //               </div>
            //             </td>
            //             <td>
            //               <span className="badge bg-info">{user.leaveScheme}</span>
            //             </td>
            //             <td colSpan={2}>
            //               <div className="d-flex flex-wrap gap-3">
            //                 {user.balances.map((balance, idx) => (
            //                   <div key={idx} className="border p-2 rounded bg-light">
            //                     <small className="d-block fw-bold">{balance.leaveType}</small>
            //                     <small className="d-block">Total: {balance.total}</small>
            //                     <small className="d-block">Used: {balance.used}</small>
            //                     <small className="d-block">Remaining: {balance.remaining}</small>
            //                     <small className="d-block">Carry Forward: {balance.carryForward}</small>
            //                   </div>
            //                 ))}
            //               </div>
            //             </td>
            //           </tr>
            //         </React.Fragment>
            //       ))}
            //     </tbody>
            //   </table>
            // </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>User</th>
                    <th style={{ width: "15%" }}>Scheme</th>
                    <th style={{ width: "60%" }}>Leave Balances</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBalances.map((user) => (
                    <tr key={user.userId}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
                            <FaUser className="text-muted" />
                          </div>
                          <div>
                            <div className="fw-medium">{user.userName}</div>
                            <small className="text-muted">
                              ID: {user.userId}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info text-white">
                          {user.leaveScheme}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          {user.balances.map((balance, idx) => (
                            <div
                              key={idx}
                              className="border p-2 rounded bg-light flex-grow-1"
                              style={{ minWidth: "150px" }}
                            >
                              <div className="d-flex justify-content-between">
                                <span className="fw-semibold">
                                  {balance.leaveType}
                                </span>
                               
                              </div>
                              <div className="d-flex justify-content-between mt-1">
                                <small>Total:</small>
                                <small>{balance.total}</small>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Used:</small>
                                <small className="text-danger">
                                  {balance.used}
                                </small>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Remaining:</small>
                                <small className="text-success">
                                  {balance.remaining}
                                </small>
                              </div>
                              <div className="d-flex justify-content-between">
                                <small>Carry Forward:</small>
                                <small>{balance.carryForward}</small>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
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
              Showing {filteredBalances.length} of {balances.length} users
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

export default UserLeaveBalances;
