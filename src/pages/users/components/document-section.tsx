// components/DocumentsSection.tsx
import React, { useState, useEffect } from "react";
import { Document } from "../../../types/user.types";
import { FaPlus, FaTimes, FaSave, FaSpinner, FaFilePdf} from "react-icons/fa";
import { getDocumentTypeIcon, generateSHA256 } from "../../../utils/helper.tsx";
import { toast } from "react-toastify";
import generalService from "../../../services/api-services/general.service.ts";
import userApi from "../../../services/api-services/user.service.ts";

export const DocumentsSection: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [newDocument, setNewDocument] = useState<Omit<Document, "id" | "fileId">>({
    title: "",
    documentType: "AADHAR",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // New state for document preview
  const [previewDocument, setPreviewDocument] = useState<Document | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsFetching(true);
        const response = await userApi.getUserDocuments();
        if (response.data) {
          setDocuments(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
        toast.error("Failed to load documents");
      } finally {
        setIsFetching(false);
      }
    };

    fetchDocuments();
  }, []);

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

      // Upload file to S3 and get fileId
      const fileHash = await generateSHA256(selectedFile);
      const uploadResponse = await generalService.uploadToS3([
        { image: selectedFile, hash: fileHash }
      ]);
      
      const fileId = uploadResponse.data[0].id;

      // Create document payload with required fields
      const documentPayload = {
        title: newDocument.title,
        fileId: fileId,
        documentType: newDocument.documentType
      };

      // Save document metadata to backend
      const response = await userApi.createUserDocument(documentPayload);
      const savedDocument = response.data;
      
      // Update local state with saved document
      setDocuments([...documents, savedDocument]);

      // Reset form
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

  // Handle document preview
  const handlePreview = (doc: Document) => {
    setPreviewDocument(doc);
    setIsPreviewOpen(true);
  };

  // Render document preview based on file type
  const renderDocumentPreview = () => {
    if (!previewDocument || !previewDocument.file) return null;
    
    const mimeType = previewDocument.file.mimeType || '';
    const url = previewDocument.file.url || '';

    if (mimeType.includes('pdf')) {
      return (
        <div className="d-flex flex-column align-items-center">
          <FaFilePdf className="text-danger" size={48} />
          <p className="mt-2">PDF Document</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary mt-2"
          >
            Download PDF
          </a>
        </div>
      );
    } else if (mimeType.includes('image')) {
      return (
        <div className="text-center">
          <img 
            src={url} 
            alt={previewDocument.title} 
            className="img-fluid rounded"
            style={{ maxHeight: '70vh' }}
          />
        </div>
      );
    } else {
      return (
        <div className="d-flex flex-column align-items-center">
          <FaFilePdf className="text-primary" size={48} />
          <p className="mt-2">Document File</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-primary mt-2"
          >
            Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="card shadow">
      {/* Preview Modal */}
      {isPreviewOpen && previewDocument && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{previewDocument.title}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setIsPreviewOpen(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {renderDocumentPreview()}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0">Documents</h3>
        <button
          className="btn btn-light"
          onClick={() => setIsAdding(!isAdding)}
          disabled={isLoading || isFetching}
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
                        documentType: e.target.value as
                          | "AADHAR"
                          | "PAN"
                          | "PASSPORT"
                          | "VOTER_ID"
                          | "DRIVING_LICENCE",
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

        {isFetching ? (
          <div className="text-center py-5">
            <FaSpinner className="fa-spin fa-2x" />
            <p>Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-5">
            <p>No documents found</p>
            <button 
              className="btn btn-primary mt-2"
              onClick={() => setIsAdding(true)}
            >
              <FaPlus /> Add Your First Document
            </button>
          </div>
        ) : (
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
                    </div>
                    {doc.file && (
                      <button
                        className="btn btn-sm btn-outline-primary mt-2"
                        onClick={() => handlePreview(doc)}
                      >
                        View Document
                      </button>
                    )}
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