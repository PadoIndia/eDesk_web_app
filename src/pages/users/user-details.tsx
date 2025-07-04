import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AdminUser,
  UpdateSelfPayload,
  User,
  UserDetails,
} from "../../types/user.types";
import { ProfileSection } from "./components/profile-section";
import { ContactsSection } from "./components/contact-section";
import { AddressesSection } from "./components/address-section";
import { DocumentsSection } from "./components/document-section";
import userService from "../../services/api-services/user.service";

const UserFullDetails = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState<AdminUser>({} as AdminUser);
  const [userDetails, setUserDetails] = useState<UserDetails>(
    {} as UserDetails
  );
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<UpdateSelfPayload>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;
        const resp = await userService.getUserById(Number(userId));
        if (resp.status === "success") {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { userDetails } = resp.data;
          setUserData(resp.data);
          if (userDetails) setUserDetails(userDetails);
          initializeDraft(resp.data);
        } else toast.error(resp.message);
      } catch (error) {
        handleFetchError(error);
      }
    };

    fetchUserData();
  }, [userId]);

  const initializeDraft = (user: User) => {
    setDraft({
      name: user.name || "",
    });
  };

  const handleFetchError = (error: unknown) => {
    console.error("Error fetching user data:", error);
    toast.error("Failed to load user data");
  };

  const handleSave = async () => {
    try {
      const response = await userService.updateSelf(draft);

      if (response.status === "success") {
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

  return (
    <div className="container py-10 p-5">
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

      <DocumentsSection userId={Number(userId)} />
    </div>
  );
};

export default UserFullDetails;
