import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaSave, FaTimes } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEditForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "Saksham Jain",
    email: "1@gmail.com",
    contact: "+91 9999999999",
    profileImg: null as string | null,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", contact: "" };

    if (!user.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!/^\S+@\S+\.\S+$/.test(user.email)) {
      newErrors.email = "Invalid email address";
      isValid = false;
    }

    if (!/^\+?\d{10,15}$/.test(user.contact)) {
      newErrors.contact = "Invalid phone number";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      toast.error("Please fix the errors before submitting");
    }
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate API submit
      try {
        console.log("Form data:", { ...user, profileImg: previewImage });
        toast.success("User details updated successfully");
        // Navigate after a short delay so toast is visible
        setTimeout(() => navigate(`/users/${userId}`), 1500);
      } catch {
        toast.error("Failed to update user details");
      }
    }
  };

  return (
    <div className="container py-10 p-5">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="card shadow">
        <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Edit User Details</h3>
          <button
            className="btn btn-light"
            onClick={() => navigate(`/users/${userId}`)}
          >
            <FaTimes /> Close
          </button>
        </div>

        <div className="card-body p-5">
          <form onSubmit={handleSubmit} noValidate>
            <div className="row align-items-center">
              {/* Profile Image Section */}
              <div className="col-12 col-md-4 mb-4 mb-md-0 text-center">
                <div className="mb-3">
                  <img
                    src={
                      previewImage || user.profileImg || "/default-profile.png"
                    }
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      document.getElementById("profileInput")?.click()
                    }
                  />
                  <input
                    type="file"
                    id="profileInput"
                    accept="image/*"
                    className="d-none"
                    onChange={handleFileChange}
                  />
                  <div className="text-muted small">
                    Click image to upload new profile photo
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="col-12 col-md-8">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name && "is-invalid"}`}
                      value={user.name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email && "is-invalid"}`}
                      value={user.email}
                      onChange={(e) =>
                        setUser({ ...user, email: e.target.value })
                      }
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className={`form-control ${
                        errors.contact && "is-invalid"
                      }`}
                      value={user.contact}
                      onChange={(e) =>
                        setUser({ ...user, contact: e.target.value })
                      }
                    />
                    {errors.contact && (
                      <div className="invalid-feedback">{errors.contact}</div>
                    )}
                  </div>

                  <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary me-2">
                      <FaSave /> Save Changes
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => navigate(`/users/${userId}`)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditForm;
