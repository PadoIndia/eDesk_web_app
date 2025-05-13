// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaEdit, FaUser, FaCalendarAlt, FaPhone, FaTransgender, FaBusinessTime, FaSave, FaTimes } from "react-icons/fa";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UserDetails = () => {
//   const { userId } = useParams();
//   const [isEditing, setIsEditing] = useState(false);
//   const [user, setUser] = useState({
//     id: userId,
//     name: "Saksham Jain",
//     username: "1@gmail.com",
//     contact: "+91 9999999999",
//     // other fields unchanged
//     createdOn: "2023-01-15",
//     updatedOn: "2023-10-01",
//     status: "Active",
//     profileImg: null as string | null,
//     dob: "1990-05-15",
//     gender: "Male",
//     joiningDate: "2020-03-01",
//     weekoff: "Saturday, Sunday",
//     leaveScheme: "Annual Leave (20 days)",
//   });
//   const [draft, setDraft] = useState({ name: user.name, username: user.username, contact: user.contact });

//   const handleSave = () => {
//     // validate simple
//     if (!draft.name.trim() || !/^\S+@\S+\.\S+$/.test(draft.username) || !/^\+?\d{10,15}$/.test(draft.contact)) {
//       toast.error("Please enter valid Name, Email, and Contact");
//       return;
//     }     
//     setUser({ ...user, ...draft, updatedOn: new Date().toISOString().split('T')[0] });
//     setIsEditing(false);
//     toast.success("Changes saved successfully");
//   };

//   const handleCancel = () => {
//     setDraft({ name: user.name, username: user.username, contact: user.contact });
//     setIsEditing(false);
//   };

//   return (
//     <div className="container py-10 p-5">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <div className="card shadow">
//         <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
//           <h3 className="mb-0 d-flex align-items-center gap-3">
//             <FaUser className="me-2" />
//             User Details
//           </h3>
//         </div>

//         <div className="card-body p-5">
//           <div className="row align-items-center">
//             {/* Profile Image Section */}
//             <div className="col-12 col-md-4 mb-4 mb-md-0 text-center">
//               <div className="text-center">
//                 {user.profileImg ? (
//                   <img
//                     src={user.profileImg}
//                     alt="Profile"
//                     className="rounded-circle mb-3"
//                     style={{ width: "200px", height: "200px", objectFit: "cover" }}
//                   />
//                 ) : (
//                   <div
//                     className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
//                     style={{ width: "200px", height: "200px",  backgroundColor: '#FFF3DC', color: '#333',  fontSize: '3rem',
//                         fontWeight: 'bold' }}
//                   >
//                     <span className=" display-4">
//                       {user.name.split(" ").map((n) => n[0]).join("")}
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <h5 className="text-center">{user.name}</h5>

//               {/* Edit toggle button */}
//               <button
//                 className="btn btn-primary w-50 mt-2"
//                 onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
//                 disabled={isEditing}
//               >
//                 <FaEdit className="me-2" /> Edit Details
//               </button>
//             </div>

//             {/* User Details Section */}
//             <div className="col-12 col-md-8">
//               <div className="row g-3">
//                 {/* Editable fields */}
//                 <DetailItem
//                   icon={<FaUser />}
//                   label="Full Name"
//                   value={isEditing ? undefined : user.name}
//                   editValue={draft.name}
//                   onChange={(val) => setDraft({ ...draft, name: val })}
//                   isEditing={isEditing}
//                 />
//                 <DetailItem
//                   icon={<FaUser />}
//                   label="Email"
//                   value={isEditing ? undefined : user.username}
//                   editValue={draft.username}
//                   onChange={(val) => setDraft({ ...draft, username: val })}
//                   isEditing={isEditing}
//                 />
//                 <DetailItem
//                   icon={<FaPhone />}
//                   label="Contact"
//                   value={isEditing ? undefined : user.contact}
//                   editValue={draft.contact}
//                   onChange={(val) => setDraft({ ...draft, contact: val })}
//                   isEditing={isEditing}
//                 />
//                 {/* Read-only items */}
//                 <DetailItem
//                   icon={<FaCalendarAlt />}
//                   label="Date of Birth"
//                   value={new Date(user.dob).toLocaleDateString()}
//                 />
//                 <DetailItem
//                   icon={<FaTransgender />}
//                   label="Gender"
//                   value={user.gender}
//                 />
//                 <DetailItem
//                   icon={<FaBusinessTime />}
//                   label="Joining Date"
//                   value={new Date(user.joiningDate).toLocaleDateString()}
//                 />
//                 <DetailItem
//                   label="Status"
//                   value={user.status}
//                   badgeClass={user.status === "Active" ? "bg-success" : "bg-danger"}
//                 />
//                 <DetailItem
//                   label="Created On"
//                   value={new Date(user.createdOn).toLocaleDateString()}
//                 />
//                 <DetailItem
//                   label="Last Updated"
//                   value={new Date(user.updatedOn).toLocaleDateString()}
//                 />
//                 <DetailItem label="Weekly Off" value={user.weekoff} />
//                 <DetailItem label="Leave Scheme" value={user.leaveScheme} />
//               </div>

//               {/* Save/Cancel buttons */}
//               {isEditing && (
//                 <div className="mt-4">
//                   <button className="btn btn-success me-2" onClick={handleSave}>
//                     <FaSave /> Save Changes
//                   </button>
//                   <button className="btn btn-secondary" onClick={handleCancel}>
//                     <FaTimes /> Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// interface DetailItemProps {
//   icon?: React.ReactNode;
//   label: string;
//   value?: string;
//   editValue?: string;
//   onChange?: (val: string) => void;
//   isEditing?: boolean;
//   badgeClass?: string;
// }

// const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, editValue, onChange, isEditing, badgeClass }) => (
//   <div className="col-12 col-md-6 py-1 px-3">
//     <div className="d-flex align-items-center gap-3 p-2 bg-light rounded">
//       {icon && <span className="text-primary">{icon}</span>}
//       <div className="flex-grow-1">
//         <div className="text-muted small">{label}</div>
//         {isEditing && editValue !== undefined ? (
//           <input
//             type="text"
//             className="form-control"
//             value={editValue}
//             onChange={(e) => onChange?.(e.target.value)}
//           />
//         ) : badgeClass ? (
//           <span className={`badge ${badgeClass}`}>{value}</span>
//         ) : (
//           <div className="fw-semibold">{value}</div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default UserDetails;




import { useState } from "react";
import { useParams } from "react-router-dom";
import { 
  FaEdit, FaUser, FaCalendarAlt, FaPhone, FaTransgender, FaBusinessTime, 
  FaSave, FaTimes, FaMapMarkerAlt, FaAddressCard, FaIdCard, FaPlus, 
  FaTrash, FaStar, FaEnvelope, FaWhatsapp, FaFileAlt
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDetails = () => {
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    id: userId,
    name: "Saksham Jain",
    username: "1@gmail.com",
    contact: "+91 9999999999",
    // other fields unchanged
    createdOn: "2023-01-15",
    updatedOn: "2023-10-01",
    status: "Active",
    profileImg: null,
    dob: "1990-05-15",
    gender: "Male",
    joiningDate: "2020-03-01",
    weekoff: "Saturday, Sunday",
    leaveScheme: "Annual Leave (20 days)",
  });
  const [draft, setDraft] = useState({ name: user.name, username: user.username, contact: user.contact });

  // User Contacts Section
  interface Contact {
    id: number;
    relation: string;
    name: string;
    value: string;
    contactType: 'email' | 'whatsapp' | 'phone';
  }

  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, relation: "Self", name: "Primary Phone", value: "+91 9999999999", contactType: "phone" },
    { id: 2, relation: "Self", name: "Work Email", value: "saksham.work@gmail.com", contactType: "email" },
    { id: 3, relation: "Father", name: "Father's Phone", value: "+91 8888888888", contactType: "phone" },
    { id: 4, relation: "Mother", name: "Mother's Phone", value: "+91 7777777777", contactType: "whatsapp" },
    { id: 5, relation: "Brother", name: "Brother's Email", value: "brother@gmail.com", contactType: "email" },
  ]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    relation: "Self",
    name: "",
    value: "",
    contactType: "phone" as const
  });

  // User Addresses Section
  const [addresses, setAddresses] = useState([
    { 
      id: 1, 
      addressType: "Home", 
      address: "123 Main Street, Apartment 4B", 
      landmark: "Near Central Park", 
      pincode: "400001", 
      state: "Maharashtra", 
      city: "Mumbai", 
      isPrimary: true, 
      isActive: true 
    },
    { 
      id: 2, 
      addressType: "Work", 
      address: "456 Business Avenue, Tower C", 
      landmark: "Bandra Kurla Complex", 
      pincode: "400051", 
      state: "Maharashtra", 
      city: "Mumbai", 
      isPrimary: false, 
      isActive: true 
    },
    { 
      id: 3, 
      addressType: "Permanent", 
      address: "789 Village Road", 
      landmark: "Near Old Temple", 
      pincode: "302001", 
      state: "Rajasthan", 
      city: "Jaipur", 
      isPrimary: false, 
      isActive: true 
    }
  ]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    addressType: "Home",
    address: "",
    landmark: "",
    pincode: "",
    state: "",
    city: "",
    isPrimary: false,
    isActive: true
  });

  // User Documents Section
  const [documents, setDocuments] = useState<Array<{
    id: number;
    title: string;
    fileUrl: string;
    documentType: "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE";
  }>>([
    { id: 1, title: "Aadhar Card", fileUrl: "/documents/aadhar.pdf", documentType: "AADHAR" },
    { id: 2, title: "PAN Card", fileUrl: "/documents/pan.pdf", documentType: "PAN" },
    { id: 3, title: "Passport", fileUrl: "/documents/passport.pdf", documentType: "PASSPORT" }
  ]);
  const [isAddingDocument, setIsAddingDocument] = useState(false);
  const [newDocument, setNewDocument] = useState<{
    title: string;
    fileUrl: string;
    documentType: "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE";
  }>({
    title: "",
    fileUrl: "",
    documentType: "AADHAR"
  });

  const handleSave = () => {
    // validate simple
    if (!draft.name.trim() || !/^\S+@\S+\.\S+$/.test(draft.username) || !/^\+?\d{10,15}$/.test(draft.contact)) {
      toast.error("Please enter valid Name, Email, and Contact");
      return;
    }     
    setUser({ ...user, ...draft, updatedOn: new Date().toISOString().split('T')[0] });
    setIsEditing(false);
    toast.success("Changes saved successfully");
  };

  const handleCancel = () => {
    setDraft({ name: user.name, username: user.username, contact: user.contact });
    setIsEditing(false);
  };

  // Contact handlers
  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.value.trim()) {
      toast.error("Please fill all contact fields");
      return;
    }

    // Basic validation
    if (newContact.contactType === "email" && !/^\S+@\S+\.\S+$/.test(newContact.value)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if ((newContact.contactType === "phone" || newContact.contactType === "whatsapp") && 
        !/^\+?\d{10,15}$/.test(newContact.value)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ relation: "Self", name: "", value: "", contactType: "phone" });
    setIsAddingContact(false);
    toast.success("Contact added successfully");
  };

  const handleDeleteContact = (id: number): void => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast.success("Contact deleted successfully");
  };

  // Address handlers
  const handleAddAddress = () => {
    if (!newAddress.address.trim() || !newAddress.pincode.trim() || !newAddress.state.trim() || !newAddress.city.trim()) {
      toast.error("Please fill all required address fields");
      return;
    }

    // Basic validation for pincode
    if (!/^\d{5,6}$/.test(newAddress.pincode)) {
      toast.error("Please enter a valid pincode");
      return;
    }

    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    
    // If this is marked as primary, update other addresses
    let updatedAddresses = [...addresses];
    if (newAddress.isPrimary) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isPrimary: false
      }));
    }
    
    setAddresses([...updatedAddresses, { ...newAddress, id: newId }]);
    setNewAddress({
      addressType: "Home",
      address: "",
      landmark: "",
      pincode: "",
      state: "",
      city: "",
      isPrimary: false,
      isActive: true
    });
    setIsAddingAddress(false);
    toast.success("Address added successfully");
  };

  interface Address {
    id: number;
    addressType: string;
    address: string;
    landmark: string;
    pincode: string;
    state: string;
    city: string;
    isPrimary: boolean;
    isActive: boolean;
  }

  const handleDeleteAddress = (id: number): void => {
    setAddresses(addresses.filter(address => address.id !== id));
    toast.success("Address deleted successfully");
  };

  interface Address {
    id: number;
    addressType: string;
    address: string;
    landmark: string;
    pincode: string;
    state: string;
    city: string;
    isPrimary: boolean;
    isActive: boolean;
  }

  const handleSetPrimary = (id: number): void => {
    setAddresses(addresses.map((address: Address) => ({
      ...address,
      isPrimary: address.id === id
    })));
    toast.success("Primary address updated");
  };

  // Document handlers
  const handleAddDocument = () => {
    if (!newDocument.title.trim() || !newDocument.fileUrl.trim()) {
      toast.error("Please fill all document fields");
      return;
    }

    const newId = documents.length > 0 ? Math.max(...documents.map(d => d.id)) + 1 : 1;
    setDocuments([...documents, { ...newDocument, id: newId }]);
    setNewDocument({ title: "", fileUrl: "", documentType: "AADHAR" });
    setIsAddingDocument(false);
    toast.success("Document added successfully");
  };

  interface Document {
    id: number;
    title: string;
    fileUrl: string;
    documentType: 'AADHAR' | 'PAN' | 'PASSPORT' | 'VOTER_ID' | 'DRIVING_LICENCE';
  }

  const handleDeleteDocument = (id: number): void => {
    setDocuments(documents.filter((document: Document) => document.id !== id));
    toast.success("Document deleted successfully");
  };

  // Helper for Contact Type Icon
  interface ContactType {
    type: 'email' | 'whatsapp' | 'phone';
  }

  const getContactTypeIcon = (type: ContactType['type']): React.ReactElement => {
    switch(type) {
      case "email":
        return <FaEnvelope className="text-primary" />;
      case "whatsapp":
        return <FaWhatsapp className="text-success" />;
      case "phone":
      default:
        return <FaPhone className="text-primary" />;
    }
  };

  // Helper for Document Type Icon
  interface DocumentType {
    type: 'AADHAR' | 'PAN' | 'PASSPORT' | 'VOTER_ID' | 'DRIVING_LICENCE';
  }

  const getDocumentTypeIcon = (type: DocumentType['type']): React.ReactElement => {
    switch(type) {
      case "AADHAR":
      case "PAN":
      case "PASSPORT":
      case "VOTER_ID":
      case "DRIVING_LICENCE":
      default:
        return <FaIdCard className="text-primary" />;
    }
  };

  return (
    <div className="container py-10 p-5">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      {/* User Details Card */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h3 className="mb-0 d-flex align-items-center gap-3">
            <FaUser className="me-2" />
            User Details
          </h3>
        </div>

        <div className="card-body p-5">
          <div className="row align-items-center">
            {/* Profile Image Section */}
            <div className="col-12 col-md-4 mb-4 mb-md-0 text-center">
              <div className="text-center">
                {user.profileImg ? (
                  <img
                    src={user.profileImg}
                    alt="Profile"
                    className="rounded-circle mb-3"
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: "200px", height: "200px",  backgroundColor: '#FFF3DC', color: '#333',  fontSize: '3rem',
                        fontWeight: 'bold' }}
                  >
                    <span className=" display-4">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                )}
              </div>
              <h5 className="text-center">{user.name}</h5>

              {/* Edit toggle button */}
              <button
                className="btn btn-primary w-50 mt-2"
                onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
                disabled={isEditing}
              >
                <FaEdit className="me-2" /> Edit Details
              </button>
            </div>

            {/* User Details Section */}
            <div className="col-12 col-md-8">
              <div className="row g-3">
                {/* Editable fields */}
                <DetailItem
                  icon={<FaUser />}
                  label="Full Name"
                  value={isEditing ? undefined : user.name}
                  editValue={draft.name}
                  onChange={(val) => setDraft({ ...draft, name: val })}
                  isEditing={isEditing}
                />
                <DetailItem
                  icon={<FaUser />}
                  label="Email"
                  value={isEditing ? undefined : user.username}
                  editValue={draft.username}
                  onChange={(val) => setDraft({ ...draft, username: val })}
                  isEditing={isEditing}
                />
                <DetailItem
                  icon={<FaPhone />}
                  label="Contact"
                  value={isEditing ? undefined : user.contact}
                  editValue={draft.contact}
                  onChange={(val) => setDraft({ ...draft, contact: val })}
                  isEditing={isEditing}
                />
                {/* Read-only items */}
                <DetailItem
                  icon={<FaCalendarAlt />}
                  label="Date of Birth"
                  value={new Date(user.dob).toLocaleDateString()}
                />
                <DetailItem
                  icon={<FaTransgender />}
                  label="Gender"
                  value={user.gender}
                />
                <DetailItem
                  icon={<FaBusinessTime />}
                  label="Joining Date"
                  value={new Date(user.joiningDate).toLocaleDateString()}
                />
                <DetailItem
                  label="Status"
                  value={user.status}
                  badgeClass={user.status === "Active" ? "bg-success" : "bg-danger"}
                />
                <DetailItem
                  label="Created On"
                  value={new Date(user.createdOn).toLocaleDateString()}
                />
                <DetailItem
                  label="Last Updated"
                  value={new Date(user.updatedOn).toLocaleDateString()}
                />
                <DetailItem label="Weekly Off" value={user.weekoff} />
                <DetailItem label="Leave Scheme" value={user.leaveScheme} />
              </div>

              {/* Save/Cancel buttons */}
              {isEditing && (
                <div className="mt-4">
                  <button className="btn btn-success me-2" onClick={handleSave}>
                    <FaSave /> Save Changes
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Contacts Card */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h3 className="mb-0 d-flex align-items-center gap-3">
            <FaPhone className="me-2" />
            User Contacts
          </h3>
          <button 
            className="btn btn-light" 
            onClick={() => setIsAddingContact(!isAddingContact)}
          >
            {isAddingContact ? <FaTimes /> : <FaPlus />} {isAddingContact ? "Cancel" : "Add Contact"}
          </button>
        </div>

        <div className="card-body">
          {/* Add Contact Form */}
          {isAddingContact && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Relation</label>
                    <select 
                      className="form-select"
                      value={newContact.relation}
                      onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                    >
                      <option value="Self">Self</option>
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Friend">Friend</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Contact Type</label>
                    <select 
                      className="form-select"
                      value={newContact.contactType}
                      onChange={(e) => setNewContact({...newContact, contactType: e.target.value as 'email' | 'whatsapp' | 'phone'})}
                    >
                      <option value="phone">Phone</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="E.g., Work Phone, Personal Email"
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Value</label>
                    <input 
                      type={newContact.contactType === "email" ? "email" : "text"}
                      className="form-control"
                      placeholder={newContact.contactType === "email" ? "email@example.com" : "+91 9999999999"}
                      value={newContact.value}
                      onChange={(e) => setNewContact({...newContact, value: e.target.value})}
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

          {/* Contacts List */}
          <div className="row g-3">
            {contacts.map(contact => (
              <div key={contact.id} className="col-12 col-md-6">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-2">
                        {getContactTypeIcon(contact.contactType)}
                        <div>
                          <h5 className="mb-0">{contact.name}</h5>
                          <div className="text-muted small">{contact.relation}</div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteContact(contact.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="mt-3 fw-bold">{contact.value}</div>
                  </div>
                </div>
              </div>
            ))}
            {contacts.length === 0 && (
              <div className="col-12 text-center p-4">
                <p className="text-muted">No contacts added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Addresses Card */}
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h3 className="mb-0 d-flex align-items-center gap-3">
            <FaMapMarkerAlt className="me-2" />
            User Addresses
          </h3>
          <button 
            className="btn btn-light" 
            onClick={() => setIsAddingAddress(!isAddingAddress)}
          >
            {isAddingAddress ? <FaTimes /> : <FaPlus />} {isAddingAddress ? "Cancel" : "Add Address"}
          </button>
        </div>

        <div className="card-body">
          {/* Add Address Form */}
          {isAddingAddress && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Address Type</label>
                    <select 
                      className="form-select"
                      value={newAddress.addressType}
                      onChange={(e) => setNewAddress({...newAddress, addressType: e.target.value})}
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">City</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">State</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Pincode</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Address</label>
                    <textarea 
                      className="form-control"
                      rows={2}
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Landmark</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        id="isPrimary"
                        checked={newAddress.isPrimary}
                        onChange={(e) => setNewAddress({...newAddress, isPrimary: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="isPrimary">Set as Primary Address</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        id="isActive"
                        checked={newAddress.isActive}
                        onChange={(e) => setNewAddress({...newAddress, isActive: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="isActive">Active Address</label>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <button className="btn btn-success" onClick={handleAddAddress}>
                    <FaSave /> Save Address
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Addresses List */}
          <div className="row g-3">
            {addresses.map(address => (
              <div key={address.id} className="col-12">
                <div className={`card h-100 ${address.isPrimary ? 'border-primary' : ''}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <FaAddressCard className="text-primary" />
                          <h5 className="mb-0">
                            {address.addressType} Address
                            {address.isPrimary && <span className="badge bg-primary ms-2">Primary</span>}
                            {!address.isActive && <span className="badge bg-warning ms-2">Inactive</span>}
                          </h5>
                        </div>
                        <p className="mb-1"><strong>Address:</strong> {address.address}</p>
                        {address.landmark && <p className="mb-1"><strong>Landmark:</strong> {address.landmark}</p>}
                        <p className="mb-1"><strong>City:</strong> {address.city}, <strong>State:</strong> {address.state}</p>
                        <p className="mb-0"><strong>Pincode:</strong> {address.pincode}</p>
                      </div>
                      <div>
                        {!address.isPrimary && (
                          <button 
                            className="btn btn-sm btn-outline-primary me-2" 
                            onClick={() => handleSetPrimary(address.id)}
                          >
                            <FaStar /> Set Primary
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {addresses.length === 0 && (
              <div className="col-12 text-center p-4">
                <p className="text-muted">No addresses added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Documents Card */}
      <div className="card shadow">
        <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h3 className="mb-0 d-flex align-items-center gap-3">
            <FaFileAlt className="me-2" />
            User Documents
          </h3>
          <button 
            className="btn btn-light" 
            onClick={() => setIsAddingDocument(!isAddingDocument)}
          >
            {isAddingDocument ? <FaTimes /> : <FaPlus />} {isAddingDocument ? "Cancel" : "Add Document"}
          </button>
        </div>

        <div className="card-body">
          {/* Add Document Form */}
          {isAddingDocument && (
            <div className="card mb-3 border-primary">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Document Type</label>
                    <select 
                      className="form-select"
                      value={newDocument.documentType}
                      onChange={(e) => setNewDocument({...newDocument, documentType: e.target.value as "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE"})}
                    >
                      <option value="AADHAR">Aadhar Card</option>
                      <option value="PAN">PAN Card</option>
                      <option value="PASSPORT">Passport</option>
                      <option value="VOTER_ID">Voter ID</option>
                      <option value="DRIVING_LICENCE">Driving License</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="E.g., Aadhar Card"
                      value={newDocument.title}
                      onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">File URL</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="E.g., /documents/aadhar.pdf"
                      value={newDocument.fileUrl}
                      onChange={(e) => setNewDocument({...newDocument, fileUrl: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <button className="btn btn-success" onClick={handleAddDocument}>
                    <FaSave /> Save Document
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents List */}
          <div className="row g-3">
            {documents.map(document => (
              <div key={document.id} className="col-12 col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-2">
                        {getDocumentTypeIcon(document.documentType)}
                        <div>
                          <h5 className="mb-0">{document.title}</h5>
                          <div className="text-muted small">{document.documentType}</div>
                        </div>
                      </div>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={() => handleDeleteDocument(document.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="mt-3">
                      <a href={document.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                        View Document
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {documents.length === 0 && (
              <div className="col-12 text-center p-4">
                <p className="text-muted">No documents added yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DetailItemProps {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  editValue?: string;
  onChange?: (val: string) => void;
  isEditing?: boolean;
  badgeClass?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value, editValue, onChange, isEditing, badgeClass }) => (
  <div className="col-12 col-md-6 py-1 px-3">
    <div className="d-flex align-items-center gap-3 p-2 bg-light rounded">
      {icon && <span className="text-primary">{icon}</span>}
      <div className="flex-grow-1">
        <div className="text-muted small">{label}</div>
        {isEditing && editValue !== undefined ? (
          <input
            type="text"
            className="form-control"
            value={editValue}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : badgeClass ? (
          <span className={`badge ${badgeClass}`}>{value}</span>
        ) : (
          <div className="fw-semibold">{value}</div>
        )}
      </div>
    </div>
  </div>
);

export default UserDetails;