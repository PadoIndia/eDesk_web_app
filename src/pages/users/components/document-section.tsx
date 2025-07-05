import React, { useState, useEffect } from "react";
import { DocumentPayload, DocumentResponse } from "../../../types/user.types";
import {
  FaPlus,
  FaTimes,
  FaSave,
  FaSpinner,
  FaFilePdf,
  FaFileImage,
  FaFile,
  FaDownload,
  FaEye,
  FaTrash,
  FaIdCard,
  FaPassport,
  FaCar,
  FaVoteYea,
} from "react-icons/fa";
import { MdBadge } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi";
import { toast } from "react-toastify";
import userService from "../../../services/api-services/user.service.ts";
import { getMediaUrl, uploadMediaFile } from "../../../utils/helper.tsx";
import { Colors } from "../../../utils/constants.ts";
import { MediaType } from "../../../types/chat.ts";

const DocumentsSection: React.FC<{ userId: number }> = ({ userId }) => {
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [newDocument, setNewDocument] = useState<
    Omit<DocumentPayload, "id" | "fileId">
  >({
    title: "",
    documentType: "AADHAR",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDocument, setPreviewDocument] =
    useState<DocumentResponse | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsFetching(true);
        const response = await userService.getUserDocuments(userId);
        if (response.data) {
          setDocuments(response.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch documents", error);
        toast.error("Failed to load documents");
      } finally {
        setIsFetching(false);
      }
    };

    fetchDocuments();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleAddDocument = async () => {
    try {
      if (!newDocument.title || !selectedFile) {
        toast.error("Please fill all fields and select a file");
        return;
      }

      setIsLoading(true);

      const fileResponse = await uploadMediaFile(selectedFile);
      const fileId = fileResponse.id;

      const documentPayload = {
        title: newDocument.title,
        fileId: fileId,
        documentType: newDocument.documentType,
      };

      const response = await userService.createUserDocument(
        userId,
        documentPayload
      );
      const savedDocument = response.data;

      setDocuments([...documents, savedDocument]);

      setIsAdding(false);
      setNewDocument({ title: "", documentType: "AADHAR" });
      setSelectedFile(null);
      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Document upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewDocument({ title: "", documentType: "AADHAR" });
    setSelectedFile(null);
  };

  const handlePreview = (doc: DocumentResponse) => {
    setPreviewDocument(doc);
    setIsPreviewOpen(true);
  };

  const getDocumentIcon = (type: string) => {
    const iconStyle = { fontSize: "22px" };
    switch (type) {
      case "AADHAR":
        return <FaIdCard style={{ ...iconStyle, color: "#ff9800" }} />;
      case "PAN":
        return <MdBadge style={{ ...iconStyle, color: "#2196f3" }} />;
      case "PASSPORT":
        return <FaPassport style={{ ...iconStyle, color: "#4caf50" }} />;
      case "VOTER_ID":
        return <FaVoteYea style={{ ...iconStyle, color: "#9c27b0" }} />;
      case "DRIVING_LICENCE":
        return <FaCar style={{ ...iconStyle, color: "#f44336" }} />;
      default:
        return <FaFile style={{ ...iconStyle, color: "#6c757d" }} />;
    }
  };

  const getFileIcon = (mimeType?: MediaType) => {
    const iconStyle = { fontSize: "16px" };
    if (!mimeType) return <FaFile style={{ ...iconStyle, color: "#6c757d" }} />;

    if (mimeType === "PDF") {
      return <FaFilePdf style={{ ...iconStyle, color: "#dc3545" }} />;
    } else if (mimeType === "IMAGE") {
      return <FaFileImage style={{ ...iconStyle, color: "#28a745" }} />;
    } else {
      return <FaFile style={{ ...iconStyle, color: "#6c757d" }} />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Bytes";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderDocumentPreview = () => {
    if (!previewDocument || !previewDocument.file) return null;

    const mimeType = previewDocument.file.type || "";
    const url = previewDocument.file.url || "";

    if (mimeType === "PDF") {
      return (
        <div className="text-center py-5">
          <FaFilePdf
            style={{ fontSize: "64px", color: Colors.accent }}
            className="mb-3"
          />
          <p className="mb-4">PDF Document</p>
          <a
            href={getMediaUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn d-inline-flex align-items-center gap-2"
            style={{
              backgroundColor: Colors.accent,
              color: "white",
              border: "none",
            }}
          >
            <FaDownload /> Download PDF
          </a>
        </div>
      );
    } else if (mimeType === "IMAGE") {
      return (
        <div className="text-center">
          <img
            src={getMediaUrl(url)}
            alt={previewDocument.title}
            className="img-fluid rounded"
            style={{
              maxHeight: "60vh",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="text-center py-5">
          <FaFile
            style={{ fontSize: "64px", color: Colors.accent }}
            className="mb-3"
          />
          <p className="mb-4">Document File</p>
          <a
            href={getMediaUrl(url)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn d-inline-flex align-items-center gap-2"
            style={{
              backgroundColor: Colors.accent,
              color: "white",
              border: "none",
            }}
          >
            <FaDownload /> Download File
          </a>
        </div>
      );
    }
  };

  return (
    <div className="card" style={{ border: "1px solid #f1f1f1" }}>
      {isPreviewOpen && previewDocument && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setIsPreviewOpen(false)}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{previewDocument.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsPreviewOpen(false)}
                ></button>
              </div>
              <div className="modal-body">{renderDocumentPreview()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card-header bg-white border-bottom-0 p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 d-flex align-items-center">
            <span
              style={{
                width: "4px",
                height: "24px",
                backgroundColor: Colors.accent,
                marginRight: "12px",
                borderRadius: "2px",
              }}
            ></span>
            Documents
          </h5>
          {!isAdding && (
            <button
              className="btn btn-sm d-flex align-items-center gap-2"
              style={{
                backgroundColor: Colors.accent,
                color: "white",
                border: "none",
              }}
              onClick={() => setIsAdding(true)}
              disabled={isLoading || isFetching}
            >
              <FaPlus /> Add Document
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <div className="bg-light border-bottom p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0 text-secondary">New Document</h6>
            <div className="d-flex gap-2">
              <button
                className="btn btn-success btn-sm d-flex align-items-center gap-1"
                onClick={handleAddDocument}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="fa-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    <FaSave /> Save
                  </>
                )}
              </button>
              <button
                className="btn btn-secondary btn-sm d-flex align-items-center gap-1"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Document Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={newDocument.documentType}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    documentType: e.target
                      .value as DocumentResponse["documentType"],
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

            <div className="col-12 col-md-6">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Title <span className="text-danger">*</span>
              </label>
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

            <div className="col-12">
              <label className="form-label small text-muted text-uppercase fw-semibold">
                Upload File <span className="text-danger">*</span>
              </label>
              <div className="position-relative">
                <input
                  type="file"
                  id="documentFile"
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{
                    opacity: 0,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                />
                <label
                  htmlFor="documentFile"
                  className="form-control d-flex align-items-center gap-2"
                  style={{
                    cursor: "pointer",
                    border: "2px dashed #dee2e6",
                    backgroundColor: selectedFile ? "#f8f9fa" : "white",
                  }}
                >
                  {selectedFile ? (
                    <>
                      <FaFile style={{ color: Colors.accent }} />{" "}
                      {selectedFile.name}
                    </>
                  ) : (
                    <>
                      <FaPlus style={{ color: Colors.accent }} /> Choose File
                    </>
                  )}
                </label>
              </div>
              <small className="text-muted">
                Supported formats: PDF, JPG, PNG (Max 5MB)
              </small>
            </div>
          </div>
        </div>
      )}

      <div className="card-body p-4">
        {isFetching ? (
          <div className="text-center py-5">
            <FaSpinner
              className="fa-spin mb-3"
              style={{ fontSize: "32px", color: Colors.accent }}
            />
            <p className="text-muted">Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-5">
            <HiDocumentText
              className="text-muted mb-3"
              style={{ fontSize: "48px", opacity: 0.3 }}
            />
            <p className="text-muted mb-3">No documents uploaded yet</p>
            <button
              className="btn"
              style={{ backgroundColor: Colors.accent, color: "white" }}
              onClick={() => setIsAdding(true)}
            >
              <FaPlus className="me-2" />
              Add Your First Document
            </button>
          </div>
        ) : (
          <div className="row g-3">
            {documents.map((doc) => (
              <div key={doc.id} className="col-12 col-md-6 col-lg-4">
                <div
                  className="card h-100 position-relative overflow-hidden hover-shadow-sm"
                  style={{
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    border: "1px solid #f1f1f1",
                  }}
                  onMouseEnter={(e) => {
                    const actions = e.currentTarget.querySelector(
                      ".document-actions"
                    ) as HTMLElement;
                    if (actions) actions.style.opacity = "1";
                    const accent = e.currentTarget.querySelector(
                      ".accent-bar"
                    ) as HTMLElement;
                    if (accent) accent.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const actions = e.currentTarget.querySelector(
                      ".document-actions"
                    ) as HTMLElement;
                    if (actions) actions.style.opacity = "0";
                    const accent = e.currentTarget.querySelector(
                      ".accent-bar"
                    ) as HTMLElement;
                    if (accent) accent.style.opacity = "0";
                  }}
                >
                  <div
                    className="position-absolute top-0 start-0 h-100 accent-bar"
                    style={{
                      width: "4px",
                      backgroundColor: Colors.accent,
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
                        {getDocumentIcon(doc.documentType)}
                      </div>
                      <div
                        className="d-flex gap-1 document-actions"
                        style={{ opacity: 0, transition: "opacity 0.2s" }}
                      >
                        <button
                          className="btn btn-sm btn-light p-1"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => handlePreview(doc)}
                          title="View document"
                        >
                          <FaEye style={{ color: Colors.accent }} />
                        </button>
                        {doc.file?.url && (
                          <a
                            href={doc.file.url}
                            target="_blank"
                            download
                            className="btn btn-sm btn-light p-1 d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              textDecoration: "none",
                            }}
                            title="Download document"
                          >
                            <FaDownload className="text-success" />
                          </a>
                        )}
                        <div
                          className="btn btn-sm btn-light p-1"
                          style={{
                            cursor: "not-allowed",
                            width: "32px",
                            height: "32px",
                          }}
                          title="Delete document"
                        >
                          <FaTrash className="text-danger" />
                        </div>
                      </div>
                    </div>

                    <h6 className="card-title mb-1">{doc.title}</h6>
                    <small
                      className="text-muted text-uppercase d-block mb-3"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      {doc.documentType.replace("_", " ")}
                    </small>

                    {doc.file && (
                      <div className="border-top pt-2">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          {getFileIcon(doc.file.type)}
                          <small className="text-secondary">
                            {formatFileSize(doc.file.size)}
                          </small>
                        </div>
                        <small className="text-muted">
                          Uploaded: {formatDate(doc.createdOn)}
                        </small>
                      </div>
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

export default DocumentsSection;
