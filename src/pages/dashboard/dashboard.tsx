// pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { FaUser, FaInfoCircle, FaPlus } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import userApi from "../../services/api-services/user.service";
import { useAppSelector } from "../../store/store";
import leaveSchemeService from "../../services/api-services/leave-scheme.service";

// Add the User type
type User = {
  profileImg?: {
    id?: bigint | undefined;
    url: string | null;
  };
  id: number;
  name: string | null;
  username: string;
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
  contact: string;
};

export type CreateUserDetails = {
  gender: string;
  dob: string; // Will be ISO string
  joiningDate: string; // Will be ISO string
  leaveSchemeId?: number;
  weekoff: string;
};

type LeaveScheme = {
  id: number;
  name: string;
  // Add other properties as needed
};

const Dashboard = () => {
  const defaultUser: User = {
    profileImg: {
      id: undefined,
      url: null,
    },
    id: 0,
    name: null,
    username: "",
    status: null,
    isActive: false,
    lastSeen: null,
    contact: "",
  };

  const [userData, setUserData] = useState<User>(defaultUser);
  const [showModal, setShowModal] = useState(false);
  const [leaveSchemes, setLeaveSchemes] = useState<LeaveScheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUserDetails>({
    gender: "",
    dob: "",
    joiningDate: "",
    leaveSchemeId: undefined,
    weekoff: "",
  });
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [joiningDateValue, setJoiningDateValue] = useState<Date | null>(null);

  const userId = useAppSelector(s => s.auth.userData?.user.id);
  console.log(useAppSelector(s => s.auth.userData));

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const weekDays = [
    "MONDAY",
    "TUESDAY", 
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  ];

  useEffect(() => {
    try {
      if (!userId) return;

      userApi
        .getUserById(userId)
        .then((res) => setUserData(res.data))
        .catch((err) => console.error(err));
    } catch (err) {
      console.error("Failed to decode user from localStorage", err);
    }
  }, [userId]);

  const fetchLeaveSchemes = async () => {
    try {
      const response = await leaveSchemeService.getLeaveSchemes();
      setLeaveSchemes(response.data);
    } catch (error) {
      console.error("Failed to fetch leave schemes:", error);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
    fetchLeaveSchemes();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      gender: "",
      dob: "",
      joiningDate: "",
      leaveSchemeId: undefined,
      weekoff: "",
    });
    setDobDate(null);
    setJoiningDateValue(null);
  };

  const handleInputChange = (field: keyof CreateUserDetails, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: 'dob' | 'joiningDate', date: Date | null) => {
    if (field === 'dob') {
      setDobDate(date);
      setFormData(prev => ({
        ...prev,
        // Convert to ISO string for backend compatibility
        dob: date ? date.toISOString() : ""
      }));
    } else {
      setJoiningDateValue(date);
      setFormData(prev => ({
        ...prev,
        // Convert to ISO string for backend compatibility
        joiningDate: date ? date.toISOString() : ""
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare data for submission - ensure proper format
      const submitData: CreateUserDetails = {
        gender: formData.gender,
        dob: formData.dob,
        joiningDate: formData.joiningDate,
        weekoff: formData.weekoff,
        // Only include leaveSchemeId if it's actually selected
        ...(formData.leaveSchemeId && { leaveSchemeId: Number(formData.leaveSchemeId) })
      };

      console.log("Submitting user details:", submitData);

      await userApi.createUserDetails(submitData);
      
      alert("User details created successfully!");
      handleCloseModal();
    } catch (error) {
      console.error("Failed to create user details:", error);
      alert("Failed to create user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPEG and PNG files are allowed");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUserData((prev) => ({
      ...prev,
      profileImg: {
        ...prev.profileImg,
        url: objectUrl,
      },
    }));
  };

  return (
    <>
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h3 className="mb-0">
              <FaUser className="me-2" />
              User Profile
            </h3>
            <button 
              className="btn btn-light btn-sm"
              onClick={handleShowModal}
            >
              <FaPlus className="me-2" />
              Add Details
            </button>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Left side - User details */}
              <div className="col-12 col-md-6">
                <dl className="mb-0">
                  <dt>Name</dt>
                  <dd>{userData.name}</dd>
                  <dt>Email</dt>
                  <dd>{userData.username}</dd>
                  <dt>Contact</dt>
                  <dd>+91 {userData.contact.slice(-10)}</dd>
                </dl>
              </div>

              {/* Right side - Profile picture */}
              <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                <div className="position-relative mb-3">
                  {/* Profile image with fallback to default avatar */}
                  {userData.profileImg?.url ? (
                    <img
                      src={userData.profileImg.url}
                      alt="Profile"
                      className="rounded-circle border"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="rounded-circle border bg-light d-flex align-items-center justify-content-center"
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="80"
                        height="80"
                        fill="#999"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                      </svg>
                    </div>
                  )}

                  {/* Edit button (always visible) */}
                  <button
                    className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-2"
                    onClick={() =>
                      document.getElementById("profileUpload")?.click()
                    }
                    style={{
                      transform: "translate(25%, 25%)",
                      zIndex: 1,
                    }}
                  >
                    <i className="bi bi-pencil-fill"></i>
                  </button>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    id="profileUpload"
                    accept="image/*"
                    className="d-none"
                    onChange={handleProfileChange}
                  />
                </div>
                <small className="text-muted">
                  Click to upload profile photo
                </small>
              </div>
            </div>
          </div>
          <div className="card-footer bg-light">
            <Link to={`/hrm/users/${userId}`} className="btn btn-outline-primary">
              <FaInfoCircle className="me-2" />
              View Full Details
            </Link>
          </div>
        </div>
      </div>

      {/* Modal for adding user details */}
      {showModal && (
        <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add User Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    {/* Gender */}
                    <div className="col-md-6">
                      <label htmlFor="gender" className="form-label">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        id="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        required
                      >
                        <option value="">Select Gender</option>
                        {genderOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Week Off */}
                    <div className="col-md-6">
                      <label htmlFor="weekoff" className="form-label">
                        Week Off <span className="text-danger">*</span>
                      </label>
                      <select
                        id="weekoff"
                        className="form-select"
                        value={formData.weekoff}
                        onChange={(e) => handleInputChange('weekoff', e.target.value)}
                        required
                      >
                        <option value="">Select Week Off</option>
                        {weekDays.map(day => (
                          <option key={day} value={day}>
                            {day.charAt(0) + day.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-md-6">
                      <label htmlFor="dob" className="form-label">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        id="dob"
                        selected={dobDate}
                        onChange={(date) => handleDateChange('dob', date)}
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

                    {/* Joining Date */}
                    <div className="col-md-6">
                      <label htmlFor="joiningDate" className="form-label">
                        Joining Date <span className="text-danger">*</span>
                      </label>
                      <DatePicker
                        id="joiningDate"
                        selected={joiningDateValue}
                        onChange={(date) => handleDateChange('joiningDate', date)}
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

                    {/* Leave Scheme */}
                    <div className="col-12">
                      <label htmlFor="leaveScheme" className="form-label">
                        Leave Scheme
                      </label>
                      <select
                        id="leaveScheme"
                        className="form-select"
                        value={formData.leaveSchemeId || ''}
                        onChange={(e) => handleInputChange('leaveSchemeId', parseInt(e.target.value))}
                      >
                        <option value="">Select Leave Scheme (Optional)</option>
                        {leaveSchemes.map(scheme => (
                          <option key={scheme.id} value={scheme.id}>
                            {scheme.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      'Create Details'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;