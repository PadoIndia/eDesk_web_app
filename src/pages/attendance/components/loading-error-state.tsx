import React, { useCallback } from "react";
import {  FaExclamationTriangle, FaUser, FaRedo } from "react-icons/fa";
import { AttendanceUser } from "../../../types/attendance.types";

interface LoadingErrorStateProps {
  loading: boolean;
  error: string | null;
  currentUser: AttendanceUser | null;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = React.memo(({
  loading,
  error,
  currentUser
}) => {
  // OPTIMIZED: Memoized handlers to prevent unnecessary re-renders
  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  const handleGoToLogin = useCallback(() => {
    window.location.href = '/login';
  }, []);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center align-items-center flex-column min-vh-50">
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-muted mb-2">Loading attendance data...</h4>
          <p className="text-muted text-center">Please wait while we fetch your information.</p>
          <div className="progress" style={{ width: '200px', height: '4px' }}>
            <div 
              className="progress-bar progress-bar-striped progress-bar-animated" 
              role="progressbar" 
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-danger">
              <div className="card-header bg-danger text-white">
                <div className="d-flex align-items-center">
                  <FaExclamationTriangle className="me-2" size={20} />
                  <h5 className="mb-0">Error Loading Data</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="alert alert-danger border-0 mb-3">
                  <strong>Error Details:</strong>
                  <p className="mb-0 mt-2">{error}</p>
                </div>
                
                <div className="mb-3">
                  <small className="text-muted">
                    This error might be caused by:
                  </small>
                  <ul className="small text-muted mt-1 mb-0">
                    <li>Network connection issues</li>
                    <li>Server temporarily unavailable</li>
                    <li>Authentication problems</li>
                    <li>Insufficient permissions</li>
                  </ul>
                </div>

                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-danger"
                    onClick={handleRetry}
                  >
                    <FaRedo className="me-1" />
                    Try Again
                  </button>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={handleGoToLogin}
                  >
                    Go to Login
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card border-warning">
              <div className="card-header bg-warning text-dark">
                <div className="d-flex align-items-center">
                  <FaUser className="me-2" size={20} />
                  <h5 className="mb-0">No User Data Available</h5>
                </div>
              </div>
              <div className="card-body">
                <p className="mb-3">
                  We couldn't load your user information. This might be due to:
                </p>
                
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-warning rounded-circle p-2 me-2 mt-1" style={{ width: '8px', height: '8px' }}></div>
                      <small>You are not logged in</small>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-warning rounded-circle p-2 me-2 mt-1" style={{ width: '8px', height: '8px' }}></div>
                      <small>Your session has expired</small>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-warning rounded-circle p-2 me-2 mt-1" style={{ width: '8px', height: '8px' }}></div>
                      <small>Insufficient permissions</small>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <div className="bg-warning rounded-circle p-2 me-2 mt-1" style={{ width: '8px', height: '8px' }}></div>
                      <small>Account not activated</small>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 justify-content-center">
                  <button 
                    className="btn btn-warning"
                    onClick={handleGoToLogin}
                  >
                    <FaUser className="me-1" />
                    Go to Login
                  </button>
                  <button 
                    className="btn btn-outline-warning"
                    onClick={handleRetry}
                  >
                    <FaRedo className="me-1" />
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

LoadingErrorState.displayName = 'LoadingErrorState';

export default LoadingErrorState;