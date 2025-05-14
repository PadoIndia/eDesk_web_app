// components/ContactsSection.tsx
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import { Contact } from "../../types/user.types";
import { FaPlus, FaTimes, FaTrash, FaSave } from "react-icons/fa";
import {
  getContactTypeIcon,
  validateEmail,
  validatePhone,
} from "../../utils/helper.tsx";
import userApi from "../../services/api-services/user.service.ts";

interface ContactsSectionProps {
  userId: number;
}

export const ContactsSection: React.FC<ContactsSectionProps> = ({ userId }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    relation: "Self",
    name: "",
    value: "",
    contactType: "PHONE",
  });

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await userApi.getUserContactsById(Number(userId));
        
        setContacts(Array.isArray(response.data) ? response.data : [response.data])
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    };
    fetchContacts();
  },[userId]);

  const createNewContact = async()=>{
    try {
      const response = await userApi.createUserContact(newContact);
      console.log(response);
      
    } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
    }
  }

  const handleAddContact = () => {
    if (!newContact.name || !newContact.value) {
      alert("Please fill all fields");
      return;
    }

    if (
      (newContact.contactType === "EMAIL" &&
        !validateEmail(newContact.value)) ||
      ((newContact.contactType === "PHONE" ||
        newContact.contactType === "WHATSAPP") &&
        !validatePhone(newContact.value))
    ) {
      alert("Invalid contact value");
      return;
    }

    createNewContact();
    setContacts([...contacts, { ...newContact, id: contacts.length + 1 }]);
    setIsAdding(false);
    setNewContact({
      relation: "SELF",
      name: "",
      value: "",
      contactType: "PHONE",
    });
  };

  return (
    <div className="card shadow mb-4">
      <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Contacts</h3>
        <button
          className="btn btn-light"
          onClick={() => setIsAdding(!isAdding)}
        >
          {isAdding ? <FaTimes /> : <FaPlus />} Add Contact
        </button>
      </div>

      <div className="card-body">
        {isAdding && (
          <div className="card mb-3 border-primary">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Relation</label>
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
                <div className="col-md-6">
                  <label className="form-label">Contact Type</label>
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
                <div className="col-md-6">
                  <label className="form-label">Name</label>
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
                <div className="col-md-6">
                  <label className="form-label">Value</label>
                  <input
                    type={newContact.contactType === "EMAIL" ? "EMAIL" : "text"}
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
              <div className="mt-3">
                <button className="btn btn-success" onClick={handleAddContact}>
                  <FaSave /> Save Contact
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="row g-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      {getContactTypeIcon(contact.contactType)}
                      <div>
                        <h5 className="mb-0">{contact.name}</h5>
                        <small className="text-muted">{contact.relation}</small>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        setContacts(contacts.filter((c) => c.id !== contact.id))
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="mt-2 fw-bold">{contact.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
