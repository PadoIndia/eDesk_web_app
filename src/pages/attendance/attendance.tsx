import { useState, useEffect } from "react";
import { useAppSelector } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DashboardHeader from "./components/header";
import DashboardControls from "./components/control";
import AttendanceTables from "./components/attendance-table";
import RequestsTable from "./components/requests-table";
import MissPunchForm from "./components/miss-punch-form";
import ApproveRejectModal from "./components/approve-reject-modal";
// import AdminControls from "./components/admin-control";
import LoadingErrorState from "./components/loading-error-state";

import punchDataService from "../../services/api-services/punch-data.service";
import userService from "../../services/api-services/user.service";
import userDepartmentService from "../../services/api-services/user-department.service";
import departmentTeamService from "../../services/api-services/department-team.service";

// Type definitions
import { AttendanceUser, Punch } from "../../types/attendance.types";

const AttendanceDashboard = () => {
  // Get userId from Redux store
  const userId = useAppSelector((state) => state.auth.userData?.user.id);
  
  const [users, setUsers] = useState<AttendanceUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AttendanceUser | null>(null);
  const [missPunchRequests, setMissPunchRequests] = useState<Punch[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showMissPunchForm, setShowMissPunchForm] = useState(false);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Punch | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const selectedMonth = new Date().getMonth() + 1; // API expects 1-12
  const selectedYear = new Date().getFullYear();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [currentView, setCurrentView] = useState<"department" | "requests">("department");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Calculate attendance status based on punch data
  const calculateAttendanceStatus = (punchData: Punch[]): "A" | "P" => {
    const today = new Date();
    return punchData.some(p => 
      p.date === today.getDate() &&
      p.month === today.getMonth() + 1 &&
      p.year === today.getFullYear()
    ) ? "P" : "A";
  };

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!userId) {
          throw new Error("User ID is required");
        }
        
        // Get current user data first
        const userResponse = await userService.getUserById(Number(userId));
        if (!userResponse.data) {
          throw new Error("Failed to fetch user data");
        }
        
        const userData = userResponse.data;
        
        // Get user's department
        const userDepartmentResponse = await userDepartmentService.getUserDepartmentIdByUserId(userId);
        const departmentData = userDepartmentResponse.data[0];
        const department = await departmentTeamService.getDepartmentById(departmentData.departmentId);
        
        // Get user's punch data
        const punchDataResponse = await punchDataService.getPunchDataById(
          userId, 
          { month: selectedMonth, year: selectedYear }
        );
        
        const punchData = punchDataResponse.data || [];
        
        // Create transformed user object
        const transformedUser: AttendanceUser = {
          id: userId,
          name: userData.name || "Unknown User",
          department: department?.data?.name || "Not Assigned",
          isAdmin: departmentData?.isAdmin || false,
          punchData: punchData.map((p:  Partial<Punch>) => ({
            ...p,
            userName: userData.name,
            userDepartment: department?.data?.name
          })),
          attendance: { 
            status: calculateAttendanceStatus(punchData),
            statusManual: "",
            comment: "" 
          },
          callDetails: [],
          classDetails: []
        };
        
        setCurrentUser(transformedUser);
        setIsAdmin(transformedUser.isAdmin);
        
        // If user is admin, fetch all users in their department
        if (transformedUser.isAdmin) {
          const allUsersResponse = await userService.getAllUsers();
          
          if (!allUsersResponse.data) {
            throw new Error("Failed to fetch users");
          }
          
          // Filter and transform users
          const departmentUsers = await Promise.all(
            allUsersResponse.data
              .filter(user => user.name !== null)
              .map(async (user) => {
                // Get user's department
                const userDeptResponse = await userDepartmentService.getUserDepartmentIdByUserId(user.id);
                const userDeptData = userDeptResponse.data[0];
                
                if (!userDeptData) return null;
                
                const userDept = await departmentTeamService.getDepartmentById(userDeptData.departmentId);
                
                // Only include users from the same department as the admin
                if (userDept?.data?.name !== transformedUser.department) {
                  return null;
                }
                
                // Get user's punch data
                const userPunchDataResponse = await punchDataService.getPunchDataById(
                  user.id, 
                  { month: selectedMonth, year: selectedYear }
                );
                
                const userPunchData = userPunchDataResponse.data || [];
                
                return {
                  id: user.id,
                  name: user.name || "Unknown User",
                  department: userDept?.data?.name || "Not Assigned",
                  isAdmin: userDeptData?.isAdmin || false,
                  punchData: userPunchData.map((p: Partial<Punch>) => ({
                    ...p, 
                    userName: user.name,
                    userDepartment: userDept?.data?.name
                  })),
                  attendance: { 
                    status: calculateAttendanceStatus(userPunchData),
                    statusManual: "",
                    comment: "" 
                  },
                  callDetails: [],
                  classDetails: []
                } as AttendanceUser;
              })
          );
          
          // Filter out null values and add current user
          const filteredUsers = [
            transformedUser,
            ...departmentUsers.filter((user): user is AttendanceUser => user !== null)
          ];
          
          setUsers(filteredUsers);
          
          // Fetch pending miss punch requests for the department
          const pendingPunchRequests = filteredUsers
            .flatMap(user => user.punchData)
            .filter((punch: Punch) => punch.type === "MANUAL" && punch.isApproved === undefined);
          
          setMissPunchRequests(pendingPunchRequests);
        } else {
          // For non-admin users, just use their own data
          setUsers([transformedUser]);
          
          // Filter punch requests for non-admin (only their own)
          const pendingPunchRequests = transformedUser.punchData
            .filter((punch: Punch): boolean => punch.type === "MANUAL" && punch.isApproved === undefined);
          
          setMissPunchRequests(pendingPunchRequests);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load attendance data");
        toast.error("Error loading data: " + (err instanceof Error ? err.message : "Unknown error")); 
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchInitialData();
    }
  }, [userId, selectedMonth, selectedYear]);

  // Update selected date when month/year changes
  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth - 1, 1);
    setSelectedDate(newDate.toISOString().split("T")[0].substring(0, 8) + "01");
  }, [selectedMonth, selectedYear]);

  // Filter users based on search term and department
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "All" || user.department === filterDepartment;

    // If not admin, only show current user
    if (!isAdmin) return user.id === userId;
    
    // If admin, filter based on search and department
    return matchesSearch && matchesDepartment;
  });

  // Filter requests based on user role
  const filteredRequests = missPunchRequests.filter((request) => {
    if (!currentUser) return false;
    
    // For admins, show requests from their department
    if (isAdmin) {
      return request.userDepartment === currentUser.department && request.isApproved === undefined;
    }
    
    // For non-admins, only show their own requests
    return request.userId === userId && request.isApproved === undefined;
  });

  // Handler for miss punch request
  const handleMissPunchRequest = (date: string) => {
    setSelectedDate(date);
    setFormData({
      ...formData,
      date
    });
    setShowMissPunchForm(true);
  };

  // Handler for manual status change
  const handleManualStatusChange = async (userId: number, date: string, newStatus: string): Promise<void> => {
    try {
      // In a real implementation, you'd call an API to update the status
      // For example: await attendanceService.updateManualStatus(userId, newStatus);
        
      const updatedUsers = users.map((user: AttendanceUser) => {
        if (user.id === userId) {
          return {
            ...user,
            attendance: {
              ...user.attendance,
              statusManual: newStatus,
            },
          };
        }
        return user;
      });
      setUsers(updatedUsers);
      toast.success("Manual status updated successfully");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to update status: " + errorMessage);
    }
  };

  // Form submit handler for miss punch request
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!currentUser || !formData.time || !formData.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Parse the time string to get hours and minutes
      const [hours, minutes] = formData.time.split(':').map(Number);
      const dateParts = formData.date.split('-').map(Number);
      
      // Ensure we have valid date parts
      if (dateParts.length !== 3) {
        toast.error("Invalid date format");
        return;
      }
      
      const newPunchData: Partial<Punch> = {
        userId: currentUser.id,
        date: dateParts[2], // Day
        month: dateParts[1], // Month
        year: dateParts[0], // Year
        hh: hours,
        mm: minutes,
        type: "MANUAL",
        missPunchReason: formData.reason,
      };

      // In a real implementation, call the API
      // const response = await punchDataService.createPunchData(newPunchData);
      
      // Create a mock response for now
      const mockResponse: Punch = {
        ...newPunchData as Punch,
        id: Math.floor(Math.random() * 1000), // Place id after spread to ensure it's not overwritten
        userName: currentUser.name,
        userDepartment: currentUser.department,
      };

      // Update state with the new punch data
      const newPunch: Punch = mockResponse;
      setMissPunchRequests([...missPunchRequests, newPunch]);
      
      setUsers(
        users.map((user) =>
          user.id === currentUser.id
            ? { ...user, punchData: [...user.punchData, newPunch] }
            : user
        )
      );
      
      toast.success("Miss punch request submitted successfully!");
      setShowMissPunchForm(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to submit request: " + errorMessage);
    }
  };

  // Handler for approve/reject actions
  const handleApproveReject = (request: Punch, action: "approve" | "reject"): void => {
    setCurrentRequest(request);
    setActionType(action);
    setRejectionReason("");
    setShowApproveRejectModal(true);
  };

  // Confirm approve/reject action
  const confirmApproveReject = async () => {
    if (!currentRequest || !actionType || !currentUser) return;

    try {
      // In a real implementation, call the API
      // const response = await punchDataService.updatePunchData(
      //   currentRequest.userId, 
      //   { 
      //     punchId: currentRequest.id, 
      //     isApproved: actionType === "approve",
      //     ...(actionType === "reject" ? { rejectionReason } : {})
      //   }
      // );

      const updatedRequests = missPunchRequests.map((req) =>
        req.id === currentRequest.id
          ? {
              ...req,
              isApproved: actionType === "approve",
              ...(actionType === "approve"
                ? {
                    approvedBy: currentUser.name,
                    approvedOn: new Date().toISOString().split("T")[0],
                  }
                : {
                    missPunchReason: rejectionReason,
                  }),
            }
          : req
      );

      const updatedUsers = users.map((user) =>
        user.id === currentRequest.userId
          ? {
              ...user,
              punchData: user.punchData.map((punch) =>
                punch.id === currentRequest.id
                  ? {
                      ...punch,
                      isApproved: actionType === "approve",
                      ...(actionType === "approve"
                        ? {
                            approvedBy: currentUser.name,
                            approvedOn: new Date().toISOString().split("T")[0],
                          }
                        : {
                            missPunchReason: rejectionReason,
                          }),
                    }
                  : punch
              ),
            }
          : user
      );

      setMissPunchRequests(updatedRequests);
      setUsers(updatedUsers);
      toast.success(
        `Request ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      setShowApproveRejectModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to ${actionType} request: ` + errorMessage);
    }
  };

  if (loading || error || !currentUser) {
    return <LoadingErrorState loading={loading} error={error} currentUser={currentUser} />;
  }

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <DashboardHeader currentUser={currentUser} />

      <div className="card shadow mb-4">
        <DashboardHeader 
          currentUser={currentUser} 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          filteredRequests={filteredRequests} 
          isCardHeader={true}
        />
        
        <div className="card-body">
          {currentView === "department" && (
            <>
              {isAdmin && (
                <DashboardControls 
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterDepartment={filterDepartment}
                  setFilterDepartment={setFilterDepartment}
                  users={users}
                  currentUser={currentUser}
                  handleMissPunchRequest={handleMissPunchRequest}
                />
              )}
              
              <AttendanceTables
                users={filteredUsers}
                currentUser={currentUser}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth-1} // Convert back to 0-11 for component
                selectedDate={selectedDate}
                onManualStatusChange={handleManualStatusChange}
                onMissPunchRequest={handleMissPunchRequest}
                isAdmin={isAdmin}
                currentView={currentView}
              />
            </>
          )}
          
          {currentView === "requests" && (
            <RequestsTable 
              filteredRequests={filteredRequests} 
              handleApproveReject={handleApproveReject} 
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>

      {/* Miss Punch Request Modal */}
      {showMissPunchForm && (
        <MissPunchForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          setShowMissPunchForm={setShowMissPunchForm}
        />
      )}

      {/* Approve/Reject Modal */}
      {showApproveRejectModal && currentRequest && (
        <ApproveRejectModal
          currentRequest={currentRequest}
          actionType={actionType}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          confirmApproveReject={confirmApproveReject}
          setShowApproveRejectModal={setShowApproveRejectModal}
        />
      )}
    </div>
  );
};

export default AttendanceDashboard;