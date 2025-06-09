import { useState, useEffect } from "react";
import { MediaType } from "../../../types/chat";
import { IoClose } from "react-icons/io5";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: {
    type: MediaType;
    url: string;
    name: string;
  } | null;
}

const MediaModal = ({ isOpen, onClose, media }: MediaModalProps) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setLoaded(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !media) return null;
  const renderMediaContent = () => {
    const commonStyle = {
      maxHeight: "80vh",
      maxWidth: "90vw",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      objectFit: "contain",
      backgroundColor: "#2a3942", // WhatsApp dark mode background for media
    } as React.CSSProperties;

    switch (media.type) {
      case "IMAGE":
        return (
          <img
            src={media.url}
            alt={media.name}
            style={commonStyle}
            onLoad={() => setLoaded(true)}
          />
        );
      case "VIDEO":
        return (
          <video
            controls
            autoPlay
            style={commonStyle}
            onLoadedData={() => setLoaded(true)}
          >
            <source src={media.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "PDF":
      case "DOCUMENT":
        return (
          <iframe
            src={media.url}
            title={media.name}
            style={{
              width: "90vw",
              height: "80vh",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              backgroundColor: "#2a3942", // WhatsApp dark mode background for media
            }}
            onLoad={() => setLoaded(true)}
          />
        );
      default:
        return (
          <div
            className="text-center p-5 text-white"
            style={{ color: "#e9edef" }}
          >
            Unsupported media type
          </div>
        );
    }
  };

  return isOpen && media ? (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(17, 27, 33, 0.95)", // WhatsApp dark mode background with opacity
        zIndex: 1050,
      }}
      onClick={onClose}
    >
      <div
        className="position-relative"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "90%" }}
      >
        <button
          className="btn btn-sm position-absolute top-0 end-0 rounded-circle m-2 p-1 d-flex justify-content-center align-items-center"
          style={{
            width: "32px",
            height: "32px",
            zIndex: 1051,
            backgroundColor: "#2a3942", // WhatsApp dark mode button background
            color: "#8696a0", // WhatsApp dark mode icon color
          }}
          onClick={onClose}
        >
          <IoClose size={20} />
        </button>

        {!loaded && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {renderMediaContent()}
      </div>
    </div>
  ) : null;
};

export default MediaModal;
