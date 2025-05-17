import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Department } from "../../../types/department-team.types";
import { User } from "../../../types/user.types";
import DepartmentTeamService from "../../../services/api-services/department-team.service";
import userService from "../../../services/api-services/user.service";
import userDepartmentService from "../../../services/api-services/user-department.service";

const AssignUsersToDepartment = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminUsers, setAdminUsers] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResponse, usersResponse] = await Promise.all([
          DepartmentTeamService.getDepartments(),
          userService.getAllUsers()
        ]);
        setDepartments(deptResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleUserSelect = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAdminToggle = (userId: number) => {
    setAdminUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };


  const handleAssignUsers = async () => {
    if (!selectedDepartment || selectedUsers.length === 0) return;
    
    try {
      // Create an array of promises for each user assignment
      const assignments = selectedUsers.map(userId => 
        userDepartmentService.createUserDepartment({
          departmentId: parseInt(selectedDepartment),
          userId: userId,
          isAdmin: adminUsers.includes(userId)
        })
      );
      console.log("asssssss",assignments);
      
      // Execute all assignments in parallel
      await Promise.all(assignments);
      
      // Clear selections after successful assignment
      setSelectedUsers([]);
      setAdminUsers([]);
      alert("Users assigned successfully!");
    } catch (error) {
      console.error("Assignment failed:", error);
      alert("Failed to assign some users");
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch ;
  });

  if (loading) return <div className="text-center p-5">Loading...</div>;

  return (
    <div className="container p-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Assign Users to Department</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="user-list" style={{ maxHeight: "500px", overflowY: "auto" }}>
                {filteredUsers.map(user => (
                  <div key={user.id} className="card mb-2">
                    <div className="card-body d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="form-check-input me-3"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => handleUserSelect(user.id)}
                        />
                        <div>
                          <h5 className="mb-0">{user.name}</h5>
                          <small className="text-muted">{user.username}</small>
                        </div>
                      </div>
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={adminUsers.includes(user.id)}
                          onChange={() => handleAdminToggle(user.id)}
                          disabled={!selectedUsers.includes(user.id)}
                        />
                        <label className="form-check-label">
                          Admin
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="sticky-top" style={{ top: "1rem" }}>
                <div className="mb-3">
                  <label className="form-label">Select Department</label>
                  <select
                    className="form-select"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="">Choose Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  className="btn btn-primary w-100"
                  onClick={handleAssignUsers}
                  disabled={!selectedDepartment || selectedUsers.length === 0}
                >
                  Assign Selected Users ({selectedUsers.length})
                </button>
                
                <Link to="/department-management" className="btn btn-secondary w-100 mt-3">
                  Back to Departments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignUsersToDepartment;