import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userApi from "../../services/api-services/user.service";
import { UpdateUser, User, UserDataDetails } from "../../types/user.types";
import {ProfileSection} from "./components/profile-section";
import { ContactsSection } from "./components/contact-section";
import { AddressesSection } from "./components/address-section";
import { DocumentsSection } from "./components/document-section";



const UserDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<User>({} as User);
  const [userDetails, setUserDetails] = useState<UserDataDetails>(
    {} as UserDataDetails
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    username: "",
    contact: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;

        const [userResponse, detailsResponse] = await Promise.all([
          userApi.getUserById(Number(userId)),
          userApi.getUserDetailsById(Number(userId)),
        ]);

        setUserData(userResponse.data);
        setUserDetails(detailsResponse.data);
        initializeDraft(userResponse.data);
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchUserData();
  }, [userId]);

  const initializeDraft = (user: User) => {
    setDraft({
      name: user.name || "",
      username: user.username || "",
      contact: user.contact || "",
    });
  };

const handleFetchError = (error: unknown) => {
    console.error("Error fetching user data:", error);
    toast.error("Failed to load user data");
  };

  const handleSave = async () => {
  if (!validateForm()) return;

  const updatedUser: UpdateUser = {
    ...draft, // override name, username, contact
  };

  try {
    const response = await userApi.updateUser(userData.id, updatedUser);
    
    if (response.status === "success") {
      setUserData(prev => ({
        ...prev,
        ...updatedUser
      }));
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




  const validateForm = () => {
    const isValid =
      draft.name?.trim() &&
      /^\S+@\S+\.\S+$/.test(draft.username) &&
      /^\+?\d{10,15}$/.test(draft.contact);

    if (!isValid) toast.error("Please enter valid Name, Email, and Contact");
    return isValid;
  };

  const handleCancel = () => {
    initializeDraft(userData);
    setIsEditing(false);
  };

  return (
    <div className="container py-10 p-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <ProfileSection
        userData={userData}
        userDetails={userDetails}
        isEditing={isEditing}
        draft={draft}
        onEditToggle={() => setIsEditing(!isEditing)}
        onDraftChange={setDraft}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      <ContactsSection userId={Number(userId)} />

      <AddressesSection userId={Number(userId)} />

      <DocumentsSection />
    </div>
  );
};

export default UserDetails;
