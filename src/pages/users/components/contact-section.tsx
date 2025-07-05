import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { ContactResponse, CreateContact } from "../../../types/user.types";
import {
  FaPlus,
  FaTimes,
  FaSave,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaUser,
} from "react-icons/fa";
import { MdContactPhone } from "react-icons/md";
import { validateEmail, validatePhone } from "../../../utils/helper.tsx";
import { AiOutlineDelete } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import userService from "../../../services/api-services/user.service.ts";

interface Props {
  userId: number;
}

const ContactsSection: React.FC<Props> = ({ userId }) => {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newContact, setNewContact] = useState<CreateContact>({
    relation: "SELF",
    name: "",
    value: "",
    contactType: "PHONE",
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await userService.getUserContacts(Number(userId));
        setContacts(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
    fetchContacts();
  }, [userId]);

  const createNewContact = async (contactData: typeof newContact) => {
    try {
      const response = await userService.createUserContact(userId, contactData);
      return response.data;
    } catch (error) {
      console.error("Error creating contact:", error);
      throw error;
    }
  };

  const updateContact = async (
    contactId: number,
    contactData: typeof newContact
  ) => {
    try {
      const response = await userService.updateUserContact(
        userId,
        contactId,
        contactData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating contact:", error);
      throw error;
    }
  };

  const handleAddContact = async () => {
    try {
      if (!newContact.name?.trim() || !newContact.value?.trim()) {
        toast.error("Please fill all contact fields");
        return;
      }

      if (
        (newContact.contactType === "EMAIL" &&
          !validateEmail(newContact.value)) ||
        ((newContact.contactType === "PHONE" ||
          newContact.contactType === "WHATSAPP") &&
          !validatePhone(newContact.value))
      ) {
        toast.error("Please enter a valid contact value");
        return;
      }

      if (editingId) {
        // Update existing contact
        const updatedContact = await updateContact(editingId, newContact);
        if ("id" in updatedContact) {
          setContacts(
            contacts.map((contact) =>
              contact.id === editingId
                ? ({
                    ...updatedContact,
                    id: editingId,
                  } as ContactResponse)
                : contact
            )
          );
          toast.success("Contact updated successfully");
        }
      } else {
        // Create new contact
        const createdContact = await createNewContact(newContact);
        if ("id" in createdContact) {
          setContacts([...contacts, createdContact as ContactResponse]);
          toast.success("Contact added successfully");
        }
      }

      setIsAdding(false);
      setEditingId(null);
      setNewContact({
        relation: "SELF",
        name: "",
        value: "",
        contactType: "PHONE",
      });
    } catch (error) {
      console.error("Error saving contact:", error);
      toast.error("Failed to save contact. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewContact({
      relation: "SELF",
      name: "",
      value: "",
      contactType: "PHONE",
    });
  };

  const getRelationBadgeClass = (relation: string) => {
    switch (relation) {
      case "SELF":
        return "bg-primary bg-opacity-10 text-primary";
      case "FATHER":
        return "bg-warning bg-opacity-10 text-warning-dark";
      default:
        return "bg-secondary bg-opacity-10 text-secondary";
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "EMAIL":
        return <FaEnvelope className="text-danger" />;
      case "WHATSAPP":
        return <FaWhatsapp className="text-success" />;
      case "PHONE":
        return <FaPhone className="text-primary" />;
      default:
        return <MdContactPhone className="text-secondary" />;
    }
  };

  return (
    <div className="card" style={{ border: "1px solid #f3f3f3" }}>
      <div className="card-header bg-white border-bottom-0 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 d-flex align-items-center">
            <span
              className=""
              style={{
                width: "4px",
                height: "24px",
                marginRight: "12px",
                borderRadius: "2px",
                backgroundColor: "#7c66ec",
              }}
            ></span>
            Contact Information
          </h5>
          {!isAdding && !editingId && (
            <button
              className="btn btn-primary btn-sm d-flex align-items-center gap-2"
              onClick={() => setIsAdding(true)}
            >
              <FaPlus /> Add Contact
            </button>
          )}
        </div>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-light border-bottom p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-secondary">
              {editingId ? "Edit Contact" : "New Contact"}
            </h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                onClick={handleAddContact}
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
                Relation
              </label>
              <select
                className="form-select"
                value={newContact.relation}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    relation: e.target.value,
                  })
                }
              >
                <option value="SELF">Self</option>
                <option value="FATHER">Father</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Contact Type
              </label>
              <select
                className="form-select"
                value={newContact.contactType}
                onChange={(e) =>
                  setNewContact({
                    ...newContact,
                    contactType: e.target.value as
                      | "EMAIL"
                      | "WHATSAPP"
                      | "PHONE"
                      | "OTHER",
                  })
                }
              >
                <option value="PHONE">Phone</option>
                <option value="EMAIL">Email</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Label
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="E.g., Work Phone, Personal Email"
                value={newContact.name}
                onChange={(e) =>
                  setNewContact({ ...newContact, name: e.target.value })
                }
              />
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Contact Value
              </label>
              <input
                type={newContact.contactType === "EMAIL" ? "email" : "text"}
                className="form-control"
                placeholder={
                  newContact.contactType === "EMAIL"
                    ? "email@example.com"
                    : "+91 9999999999"
                }
                value={newContact.value}
                onChange={(e) =>
                  setNewContact({ ...newContact, value: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      )}

      <div className="card-body p-4">
        {contacts.length === 0 ? (
          <div className="text-center py-5">
            <FaUser
              className="text-muted mb-3"
              style={{ fontSize: "48px", opacity: 0.3 }}
            />
            <p className="text-muted mb-3">No contacts added yet</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsAdding(true)}
            >
              Add First Contact
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 position-relative overflow-hidden hover-shadow-sm"
                  style={{
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    border: "1px solid #f3f3f3",
                  }}
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div
                        className="d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm"
                        style={{ width: "40px", height: "40px" }}
                      >
                        {getContactIcon(contact.contactType)}
                      </div>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-body border-0 p-1 hover-shadow-sm rounded-full"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => {
                            setEditingId(contact.id);
                            setNewContact({
                              contactType: contact.contactType,
                              name: contact.name,
                              relation: contact.relation,
                              value: contact.value,
                            });
                          }}
                        >
                          <CiEdit size={18} className="text-primary" />
                        </button>
                        <div
                          className="btn btn-sm btn-body border-0 p-1  rounded-full"
                          style={{
                            width: "32px",
                            height: "32px",
                            cursor: "not-allowed",
                          }}
                        >
                          <AiOutlineDelete size={18} className="text-danger" />
                        </div>
                      </div>
                    </div>
                    <h6 className="card-title mb-2">{contact.name}</h6>
                    <span
                      className={`badge ${getRelationBadgeClass(
                        contact.relation
                      )} mb-3`}
                    >
                      {contact.relation}
                    </span>
                    <p className="mb-1 fw-medium text-secondary">
                      {contact.value}
                    </p>
                    <small
                      className="text-muted text-uppercase"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      {contact.contactType}
                    </small>
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

export default ContactsSection;
