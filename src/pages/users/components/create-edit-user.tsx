import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import userService from "../../../services/api-services/user.service";
import departmentService from "../../../services/api-services/department.service";
import leaveSchemeService from "../../../services/api-services/leave-scheme.service";
import { DepartmentResponse } from "../../../types/department-team.types";
import { GENDERS, WEEK_DAYS } from "../../../utils/constants";
import {
  UserDetails,
  UserInfo,
  CreateUserPayload,
  UpdateUserPayload,
  UserDepartmentResp,
} from "../../../types/user.types";
import { BsShieldCheck } from "react-icons/bs";

interface UserFormProps {
  id: number | null;
  onSuccess: () => void;
}

type LeaveScheme = {
  id: number;
  name: string;
};

const CreateEditUser: React.FC<UserFormProps> = ({ id, onSuccess }) => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [leaveSchemes, setLeaveSchemes] = useState<LeaveScheme[]>([]);
  const [userDepartments, setUserDepartments] = useState<UserDepartmentResp[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [joiningDateValue, setJoiningDateValue] = useState<Date | null>(null);

  const [userDetails, setUserDetails] = useState<UserDetails>({
    gender: "MALE",
    dob: "",
    joiningDate: "",
    leaveSchemeId: null,
    weekoff: "",
  });

  const [formData, setFormData] = useState<UserInfo>({
    name: "",
    username: "",
    contact: "91",
    password: "",
    empCode: "",
    isActive: true,
  });

  // Fetch departments and leave schemes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResp, leaveResp] = await Promise.all([
          departmentService.getDepartments(),
          leaveSchemeService.getLeaveSchemes(),
        ]);

        if (deptResp.status === "success") {
          setDepartments(deptResp.data);
        }
        setLeaveSchemes(leaveResp.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  // Fetch user data if editing
  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    if (!id) return;

    setInitialLoading(true);
    try {
      // Fetch user basic info
      const userResp = await userService.getUserById(id);
      if (userResp.status === "success") {
        const userData = userResp.data;
        setFormData({
          name: userData.name,
          username: userData.username,
          contact: userData.contact,
          password: userData.password,
          empCode: userData.empCode || null,
          isActive: userData.isActive,
        });

        // If user has details, populate them
        if (userData.userDetails) {
          setUserDetails(userData.userDetails);
          if (userData.userDetails.dob) {
            setDobDate(new Date(userData.userDetails.dob));
          }
          if (userData.userDetails.joiningDate) {
            setJoiningDateValue(new Date(userData.userDetails.joiningDate));
          }
        }
        if (userData.userDepartment) {
          setUserDepartments(userData.userDepartment);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleDateChange = (
    field: "dob" | "joiningDate",
    date: Date | null
  ) => {
    if (field === "dob") {
      setDobDate(date);
      setUserDetails((prev) => ({
        ...prev,
        dob: date ? date.toISOString() : "",
      }));
    } else {
      setJoiningDateValue(date);
      setUserDetails((prev) => ({
        ...prev,
        joiningDate: date ? date.toISOString() : "",
      }));
    }
  };

  const handleDepartmentToggle = ({ id, name }: DepartmentResponse) => {
    setUserDepartments((prev) => {
      const exists = prev.find((d) => d.departmentId === id);
      if (exists) {
        return prev.filter((d) => d.departmentId !== id);
      } else {
        return [
          ...prev,
          { departmentId: id, isAdmin: false, department: { name } },
        ];
      }
    });
  };

  const handleAdminToggle = (departmentId: number) => {
    setUserDepartments((prev) =>
      prev.map((d) =>
        d.departmentId === departmentId ? { ...d, isAdmin: !d.isAdmin } : d
      )
    );
  };

  const isDepartmentSelected = (departmentId: number) => {
    return userDepartments.some((d) => d.departmentId === departmentId);
  };

  const isAdmin = (departmentId: number) => {
    const dept = userDepartments.find((d) => d.departmentId === departmentId);
    return dept?.isAdmin || false;
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!formData.name || !formData.username || !formData.contact) {
      toast.error("Please fill all required basic fields");
      return false;
    }

    // Password required for new users
    if (!id && !formData.password) {
      toast.error("Password is required for new users");
      return false;
    }

    // Additional validation for new users
    if (!id) {
      if (!userDetails.gender || !userDetails.dob || !userDetails.joiningDate) {
        toast.error("Please fill all required personal details");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      if (id) {
        // Update existing user
        const updateData: UpdateUserPayload = {
          name: formData.name,
          username: formData.username,
          contact: formData.contact,
          empCode: formData.empCode || null,
          isActive: formData.isActive,
          userDetails: userDetails,
          password: formData.password,
        };

        // Only include password if it's been changed
        if (formData.password) {
          updateData.password = formData.password;
        }

        const resp = await userService.updateUser(id, updateData);

        if (resp.status === "success") {
          // Update departments separately
          const res = await userService.updateUserDepartments(
            id,
            userDepartments.map((i) => ({
              departmentId: i.departmentId,
              isAdmin: i.isAdmin,
            }))
          );
          if (res.status === "success") {
            toast.success("User updated successfully");
            onSuccess();
          } else toast.error(res.message);
        } else {
          toast.error(resp.message || "Failed to update user");
        }
      } else {
        // Create new user
        const createData: CreateUserPayload = {
          name: formData.name,
          username: formData.username,
          contact: formData.contact,
          password: formData.password,
          empCode: formData.empCode || null,
          isActive: formData.isActive,
          userDetails: userDetails,
          departments: userDepartments,
        };

        const resp = await userService.createUser(createData);

        if (resp.status === "success") {
          toast.success("User created successfully");
          onSuccess();
        } else {
          toast.error(resp.message || "Failed to create user");
        }
      }
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("An error occurred while saving user");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* Basic User Information */}
        <div className="col-md-6">
          <h6 className="text-primary mb-3">Basic Information</h6>
          <div className="mb-3">
            <label className="form-label">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Username (Email) <span className="text-danger">*</span>
            </label>
            <input
              type="email"
              className="form-control"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Contact <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Password {!id && <span className="text-danger">*</span>}
            </label>
            <input
              type="password"
              className="form-control"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder={
                id ? "Leave blank to keep unchanged" : "Enter password"
              }
              required={!id}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Employee Code</label>
            <input
              type="text"
              className="form-control"
              value={formData.empCode || ""}
              onChange={(e) =>
                setFormData({ ...formData, empCode: e.target.value })
              }
            />
          </div>
          <div className="mb-3 form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="isActiveToggle"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <label className="form-check-label" htmlFor="isActiveToggle">
              Active User
            </label>
          </div>
        </div>

        {/* User Details (only for new users) */}
        <div className="col-md-6">
          <h6 className="text-primary mb-3">Personal Details</h6>
          <div className="mb-3">
            <label className="form-label">
              Gender <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={userDetails.gender}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  gender: e.target.value as "MALE" | "FEMALE" | "OTHER",
                })
              }
              required
            >
              <option value="">Select Gender</option>
              {GENDERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3 d-flex flex-column">
            <label className="form-label">
              Date of Birth <span className="text-danger">*</span>
            </label>
            <DatePicker
              selected={dobDate}
              onChange={(date) => handleDateChange("dob", date)}
              className="form-control"
              placeholderText="Select date of birth"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              required
            />
          </div>
          <div className="mb-3 d-flex flex-column">
            <label className="form-label">
              Joining Date <span className="text-danger">*</span>
            </label>
            <DatePicker
              selected={joiningDateValue}
              onChange={(date) => handleDateChange("joiningDate", date)}
              className="form-control"
              placeholderText="Select joining date"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Week Off <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              value={userDetails.weekoff}
              onChange={(e) =>
                setUserDetails({ ...userDetails, weekoff: e.target.value })
              }
              required
            >
              <option value="">Select Week Off</option>
              {WEEK_DAYS.map((day) => (
                <option key={day} value={day}>
                  {day.charAt(0) + day.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Leave Scheme</label>
            <select
              className="form-select"
              value={userDetails.leaveSchemeId || ""}
              onChange={(e) =>
                setUserDetails({
                  ...userDetails,
                  leaveSchemeId: e.target.value
                    ? parseInt(e.target.value)
                    : null,
                })
              }
            >
              <option value="">Select Leave Scheme (Optional)</option>
              {leaveSchemes.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Department Assignments */}
        <div className={""}>
          <h6 className="text-primary mb-3">
            Department Assignments{" "}
            {!id && <span className="text-danger">*</span>}
          </h6>
          <div
            className="border rounded p-2"
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#f8f9fa",
            }}
          >
            {departments.length === 0 ? (
              <p className="text-muted mb-0">No departments available</p>
            ) : (
              departments.map((dept) => (
                <div key={dept.id} className="mb-1 p-2 border rounded bg-white">
                  <div className="">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`dept-${dept.id}`}
                        checked={isDepartmentSelected(dept.id)}
                        onChange={() => handleDepartmentToggle(dept)}
                      />
                      <label
                        className="form-check-label fw-medium"
                        htmlFor={`dept-${dept.id}`}
                      >
                        {dept.name}
                      </label>
                    </div>
                    {isDepartmentSelected(dept.id) && (
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`admin-${dept.id}`}
                          checked={isAdmin(dept.id)}
                          onChange={() => handleAdminToggle(dept.id)}
                        />
                        <label
                          className="form-check-label text-primary fw-medium"
                          htmlFor={`admin-${dept.id}`}
                        >
                          <BsShieldCheck size={15} />
                          Make Admin
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          {userDepartments.length > 0 && (
            <div className="mt-2">
              <small className="text-muted">
                Selected: {userDepartments.length} department(s),{" "}
                {userDepartments.filter((d) => d.isAdmin).length} admin role(s)
              </small>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {id ? "Updating..." : "Creating..."}
            </>
          ) : id ? (
            "Update User"
          ) : (
            "Create User"
          )}
        </button>
      </div>
    </form>
  );
};

export default CreateEditUser;
