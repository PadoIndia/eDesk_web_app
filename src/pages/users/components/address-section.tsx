import React, { useEffect, useState } from "react";
import { Address } from "../../../types/user.types";
import {
  FaPlus,
  FaTimes,
  FaSave,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaHome,
  FaBriefcase,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { toast } from "react-toastify";
import userService from "../../../services/api-services/user.service.ts";

interface Props {
  userId: number;
}

const AddressesSection: React.FC<Props> = ({ userId }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, "id">>({
    addressType: "CURRENT",
    address: "",
    landmark: undefined,
    pincode: "",
    state: "",
    city: "",
    isPrimary: false,
    isActive: true,
  });

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await userService.getUserAddresses(Number(userId));
        if (response.status === "success")
          setAddresses(
            Array.isArray(response.data) ? response.data : [response.data]
          );
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
    fetchAddress();
  }, [userId]);

  const handleAddAddress = async () => {
    try {
      if (
        !newAddress.address?.trim() ||
        !newAddress.pincode?.trim() ||
        !newAddress.city?.trim()
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      const response = editingId
        ? await userService.updateUserAddress(userId, editingId, newAddress)
        : await userService.createUserAddress(userId, newAddress);
      if (response.status === "success") {
        toast.success(response.message);
        if (editingId)
          setAddresses(
            addresses.map((addr) =>
              addr.id === editingId ? { ...response.data, id: editingId } : addr
            )
          );
        else setAddresses([...addresses, response.data]);
        setIsAdding(false);
        setEditingId(null);
        setNewAddress({
          addressType: "CURRENT",
          address: "",
          landmark: undefined,
          pincode: "",
          state: "",
          city: "",
          isPrimary: false,
          isActive: true,
        });
      } else toast.error(response.message);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewAddress({
      addressType: "CURRENT",
      address: "",
      landmark: undefined,
      pincode: "",
      state: "",
      city: "",
      isPrimary: false,
      isActive: true,
    });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setIsAdding(true);
    setNewAddress({
      addressType: address.addressType,
      address: address.address,
      landmark: address.landmark,
      pincode: address.pincode,
      state: address.state,
      city: address.city,
      isPrimary: address.isPrimary,
      isActive: address.isActive,
    });
  };

  const getAddressIcon = (type: string) => {
    return type === "PERMANENT" ? (
      <FaHome className="text-primary" style={{ fontSize: "22px" }} />
    ) : (
      <FaBriefcase className="text-secondary" style={{ fontSize: "22px" }} />
    );
  };

  const getAddressTypeLabel = (type: string) => {
    return type === "PERMANENT" ? "Permanent Address" : "Current Address";
  };

  return (
    <div className="card" style={{ border: "1px solid #f1f1f1" }}>
      {/* Header */}
      <div className="card-header bg-white border-bottom-0 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 d-flex align-items-center">
            <span
              style={{
                width: "4px",
                height: "24px",
                marginRight: "12px",
                borderRadius: "2px",
                backgroundColor: "#7c66ec",
              }}
            ></span>
            Address Information
          </h5>
          {!isAdding && (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setIsAdding(true)}
            >
              <FaPlus /> Add Address
            </button>
          )}
        </div>
      </div>

      {/* Add New Address Form */}
      {isAdding && (
        <div className="bg-light border-bottom p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-secondary">
              {editingId ? "Edit Address" : "New Address"}
            </h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={handleAddAddress}
              >
                <FaSave /> {editingId ? "Update" : "Save"}
              </button>
              <button
                className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                onClick={handleCancel}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Address Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={newAddress.addressType}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    addressType: e.target.value as "PERMANENT" | "CURRENT",
                  })
                }
              >
                <option value="CURRENT">Current</option>
                <option value="PERMANENT">Permanent</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                City <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter city"
                value={newAddress.city}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, city: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                State <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter state"
                value={newAddress.state}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, state: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Pincode <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter pincode"
                maxLength={6}
                value={newAddress.pincode}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    pincode: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Address <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Enter complete address"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    address: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-12">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Landmark
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Near landmark (optional)"
                value={newAddress.landmark ?? ""}
                onChange={(e) =>
                  setNewAddress({
                    ...newAddress,
                    landmark: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-12">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isPrimary"
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  checked={newAddress.isPrimary}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isPrimary: e.target.checked,
                    })
                  }
                />
                <label
                  className="form-check-label ms-2"
                  htmlFor="isPrimary"
                  style={{ cursor: "pointer" }}
                >
                  Set as Primary Address
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="card-body p-4">
        {addresses.length === 0 ? (
          <div className="text-center py-5">
            <MdLocationCity
              className="text-muted mb-3"
              style={{ fontSize: "48px", opacity: 0.3 }}
            />
            <p className="text-muted mb-3">No addresses added yet</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsAdding(true)}
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {addresses.map((address) => (
              <div key={address.id} className="col-12 col-lg-6">
                <div
                  className="card h-100 position-relative overflow-hidden hover-shadow-sm"
                  style={{
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    border: "1px solid #f1f1f1",
                  }}
                  onMouseEnter={(e) => {
                    const actions = e.currentTarget.querySelector(
                      ".address-actions"
                    ) as HTMLElement;
                    if (actions) actions.style.opacity = "1";
                    const accent = e.currentTarget.querySelector(
                      ".accent-bar"
                    ) as HTMLElement;
                    if (accent) accent.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const actions = e.currentTarget.querySelector(
                      ".address-actions"
                    ) as HTMLElement;
                    if (actions) actions.style.opacity = "0";
                    const accent = e.currentTarget.querySelector(
                      ".accent-bar"
                    ) as HTMLElement;
                    if (accent) accent.style.opacity = "0";
                  }}
                >
                  <div
                    className="position-absolute top-0 start-0 h-100 bg-primary-subtle accent-bar"
                    style={{
                      width: "4px",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                  ></div>

                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm"
                        style={{ width: "48px", height: "48px" }}
                      >
                        {getAddressIcon(address.addressType)}
                      </div>
                      <div
                        className="d-flex gap-1 address-actions"
                        style={{ opacity: 0, transition: "opacity 0.2s" }}
                      >
                        {!address.isPrimary && (
                          <button
                            className="btn btn-sm btn-light p-1"
                            style={{ width: "32px", height: "32px" }}
                            onClick={() =>
                              toast.info(
                                "Set as primary functionality to be implemented"
                              )
                            }
                            title="Set as primary"
                          >
                            <FaRegStar className="text-primary" />
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-light p-1"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => handleEdit(address)}
                        >
                          <FaEdit className="text-primary" />
                        </button>
                        <button
                          disabled
                          className="btn btn-sm btn-light p-1"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() =>
                            toast.info("Delete functionality to be implemented")
                          }
                        >
                          <FaTrash className="text-danger" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h6 className="mb-0">
                          {getAddressTypeLabel(address.addressType)}
                        </h6>
                        {address.isPrimary && (
                          <span className="badge bg-primary-subtle text-primary d-flex align-items-center gap-1">
                            <FaStar style={{ fontSize: "10px" }} /> Primary
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-secondary">
                      <p className="mb-2 d-flex align-items-start gap-2">
                        <FaMapMarkerAlt
                          className="text-muted mt-1"
                          style={{ flexShrink: 0 }}
                        />
                        <span>{address.address}</span>
                      </p>
                      {address.landmark && (
                        <p className="mb-2 ms-4 fst-italic small text-muted">
                          Near: {address.landmark}
                        </p>
                      )}
                      <p className="mb-3 ms-4 fw-medium text-dark">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>

                    <div>
                      <span
                        className={`badge ${
                          address.isActive
                            ? "bg-success bg-opacity-10 text-success"
                            : "bg-danger bg-opacity-10 text-danger"
                        }`}
                      >
                        {address.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressesSection;
