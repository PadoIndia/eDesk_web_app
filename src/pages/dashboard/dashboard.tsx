import { useEffect, useState, ChangeEvent, lazy } from "react";
import { toast } from "react-toastify";
import { FaRegEdit, FaRegSave, FaTimes } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { BiSolidPhone } from "react-icons/bi";
import {
  AdminUser,
  UpdateSelfPayload,
  UserDetails,
} from "../../types/user.types";
import userService from "../../services/api-services/user.service";
import generalService from "../../services/api-services/general.service";
import { generateSHA256 } from "../../utils/helper";
import uploadService from "../../services/api-services/upload-service";
import Avatar from "../../components/avatar";
import styles from "./styles.module.scss";
import { useAppSelector } from "../../store/store";
import { PiPencil } from "react-icons/pi";

const DocumentsSection = lazy(
  () => import("../users/components/document-section")
);
const AddressesSection = lazy(
  () => import("../users/components/address-section")
);
const ContactsSection = lazy(
  () => import("../users/components/contact-section")
);

const UserProfile = () => {
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const [userData, setUserData] = useState<AdminUser>({} as AdminUser);
  const [userDetails, setUserDetails] = useState<UserDetails>(
    {} as UserDetails
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UpdateSelfPayload>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;
        const resp = await userService.getUserById(Number(userId));
        if (resp.status === "success") {
          const { userDetails } = resp.data;
          setUserData(resp.data);
          if (userDetails) setUserDetails(userDetails);
          initializeDraft(resp.data);
        } else {
          toast.error(resp.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [userId]);

  const initializeDraft = (user: AdminUser) => {
    setDraft({
      name: user.name || "",
    });
  };

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

      if (isExists && isExists.data && isExists.status === "success") {
        await userService.updateSelf({
          profileImgId: Number(isExists.data.id),
        });
        setUserData((prev) => ({
          ...prev,
          profileImg: { ...prev.profileImg, url: isExists.data.url },
        }));
        toast.success("Profile picture updated");
      } else {
        const resp = await generalService.uploadToS3([{ image: file, hash }]);
        if (resp.status === "success") {
          const data = resp.data[0];
          await userService.updateSelf({ profileImgId: Number(data.id) });
          setUserData((prev) => ({
            ...prev,
            profileImg: { ...prev.profileImg, url: data.url },
          }));
          toast.success("Profile picture updated");
        }
      }
    } catch {
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateSelf(draft);
      if (response.status === "success") {
        setUserData((prev) => ({ ...prev, ...draft }));
        setIsEditing(false);
        toast.success("Changes saved successfully");
      } else {
        toast.error(response?.message || "Failed to save changes");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("An error occurred while saving changes");
    }
  };

  const handleCancel = () => {
    initializeDraft(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UpdateSelfPayload, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: "basic", label: "Basic" },
    { id: "contacts", label: "Contacts" },
    { id: "addresses", label: "Addresses" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className={styles.container + " m-3 mt-2 rounded-md bg-white"}>
      <div className={styles.header + " bg-primary-subtle"}>
        <div className={styles.userInfo}>
          <div
            className={styles.avatarWrapper}
            onClick={() => document.getElementById("profileUpload")?.click()}
          >
            <Avatar
              title={userData.name || ""}
              imageUrl={userData.profileImg?.url}
              size={90}
              fontSize={28}
            />
            {loading && (
              <div className={styles.avatarLoading}>
                <div className="spinner-border spinner-border-sm text-white" />
              </div>
            )}
            <div className={styles.avatarEdit}>
              <FaRegEdit />
            </div>
          </div>

          <div className={styles.userDetails}>
            <h2 className={styles.userName}>{userData.name || "User Name"}</h2>
            <div className={styles.contactInfo}>
              <span className={styles.email}>
                <IoMdMail /> {userData.username || "email@example.com"}
              </span>
              <span className={styles.phone}>
                <BiSolidPhone /> {userData.contact || "+91 0000000000"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.headerActions}>
          {activeTab === "basic" && (
            <>
              {!isEditing ? (
                <button
                  className={styles.editBtn}
                  onClick={() => setIsEditing(true)}
                >
                  <PiPencil className="text-white" /> Edit Profile
                </button>
              ) : (
                <div className={styles.editActions}>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    <FaRegSave /> Save
                  </button>
                  <button className={styles.cancelBtn} onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`border-0 ${styles.tab} ${
                activeTab === tab.id ? styles.active : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "basic" && (
          <div className={styles.basicTab}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Personal Information</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={draft.name || ""}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={styles.formInput}
                    />
                  ) : (
                    <span className={styles.formValue}>
                      {userData.name || "-"}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Email</label>
                  <span className={styles.formValue}>
                    {userData.username || "-"}
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>Phone Number</label>

                  <span className={styles.formValue}>
                    {userData.contact || "-"}
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>Employee Code</label>
                  <span className={styles.formValue}>
                    {userData.empCode || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Employment Details</h3>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Joining Date</label>
                  <span className={styles.formValue}>
                    {userDetails?.joiningDate
                      ? new Date(userDetails.joiningDate).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <span className={styles.formValue}>
                    {userDetails?.dob
                      ? new Date(userDetails.dob).toLocaleDateString()
                      : "-"}
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>Gender</label>
                  <span className={styles.formValue}>
                    {userDetails?.gender || "-"}
                  </span>
                </div>

                <div className={styles.formGroup}>
                  <label>Week Off</label>
                  <span className={styles.formValue}>
                    {userDetails?.weekoff || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Departments & Teams</h3>
              <div className={styles.departmentSection}>
                <h4>Departments</h4>
                <div className={styles.badgeContainer}>
                  {userData.userDepartment?.length > 0 ? (
                    userData.userDepartment.map((dept, index) => (
                      <div key={index} className={styles.infoBadge}>
                        <span>{dept.department.name}</span>
                        {dept.isAdmin && (
                          <span className={styles.adminTag}>Admin</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className={styles.emptyText}>
                      No departments assigned
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.teamSection}>
                <h4>Teams</h4>
                <div className={styles.badgeContainer}>
                  {userData.userTeam?.length > 0 ? (
                    userData.userTeam.map((team, index) => (
                      <div key={index} className={styles.infoBadge}>
                        <span>{team.team.name}</span>
                        {team.isAdmin && (
                          <span className={styles.adminTag}>Lead</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className={styles.emptyText}>No teams assigned</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <ContactsSection userId={Number(userId)} />
        )}

        {activeTab === "addresses" && (
          <AddressesSection userId={Number(userId)} />
        )}

        {activeTab === "documents" && (
          <DocumentsSection userId={Number(userId)} />
        )}
      </div>

      <input
        type="file"
        id="profileUpload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleProfileChange}
      />
    </div>
  );
};

export default UserProfile;
