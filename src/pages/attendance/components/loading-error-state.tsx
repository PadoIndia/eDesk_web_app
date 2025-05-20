import React from "react";
import { FaSpinner } from "react-icons/fa";
import { AttendanceUser } from "../../../types/attendance.types";

interface LoadingErrorStateProps {
  loading: boolean;
  error: string | null;
  currentUser: AttendanceUser | null;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({
  loading,
  error,
  currentUser
}) => {
  if (loading) {
    return (
      <div className="container py-5 text-center">
        <FaSpinner className="fa-spin me-2" size={24} />
        <h3 className="mt-3">Loading attendance data...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          <h4>Error loading data</h4>
          <p>{error}</p>
          <button 
            className="btn btn-outline-danger"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <h4>No user data available</h4>
          <p>Please ensure you are logged in and have proper permissions.</p>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingErrorState;