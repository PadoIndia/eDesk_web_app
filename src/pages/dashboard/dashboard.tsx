// pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { FaUser, FaInfoCircle } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import userApi from "../../services/api-services/user.service";
import { useAppSelector } from "../../store/store";

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

  const userId = useAppSelector(s => s.auth.userData?.user.id);
  console.log(useAppSelector(s => s.auth.userData));

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
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">
            <FaUser className="me-2" />
            User Profile
          </h3>
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
  );
};

export default Dashboard;