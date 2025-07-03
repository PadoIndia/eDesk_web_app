import { Link } from "react-router-dom";
import { FaUser, FaInfoCircle } from "react-icons/fa";
import { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import userService from "../../services/api-services/user.service";
import { toast } from "react-toastify";
import generalService from "../../services/api-services/general.service";
import { generateSHA256 } from "../../utils/helper";
import Avatar from "../../components/avatar";
import uploadService from "../../services/api-services/upload-service";

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
  const [userData, setUserData] = useState<User>({
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
  });
  const [loading, setLoading] = useState(false);

  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  console.log(useAppSelector((s) => s.auth.userData));

  useEffect(() => {
    try {
      if (!userId) return;

      userService
        .getUserById(userId)
        .then((res) => setUserData(res.data))
        .catch((err) => console.error(err));
    } catch (err) {
      console.error("Failed to decode user from localStorage", err);
    }
  }, [userId]);

  const handleProfileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Only JPEG and PNG files are allowed");
      return;
    }
    setLoading(true);
    try {
      const hash = await generateSHA256(file);
      const isExists = await uploadService.checkHash({
        hash,
        type: "IMAGE",
        mimeType: file.type,
      });
      if (isExists && isExists.data) {
        if (isExists.status === "success") {
          await userService
            .updateSelf({ profileImgId: Number(isExists.data.id) })
            .then((res) => {
              if (res.status === "success") {
                toast.success(res.message);
              }
            });
          setUserData((prev) => ({
            ...prev,
            profileImg: {
              ...prev.profileImg,
              url: isExists.data.url,
            },
          }));
        } else toast.error(isExists.message);
      } else {
        const resp = await generalService.uploadToS3([{ image: file, hash }]);
        if (resp.status === "success") {
          const data = resp.data[0];
          await userService
            .updateSelf({ profileImgId: Number(data.id) })
            .then((res) => {
              if (res.status === "success") {
                toast.success(res.message);
              }
            });
          setUserData((prev) => ({
            ...prev,
            profileImg: {
              ...prev.profileImg,
              url: data.url,
            },
          }));
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
                <Avatar
                  title={userData.name || ""}
                  imageUrl={userData.profileImg?.url}
                  size={100}
                  fontSize={35}
                />
                {loading && (
                  <div className="position-absolute bottom-0 top-0 start-0 end-0 d-flex justify-content-center align-items-center">
                    <div
                      className="spinner-border text-primary "
                      role="status"
                    />
                  </div>
                )}
                {/* Edit button (always visible) */}
                <button
                  className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle p-2"
                  onClick={() =>
                    document.getElementById("profileUpload")?.click()
                  }
                  style={{
                    width: 35,
                    height: 35,
                    transform: "translate(25%, 25%)",
                    zIndex: 1,
                  }}
                >
                  <div>
                    <i className="bi bi-pencil-fill"></i>
                  </div>
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
