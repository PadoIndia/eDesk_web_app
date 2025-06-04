import React, { useMemo, useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { FaCalendarAlt, FaPaperPlane, FaInfoCircle, FaSpinner } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import leaveRequestService from "../../services/api-services/leave-request.service";
import { CreateLeaveRequestRequest } from "../../types/leave.types";
import { useAppSelector } from "../../store/store";
import userService from "../../services/api-services/user.service";
import leaveSchemeService from "../../services/api-services/leave-scheme.service"; // Assuming this service exists
import teamService from "../../services/api-services/team.service";

interface LeaveType {
  id: number;
  name: string;
  isPaid: boolean;
  description: string;
  maxDays?: number;
  remainingDays?: number;
}

interface UserDataDetails {
  id: number;
  gender: string;
  dob: string;
  joiningDate: string;
  createdOn: string;
  leaveSchemeId?: number;
  updatedOn: string;
  userId: number;
  weekoff: string;
}

interface LeaveScheme {
  id: number;
  name: string;
  leaveTypes: LeaveType[];
}

interface FormData {
  leaveTypeId: number;
  startDate: Date;
  endDate: Date;
  reason: string;
  isStartHalfDay: boolean;
  isEndHalfDay: boolean;
  halfDayTypeStart?: "first-half" | "second-half";
  halfDayTypeEnd?: "first-half" | "second-half";
}

const ApplyLeave: React.FC = () => {
  const [userDetails, setUserDetails] = useState<UserDataDetails | null>(null);
  const [leaveScheme, setLeaveScheme] = useState<LeaveScheme | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      leaveTypeId: 0,
      startDate: undefined,
      endDate: undefined,
      reason: "",
      isStartHalfDay: false,
      isEndHalfDay: false,
      halfDayTypeStart: undefined,
      halfDayTypeEnd: undefined,
    },
  });

  const userId = useAppSelector((s) => s.auth.userData?.user.id);

  // Fetch user details and leave scheme on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user details
        const userDetailsResponse = await userService.getUserDetailsById(userId);
        
        console.log("user details response", userDetailsResponse);
        

        if (!userDetailsResponse.status || !userDetailsResponse.data) {
          throw new Error("Failed to fetch user details");
        }

        const userDetailsData = userDetailsResponse.data;
        setUserDetails(userDetailsData);

        // Fetch leave scheme if leaveSchemeId exists
        if (userDetailsData.leaveSchemeId) {
          const leaveSchemeResponse = await leaveSchemeService.getLeaveSchemeById(userDetailsData.leaveSchemeId);
          console.log("leave scheme response",leaveSchemeResponse);
          

          if (!leaveSchemeResponse.status || !leaveSchemeResponse.data) {
            throw new Error("Failed to fetch leave scheme");
          }

          const leaveSchemeData = leaveSchemeResponse.data;
          setLeaveScheme(leaveSchemeData);
          setLeaveTypes(leaveSchemeData.leaveTypes || []);
        } else {
          setError("No leave scheme assigned to user");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const watchStartIsHalfDay = useWatch({ control, name: "isStartHalfDay" });
  const watchEndIsHalfDay = useWatch({ control, name: "isEndHalfDay" });
  const watchStart = useWatch({ control, name: "startDate" });
  const watchEnd = useWatch({ control, name: "endDate" });
  const watchHalfDayTypeStart = useWatch({ control, name: "halfDayTypeStart" });
  const watchHalfDayTypeEnd = useWatch({ control, name: "halfDayTypeEnd" });

  // Calculate minimum date based on joining date
  const minDate = useMemo(() => {
    if (!userDetails?.joiningDate) return new Date();
    
    const joiningDate = new Date(userDetails.joiningDate);
    const today = new Date();
    
    // Return the later of joining date or today
    return joiningDate > today ? joiningDate : today;
  }, [userDetails?.joiningDate]);

  // Duration calculation
  const calculateDuration = () => {
    if (!watchStart || !watchEnd) return 0;

    const start = new Date(watchStart);
    const end = new Date(watchEnd);

    // Normalize times to compare dates
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)) + 1;

    // Same day calculation
    if (diffDays === 1) {
      let duration = 1;

      if (watchStartIsHalfDay && watchEndIsHalfDay) {
        if (
          watchHalfDayTypeStart === "first-half" &&
          watchHalfDayTypeEnd === "second-half"
        ) {
          duration = 1;
        } else if (watchHalfDayTypeStart === watchHalfDayTypeEnd) {
          duration = 0.5;
        }
      } else if (watchStartIsHalfDay || watchEndIsHalfDay) {
        duration = 0.5;
      }

      return duration;
    }

    // Multi-day calculation
    let duration = diffDays;
    if (watchStartIsHalfDay) duration -= 0.5;
    if (watchEndIsHalfDay) duration -= 0.5;

    return duration > 0 ? duration : 0;
  };

  const duration = calculateDuration();

  const onSubmit = async (data: FormData) => {
    if (!userDetails) {
      alert("User details not available");
      return;
    }

    const managerId = await teamService.getManagerByUserId(userDetails.userId);

    console.log("managerId", managerId);
    

    try {
      const payload: CreateLeaveRequestRequest = {
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
        duration,
        reason: data.reason,
        managerId: (managerId.data === null)? 1 : managerId.data ,
        hrId: userDetails.hrId || 1 // Assuming this exists in user details
      };

      console.log("leave apply payload", payload);
      

      const response = await leaveRequestService.createLeaveRequest(payload);
      alert("Leave application submitted successfully!");
      console.log("Leave request created:", response.data);
      
      // Reset form after successful submission
      reset();
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <FaSpinner className="fa-spin fs-1 text-primary mb-3" />
                <h5>Loading your leave information...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              <button 
                className="btn btn-outline-danger"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 d-flex align-items-center">
                <FaCalendarAlt className="me-2" />
                Apply for Leave
              </h4>
            </div>
            <div className="card-body p-4">
              {/* Leave Scheme Info */}
              {leaveScheme && (
                <div className="alert alert-info mb-4">
                  <h6 className="mb-1">Your Leave Scheme: {leaveScheme.name}</h6>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* Leave Type */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Leave Type</label>
                  <select
                    {...register("leaveTypeId", {
                      validate: (v) => v > 0 || "Select a leave type",
                    })}
                    className={`form-select ${
                      errors.leaveTypeId ? "is-invalid" : ""
                    }`}
                  >
                    <option value={0}>-- Select Leave Type --</option>
                    {leaveTypes.map((lt) => (
                      <option key={lt.id} value={lt.id}>
                        {lt.name}
                        {lt.maxDays && ` - Max: ${lt.maxDays} days`}
                        {lt.remainingDays !== undefined && ` - Remaining: ${lt.remainingDays} days`}
                      </option>
                    ))}
                  </select>
                  {errors.leaveTypeId && (
                    <div className="invalid-feedback d-block">
                      {errors.leaveTypeId.message}
                    </div>
                  )}
                </div>

                {/* Leave Type Description */}
                <Controller
                  name="leaveTypeId"
                  control={control}
                  render={({ field }) => {
                    const type = leaveTypes.find((lt) => lt.id === field.value);
                    return (
                      <>
                        {type && (
                          <div className="alert alert-info d-flex align-items-center mb-4 p-3">
                            <FaInfoCircle className="me-2 flex-shrink-0" />
                            <div>
                              <div>{type.description}</div>
                              {type.maxDays && (
                                <small className="text-muted">
                                  Maximum allowed: {type.maxDays} days
                                </small>
                              )}
                              {type.remainingDays !== undefined && (
                                <small className="text-muted d-block">
                                  Remaining balance: {type.remainingDays} days
                                </small>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }}
                />

                {/* Dates */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Start Date
                    </label>
                    <Controller<FormData>
                      name="startDate"
                      control={control}
                      rules={{ required: "Start date is required" }}
                      render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                          {...field}
                          selected={value as Date}
                          onChange={(date: Date | null) => onChange(date)}
                          minDate={minDate}
                          className={`form-control ${
                            errors.startDate ? "is-invalid" : ""
                          }`}
                          placeholderText="Select start date"
                          dateFormat="MMMM d, yyyy"
                        />
                      )}
                    />
                    {errors.startDate && (
                      <div className="invalid-feedback d-block">
                        {errors.startDate.message}
                      </div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      End Date
                    </label>
                    <Controller<FormData>
                      name="endDate"
                      control={control}
                      rules={{
                        required: "End date is required",
                        validate: (value) =>
                          !watchStart ||
                          (value && value >= watchStart) ||
                          "End date must be after start date",
                      }}
                      render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                          {...field}
                          selected={value as Date}
                          onChange={(date: Date | null) => onChange(date)}
                          minDate={watchStart || minDate}
                          className={`form-control ${
                            errors.endDate ? "is-invalid" : ""
                          }`}
                          placeholderText="Select end date"
                          dateFormat="MMMM d, yyyy"
                        />
                      )}
                    />
                    {errors.endDate && (
                      <div className="invalid-feedback d-block">
                        {errors.endDate.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Half Day Options */}
                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      {...register("isStartHalfDay")}
                      className="form-check-input"
                      id="startHalfDay"
                    />
                    <label
                      htmlFor="startHalfDay"
                      className="form-check-label fw-semibold"
                    >
                      Start Half Day Leave
                    </label>
                  </div>

                  {watchStartIsHalfDay && (
                    <div className="ps-3 mb-3">
                      <div className="d-flex flex-wrap gap-3">
                        {["first-half", "second-half"].map((val) => (
                          <div className="form-check" key={val}>
                            <input
                              type="radio"
                              {...register("halfDayTypeStart", {
                                required: watchStartIsHalfDay
                                  ? "Please select start half-day type"
                                  : false,
                              })}
                              value={val}
                              className="form-check-input"
                              id={`start-${val}`}
                            />
                            <label
                              htmlFor={`start-${val}`}
                              className="form-check-label text-capitalize"
                            >
                              {val.replace("-", " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.halfDayTypeStart && (
                        <div className="invalid-feedback d-block mt-1">
                          {errors.halfDayTypeStart.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input
                      type="checkbox"
                      {...register("isEndHalfDay")}
                      className="form-check-input"
                      id="endHalfDay"
                    />
                    <label
                      htmlFor="endHalfDay"
                      className="form-check-label fw-semibold"
                    >
                      End Half Day Leave
                    </label>
                  </div>

                  {watchEndIsHalfDay && (
                    <div className="ps-3 mb-3">
                      <div className="d-flex flex-wrap gap-3">
                        {["first-half", "second-half"].map((val) => (
                          <div className="form-check" key={val}>
                            <input
                              type="radio"
                              {...register("halfDayTypeEnd", {
                                required: watchEndIsHalfDay
                                  ? "Please select end half-day type"
                                  : false,
                              })}
                              value={val}
                              className="form-check-input"
                              id={`end-${val}`}
                            />
                            <label
                              htmlFor={`end-${val}`}
                              className="form-check-label text-capitalize"
                            >
                              {val.replace("-", " ")}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.halfDayTypeEnd && (
                        <div className="invalid-feedback d-block mt-1">
                          {errors.halfDayTypeEnd.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Reason for Leave
                  </label>
                  <textarea
                    {...register("reason", {
                      required: "Reason is required",
                      minLength: {
                        value: 10,
                        message: "Reason must be at least 10 characters",
                      },
                    })}
                    className={`form-control ${
                      errors.reason ? "is-invalid" : ""
                    }`}
                    rows={4}
                    placeholder="Please provide details about your leave request"
                  />
                  {errors.reason && (
                    <div className="invalid-feedback d-block">
                      {errors.reason.message}
                    </div>
                  )}
                </div>

                {/* Duration Display */}
                <div className="alert alert-secondary mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-semibold">Calculated Duration:</span>
                    <span className="badge bg-primary rounded-pill fs-6">
                      {duration} day{duration !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={isSubmitting || leaveTypes.length === 0}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="me-2" />
                        Submit Leave Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;