// components/AddressesSection.tsx
import userApi from "../../../services/api-services/user.service.ts";
import React, { useEffect, useState } from "react";
import { Address } from "../../../types/user.types";
import { FaPlus, FaTimes, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";

interface AddressesSectionProps {
  userId: number;
}

export const AddressesSection: React.FC<AddressesSectionProps> = ({userId}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAdding, setIsAdding] = useState(false);
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

  useEffect(()=>{
    const fetchAddress = async()=>{
      try {
        const response = await userApi.getUserAddressById(Number(userId));        
        setAddresses(
          Array.isArray(response.data)? response.data : [response.data]
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    }
    fetchAddress();

  },[userId]);


  const createNewAddress = async(addressData: typeof newAddress)=>{
    try {
     const response = await userApi.createUserAddress(addressData);
     
     return response.data;
    } catch (error) {
    console.error("Error creating new address", error);
    throw error;
    }
  }

  const handleAddAddress = async () => {
    try {
      
      if (!newAddress.address || !newAddress.pincode || !newAddress.city) {
        alert("Please fill required fields");
        return;
      }
  
      const createdAddress = await createNewAddress(newAddress);
      

      if('id' in createdAddress){
        setAddresses([...addresses, createdAddress]);
      }
      // setAddresses([...addresses, { ...newAddress, id: addresses.length + 1 }]);
      setIsAdding(false);
      setNewAddress({
        addressType: "PERMANENT",
        address: "",
        landmark: undefined,
        pincode: "",
        state: "",
        city: "",
        isPrimary: false,
        isActive: true,
      });
    } catch (error) {
    console.error("Error saving address:", error);
    toast.error("Failed to save address. Please try again.");
    }

  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Addresses</h3>
        <button
          className="btn btn-light"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? <FaTimes /> : <FaPlus />} Add Address
        </button>
      </div>

      <div className="card-body">
        {isAdding && (
          <div className="card mb-3 border-primary">
            <div className="card-body">
              {/* Add Address Form */}
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Address Type</label>
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
                    <option value="PERMANENT">Permanent</option>
                    <option value="CURRENT">Current</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, city: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.state}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, state: e.target.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.pincode}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        pincode: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={newAddress.address}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        address: e.target.value,
                      })
                    }
                  ></textarea>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Landmark</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newAddress.landmark ?? ''}
                    onChange={(e) =>
                      setNewAddress({
                        ...newAddress,
                        landmark: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isPrimary"
                      checked={newAddress.isPrimary}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isPrimary: e.target.checked,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="isPrimary">
                      Set as Primary Address
                    </label>
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isActive"
                      checked={newAddress.isActive}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isActive: e.target.checked,
                        })
                      }
                    />
                    <label className="form-check-label" htmlFor="isActive">
                      Active Address
                    </label>
                  </div>
                </div> */}
              </div>
              <div className="mt-3">
                <button className="btn btn-success" onClick={handleAddAddress}>
                  <FaSave /> Save Address
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="row g-3">
          {addresses.map((address) => (
            <div key={address.id} className="col-12">
              <div
                className={`card h-100 ${
                  address.isPrimary ? "border-primary" : ""
                }`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h5>{address.addressType} Address</h5>
                      <p>{address.address}</p>
                      <p>
                        {address.city}, {address.state} {address.pincode}
                      </p>
                    </div>
                    {/* <div>
                      {!address.isPrimary && (
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() =>
                            setAddresses(
                              addresses.map((a) =>
                                a.id === address.id
                                  ? { ...a, isPrimary: true }
                                  : { ...a, isPrimary: false }
                              )
                            )
                          }
                        >
                          <FaStar /> Set Primary
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          setAddresses(
                            addresses.filter((a) => a.id !== address.id)
                          )
                        }
                      >
                        <FaTrash />
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
