// // components/DocumentsSection.tsx
// import React, { useState } from "react";
// import { Document } from "../../types/user.types";
// import { FaPlus, FaTimes, FaTrash, FaSave } from "react-icons/fa";
// import { getDocumentTypeIcon } from "../../utils/helper.tsx";

// interface DocumentsSectionProps {
//   userId: number;
// }

// export const DocumentsSection: React.FC<DocumentsSectionProps> = () => {
//   const [documents, setDocuments] = useState<Document[]>([]);
//   const [isAdding, setIsAdding] = useState(false);
//   const [newDocument, setNewDocument] = useState<Omit<Document, "id">>({
//     title: "",
//     fileUrl: "",
//     documentType: "AADHAR",
//   });

//   const handleAddDocument = () => {
//     if (!newDocument.title || !newDocument.fileUrl) {
//       alert("Please fill all fields");
//       return;
//     }

//     setDocuments([...documents, { ...newDocument, id: documents.length + 1 }]);
//     setIsAdding(false);
//     setNewDocument({ title: "", fileUrl: "", documentType: "AADHAR" });
//   };

//   return (
//     <div className="card shadow">
//       <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
//         <h3 className="mb-0">Documents</h3>
//         <button
//           className="btn btn-light"
//           onClick={() => setIsAdding(!isAdding)}
//         >
//           {isAdding ? <FaTimes /> : <FaPlus />} Add Document
//         </button>
//       </div>

//       <div className="card-body">
//         {isAdding && (
//           <div className="card mb-3 border-primary">
//             <div className="card-body">
//               {/* Add Document Form */}
//               <div className="row g-3">
//                 <div className="col-md-6">
//                   <label className="form-label">Document Type</label>
//                   <select
//                     className="form-select"
//                     value={newDocument.documentType}
//                     onChange={(e) =>
//                       setNewDocument({
//                         ...newDocument,
//                         documentType: e.target.value as
//                           | "AADHAR"
//                           | "PAN"
//                           | "PASSPORT"
//                           | "VOTER_ID"
//                           | "DRIVING_LICENCE",
//                       })
//                     }
//                   >
//                     <option value="AADHAR">Aadhar Card</option>
//                     <option value="PAN">PAN Card</option>
//                     <option value="PASSPORT">Passport</option>
//                     <option value="VOTER_ID">Voter ID</option>
//                     <option value="DRIVING_LICENCE">Driving License</option>
//                   </select>
//                 </div>
//                 <div className="col-md-6">
//                   <label className="form-label">Title</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="E.g., Aadhar Card"
//                     value={newDocument.title}
//                     onChange={(e) =>
//                       setNewDocument({
//                         ...newDocument,
//                         title: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div className="col-md-12">
//                   <label className="form-label">File URL</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="E.g., /documents/aadhar.pdf"
//                     value={newDocument.fileUrl}
//                     onChange={(e) =>
//                       setNewDocument({
//                         ...newDocument,
//                         fileUrl: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//               </div>
//               <div className="mt-3">
//                 <button className="btn btn-success" onClick={handleAddDocument}>
//                   <FaSave /> Save Document
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="row g-3">
//           {documents.map((doc) => (
//             <div key={doc.id} className="col-md-4">
//               <div className="card h-100">
//                 <div className="card-body">
//                   <div className="d-flex justify-content-between">
//                     <div className="d-flex align-items-center gap-2">
//                       {getDocumentTypeIcon()}
//                       <div>
//                         <h5 className="mb-0">{doc.title}</h5>
//                         <small className="text-muted">{doc.documentType}</small>
//                       </div>
//                     </div>
//                     <button
//                       className="btn btn-sm btn-outline-danger"
//                       onClick={() =>
//                         setDocuments(documents.filter((d) => d.id !== doc.id))
//                       }
//                     >
//                       <FaTrash />
//                     </button>
//                   </div>
//                   <a
//                     href={doc.fileUrl}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="btn btn-sm btn-outline-primary mt-2"
//                   >
//                     View Document
//                   </a>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };



// components/DocumentsSection.tsx
import React, { useState } from "react";
import { Document } from "../../types/user.types";
import { FaPlus, FaTimes, FaTrash, FaSave, FaSpinner } from "react-icons/fa";
import { getDocumentTypeIcon } from "../../utils/helper.tsx";
import { toast } from "react-toastify";
// import userApi from "../../services/api-services/user.service.ts";

interface DocumentsSectionProps {
  userId: number;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newDocument, setNewDocument] = useState<Omit<Document, "id" | "fileUrl">>({
    title: "",
    documentType: "AADHAR",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddDocument = async () => {
    try {
      if (!newDocument.title || !selectedFile) {
        toast.error("Please fill all fields and select a file");
        return;
      }

      setIsLoading(true);

      // Upload the file
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("documentType", newDocument.documentType);
      formData.append("title", newDocument.title);
      formData.append("userId", userId.toString());

      // const response = await userApi.uploadUserDocument(formData);
      
      // setDocuments([...documents, response.data]);
      setIsAdding(false);
      setNewDocument({ title: "", documentType: "AADHAR" });
      setSelectedFile(null);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Document upload failed:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card shadow">
      <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Documents</h3>
        <button
          className="btn btn-light"
          onClick={() => setIsAdding(!isAdding)}
          disabled={isLoading}
        >
          {isAdding ? <FaTimes /> : <FaPlus />} Add Document
        </button>
      </div>

      <div className="card-body">
        {isAdding && (
          <div className="card mb-3 border-primary">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Document Type</label>
                  <select
                    className="form-select"
                    value={newDocument.documentType}
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        documentType: e.target.value as "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE",
                      })
                    }
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
                    onChange={(e) =>
                      setNewDocument({
                        ...newDocument,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Upload File</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    Supported formats: PDF, JPG, PNG (Max 5MB)
                  </small>
                </div>
              </div>
              <div className="mt-3">
                <button 
                  className="btn btn-success" 
                  onClick={handleAddDocument}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="fa-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="row g-3">
          {documents.map((doc) => (
            <div key={doc.id} className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      {getDocumentTypeIcon()}
                      <div>
                        <h5 className="mb-0">{doc.title}</h5>
                        <small className="text-muted">{doc.documentType}</small>
                      </div>
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        setDocuments(documents.filter((d) => d.id !== doc.id))
                      }
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {doc.fileUrl && (
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary mt-2"
                    >
                      View Document
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
