import React, { useMemo, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaPaperPlane,
  FaInfoCircle,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import generalService from "../../services/api-services/general.service";
import leaveRequestService from "../../services/api-services/leave-request.service";
import leaveSchemeService from "../../services/api-services/leave-scheme.service";
import userService from "../../services/api-services/user.service";
import { useAppSelector } from "../../store/store";
import { LeaveScheme, LeaveRequestPayload } from "../../types/leave.types";
import { UserDetails } from "../../types/user.types";
import leaveTypeService from "../../services/api-services/leave-type.service";
import Select from "react-select";
import { convertDayNameToInt, formatDateForBackend } from "../../utils/helper";

interface FormData {
  leaveTypeId: number;
  startDate: Date | null;
  endDate: Date | null;
  reason: string;
  isStartHalfDay: boolean;
  isEndHalfDay: boolean;
  halfDayTypeStart?: "first-half" | "second-half";
  halfDayTypeEnd?: "first-half" | "second-half";
}

interface FormErrors {
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  halfDayTypeStart?: string;
  halfDayTypeEnd?: string;
  isStartHalfDay?: string;
  isEndHalfDay?: string;
  selectedUserId?: string;
}

interface UserOption {
  value: number;
  label: string;
}

const ApplyLeave = () => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [leaveScheme, setLeaveScheme] = useState<LeaveScheme | null>(null);
  const [leaveTypes, setLeaveTypes] = useState<LeaveScheme["leaveTypes"]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [isForSelf, setIsForSelf] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    leaveTypeId: 0,
    startDate: null,
    endDate: null,
    reason: "",
    isStartHalfDay: false,
    isEndHalfDay: false,
    halfDayTypeStart: undefined,
    halfDayTypeEnd: undefined,
  });
  const [datesToExclude, setDatesToExclude] = useState<Date[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const currentUserId = useAppSelector((s) => s.auth.userData?.user.id);
  const currentUserPermissions = useAppSelector(
    (s) => s.auth.userData?.user.permissions
  );
  const userId = isForSelf ? currentUserId : selectedUserId;

  const hasAdminPermissions = useMemo(() => {
    if (!currentUserPermissions) return false;

    const adminPermissionSlugs = [
      "is_admin",
      "is_department_admin",
      "is_team_admin",
    ];
    return currentUserPermissions.some((perm) =>
      adminPermissionSlugs.includes(perm)
    );
  }, [currentUserPermissions]);

  const adminPermissionType = useMemo(() => {
    if (!currentUserPermissions) return null;

    const adminTypes = [
      { slug: "is_admin", label: "System Admin" },
      { slug: "is_department_admin", label: "Department Admin" },
      { slug: "is_team_admin", label: "Team Admin" },
    ];

    for (const type of adminTypes) {
      if (currentUserPermissions.some((perm) => perm === type.slug)) {
        return type.label;
      }
    }
    return null;
  }, [currentUserPermissions]);

  useEffect(() => {
    if (!isForSelf && !hasAdminPermissions) {
      setError(
        "You don't have permission to create leave requests on behalf of other users."
      );
      setLoading(false);
    }
  }, [isForSelf, hasAdminPermissions]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isForSelf && hasAdminPermissions) {
        try {
          const response = await userService.getAllUsers();
          if (response.status === "success" && response.data) {
            const userOptions = response.data.map((user) => ({
              value: user.id,
              label: user.name,
            }));
            setUsers(userOptions);
          }
        } catch (err) {
          console.error("Error fetching users:", err);
          toast.error("Failed to load users list");
        }
      }
    };

    fetchUsers();
  }, [isForSelf, hasAdminPermissions]);

  useEffect(() => {
    if (isForSelf && currentUserId) {
      fetchUserData(currentUserId);
    } else if (!isForSelf && selectedUserId && hasAdminPermissions) {
      fetchUserData(selectedUserId);
    } else if (isForSelf && !currentUserId) {
      setError("User ID not found");
      setLoading(false);
    } else if (!isForSelf && !hasAdminPermissions) {
      setLoading(false);
    } else if (!isForSelf) {
      setLoading(false);
    }
  }, [currentUserId, selectedUserId, isForSelf, hasAdminPermissions]);

  const handleLeaveTypeChange = (leaveTypeId: number) => {
    if (userId && leaveTypeId)
      leaveTypeService.getExcludedDates(leaveTypeId, { userId }).then((res) => {
        if (res.status === "success") {
          setDatesToExclude(res.data);
        }
      });

    handleInputChange("leaveTypeId", leaveTypeId);
  };

  const fetchUserData = async (targetUserId: number) => {
    try {
      if (!isForSelf) {
        setLoadingUserData(true);
      } else {
        setLoading(true);
      }
      setError(null);

      setLeaveScheme(null);
      setLeaveTypes([]);
      setUserDetails(null);

      const resp = await userService.getUserById(targetUserId);

      console.log("user details response", resp);

      if (!resp.status || !resp.data) {
        throw new Error("Failed to fetch user details");
      }

      const userDetailsData = resp.data.userDetails;
      setUserDetails(userDetailsData);

      if (userDetailsData?.leaveSchemeId) {
        const leaveSchemeResponse = await leaveSchemeService.getLeaveSchemeById(
          userDetailsData?.leaveSchemeId,
          {
            userId: selectedUserId || Number(currentUserId),
          }
        );
        console.log("leave scheme response", leaveSchemeResponse);

        if (leaveSchemeResponse.status === "error")
          throw new Error(leaveSchemeResponse.message);

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
      if (!isForSelf) {
        setLoadingUserData(false);
      } else {
        setLoading(false);
      }
    }
  };

  const handleUserSelection = (userId: string) => {
    if (!hasAdminPermissions) {
      toast.error(
        "You don't have permission to create leave requests on behalf of other users."
      );
      return;
    }

    const id = parseInt(userId);
    setSelectedUserId(id);

    resetForm();
    if (formErrors.selectedUserId) {
      setFormErrors((prev) => ({
        ...prev,
        selectedUserId: undefined,
      }));
    }
  };

  const minDate = useMemo(() => {
    if (!userDetails?.joiningDate) return new Date();

    const joiningDate = new Date(userDetails.joiningDate);
    const today = new Date();

    return joiningDate > today ? joiningDate : today;
  }, [userDetails?.joiningDate]);

  const calculateDuration = () => {
    if (!formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24)) + 1;

    if (diffDays === 1) {
      let duration = 1;

      if (formData.isStartHalfDay && formData.isEndHalfDay) {
        if (
          formData.halfDayTypeStart === "first-half" &&
          formData.halfDayTypeEnd === "second-half"
        ) {
          duration = 1;
        } else if (formData.halfDayTypeStart === formData.halfDayTypeEnd) {
          duration = 0.5;
        }
      } else if (formData.isStartHalfDay || formData.isEndHalfDay) {
        duration = 0.5;
      }

      return duration;
    }

    let duration = diffDays;
    if (formData.isStartHalfDay) duration -= 0.5;
    if (formData.isEndHalfDay) duration -= 0.5;

    return duration > 0 ? duration : 0;
  };

  const duration = calculateDuration();

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!isForSelf && !hasAdminPermissions) {
      toast.error(
        "You don't have permission to create leave requests on behalf of other users."
      );
      return false;
    }

    if (!isForSelf && !selectedUserId) {
      errors.selectedUserId = "Please select a user";
    }

    if (!formData.leaveTypeId || formData.leaveTypeId <= 0) {
      errors.leaveTypeId = "Select a leave type";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    } else {
      const startDate = new Date(formData.startDate);
      startDate.setHours(0, 0, 0, 0);
      if (startDate < today && isForSelf) {
        errors.startDate = "Start date cannot be in the past";
      }
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    } else if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      if (endDate < startDate) {
        errors.endDate = "End date must be after or equal to start date";
      }
    }

    if (duration <= 0) {
      errors.endDate = "Invalid leave duration";
    } else if (duration > 365) {
      errors.endDate = "Leave duration cannot exceed 365 days";
    }

    if (!formData.reason.trim()) {
      errors.reason = "Reason is required";
    } else if (formData.reason.trim().length < 10) {
      errors.reason = "Reason must be at least 10 characters";
    } else if (formData.reason.trim().length > 1000) {
      errors.reason = "Reason must not exceed 1000 characters";
    }

    if (formData.isStartHalfDay && !formData.halfDayTypeStart) {
      errors.halfDayTypeStart = "Please select start half-day type";
    }

    if (formData.isEndHalfDay && !formData.halfDayTypeEnd) {
      errors.halfDayTypeEnd = "Please select end half-day type";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | boolean | Date | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (
    field: "isStartHalfDay" | "isEndHalfDay",
    checked: boolean
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: checked };

      if (!checked) {
        if (field === "isStartHalfDay") {
          newData.halfDayTypeStart = undefined;
        } else {
          newData.halfDayTypeEnd = undefined;
        }
      }

      return newData;
    });

    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
        ...(field === "isStartHalfDay" && !checked
          ? { halfDayTypeStart: undefined }
          : {}),
        ...(field === "isEndHalfDay" && !checked
          ? { halfDayTypeEnd: undefined }
          : {}),
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      leaveTypeId: 0,
      startDate: null,
      endDate: null,
      reason: "",
      isStartHalfDay: false,
      isEndHalfDay: false,
      halfDayTypeStart: undefined,
      halfDayTypeEnd: undefined,
    });
    setFormErrors({});
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isForSelf && !hasAdminPermissions) {
      toast.error(
        "You don't have permission to create leave requests on behalf of other users."
      );
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (!userDetails || !userId) {
      toast.error("User details not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: LeaveRequestPayload = {
        leaveTypeId: formData.leaveTypeId,
        startDate: formatDateForBackend(formData.startDate!),
        endDate: formatDateForBackend(formData.endDate!),
        duration,
        reason: formData.reason.trim(),
      };

      console.log("leave apply payload", payload);

      const response = isForSelf
        ? await generalService.createLeaveRequest(payload)
        : await leaveRequestService.createLeaveRequest({ ...payload, userId });

      if (response.status === "success") {
        toast.success(response.message);
        resetForm();
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <FaSpinner className="fa-spin fs-1 text-primary mb-3" />
                <h5>Loading leave information...</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && (isForSelf || (!isForSelf && !hasAdminPermissions))) {
    return (
      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error}</p>
              {isForSelf && (
                <button
                  className="btn btn-outline-danger"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const selectedLeaveType = leaveTypes.find(
    (lt) => lt.id === formData.leaveTypeId
  );

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white py-3">
              <h4 className="mb-0 d-flex align-items-center">
                <FaCalendarAlt className="me-2" />
                {isForSelf ? "Apply for Leave" : "Create Leave Request"}
              </h4>
            </div>
            <div className="card-body p-4">
              {hasAdminPermissions && (
                <div className="d-flex gap-3 mb-2">
                  <input
                    className=""
                    id="applyFor"
                    type="checkbox"
                    checked={!isForSelf}
                    onChange={() => setIsForSelf(!isForSelf)}
                  />
                  <label htmlFor="applyFor" className="fs-5">
                    Apply for others
                  </label>
                </div>
              )}
              {/* Admin Mode Info */}
              {!isForSelf && hasAdminPermissions && adminPermissionType && (
                <div className="alert alert-info mb-4">
                  <FaInfoCircle className="me-2" />
                  You are creating a leave request as{" "}
                  <strong>{adminPermissionType}</strong>
                </div>
              )}

              {!isForSelf && hasAdminPermissions && (
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    <FaUser className="me-2" />
                    Select User
                  </label>
                  <Select
                    placeholder="Select User to apply Leave"
                    options={users}
                    value={users.find((i) => i.value === selectedUserId)}
                    onChange={(e) =>
                      handleUserSelection(e?.value.toString() || "")
                    }
                    className={` ${
                      formErrors.selectedUserId ? "is-invalid" : ""
                    }`}
                    isMulti={false}
                  />

                  {formErrors.selectedUserId && (
                    <div className="invalid-feedback d-block">
                      {formErrors.selectedUserId}
                    </div>
                  )}
                </div>
              )}

              {loadingUserData && (
                <div className="text-center py-4">
                  <FaSpinner className="fa-spin fs-3 text-primary" />
                  <p className="mt-2">Loading user information...</p>
                </div>
              )}

              {(isForSelf ||
                (!loadingUserData &&
                  selectedUserId &&
                  hasAdminPermissions)) && (
                <>
                  {/* Leave Scheme Info */}
                  {leaveScheme && (
                    <div className="alert alert-info mb-4">
                      <h6 className="mb-1">
                        {isForSelf
                          ? "Your"
                          : `${
                              users.find((u) => u.value === selectedUserId)
                                ?.label
                            }'s`}{" "}
                        Leave Scheme: {leaveScheme.name}
                      </h6>
                    </div>
                  )}

                  {/* Error display for no leave scheme */}
                  {error && !isForSelf && (
                    <div className="alert alert-warning mb-4">
                      <FaInfoCircle className="me-2" />
                      {error}
                    </div>
                  )}

                  {/* Show form only if leave scheme exists */}
                  {leaveScheme && (
                    <form onSubmit={onSubmit} noValidate>
                      {/* Leave Type */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          Leave Type
                        </label>
                        <select
                          value={formData.leaveTypeId}
                          onChange={(e) =>
                            handleLeaveTypeChange(Number(e.target.value))
                          }
                          className={`form-select ${
                            formErrors.leaveTypeId ? "is-invalid" : ""
                          }`}
                        >
                          <option value={0}>-- Select Leave Type --</option>
                          {leaveTypes.map((lt) => (
                            <option
                              key={lt.id}
                              value={lt.id}
                              disabled={!lt.remainingDays}
                            >
                              {lt.name}
                              {` - Max: ${lt.maxDays || 0} days`}
                              {` - Remaining: ${lt.remainingDays || 0} days`}
                            </option>
                          ))}
                        </select>
                        {formErrors.leaveTypeId && (
                          <div className="invalid-feedback d-block">
                            {formErrors.leaveTypeId}
                          </div>
                        )}
                      </div>

                      {/* Leave Type Description */}
                      {selectedLeaveType && (
                        <div className="alert alert-info d-flex align-items-center mb-4 p-3">
                          <FaInfoCircle className="me-2 flex-shrink-0" />
                          <div>
                            <div>{selectedLeaveType.description}</div>
                            {selectedLeaveType.maxDays && (
                              <small className="text-muted">
                                Maximum allowed: {selectedLeaveType.maxDays}{" "}
                                days
                              </small>
                            )}
                            {selectedLeaveType.remainingDays !== undefined && (
                              <small className="text-muted d-block">
                                Remaining balance:{" "}
                                {selectedLeaveType.remainingDays || 0} days
                              </small>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Dates */}
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            Start Date
                          </label>
                          <DatePicker
                            selected={formData.startDate}
                            onChange={(date: Date | null) =>
                              handleInputChange("startDate", date)
                            }
                            minDate={isForSelf ? minDate : new Date(0)}
                            className={`form-control ${
                              formErrors.startDate ? "is-invalid" : ""
                            }`}
                            excludeDates={datesToExclude.map(
                              (p) => new Date(p)
                            )}
                            filterDate={(d) =>
                              d.getDay() !==
                              convertDayNameToInt(
                                userDetails?.weekoff || "SUNDAY"
                              )
                            }
                            placeholderText="Select start date"
                            dateFormat="MMMM d, yyyy"
                          />
                          {formErrors.startDate && (
                            <div className="invalid-feedback d-block">
                              {formErrors.startDate}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6">
                          <label className="form-label fw-semibold">
                            End Date
                          </label>
                          <DatePicker
                            selected={formData.endDate}
                            onChange={(date: Date | null) =>
                              handleInputChange("endDate", date)
                            }
                            excludeDates={datesToExclude.map(
                              (p) => new Date(p)
                            )}
                            minDate={formData.startDate || new Date(0)}
                            className={`form-control ${
                              formErrors.endDate ? "is-invalid" : ""
                            }`}
                            filterDate={(d) =>
                              d.getDay() !==
                              convertDayNameToInt(
                                userDetails?.weekoff || "SUNDAY"
                              )
                            }
                            placeholderText="Select end date"
                            dateFormat="MMMM d, yyyy"
                          />
                          {formErrors.endDate && (
                            <div className="invalid-feedback d-block">
                              {formErrors.endDate}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Half Day Options */}
                      <div className="mb-4">
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            checked={formData.isStartHalfDay}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "isStartHalfDay",
                                e.target.checked
                              )
                            }
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

                        {formData.isStartHalfDay && (
                          <div className="ps-3 mb-3">
                            <div className="d-flex flex-wrap gap-3">
                              {["first-half", "second-half"].map((val) => (
                                <div className="form-check" key={val}>
                                  <input
                                    type="radio"
                                    name="halfDayTypeStart"
                                    value={val}
                                    checked={formData.halfDayTypeStart === val}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "halfDayTypeStart",
                                        e.target.value as
                                          | "first-half"
                                          | "second-half"
                                      )
                                    }
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
                            {formErrors.halfDayTypeStart && (
                              <div className="invalid-feedback d-block mt-1">
                                {formErrors.halfDayTypeStart}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="form-check mb-3">
                          <input
                            type="checkbox"
                            checked={formData.isEndHalfDay}
                            onChange={(e) =>
                              handleCheckboxChange(
                                "isEndHalfDay",
                                e.target.checked
                              )
                            }
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

                        {formData.isEndHalfDay && (
                          <div className="ps-3 mb-3">
                            <div className="d-flex flex-wrap gap-3">
                              {["first-half", "second-half"].map((val) => (
                                <div className="form-check" key={val}>
                                  <input
                                    type="radio"
                                    name="halfDayTypeEnd"
                                    value={val}
                                    checked={formData.halfDayTypeEnd === val}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "halfDayTypeEnd",
                                        e.target.value as
                                          | "first-half"
                                          | "second-half"
                                      )
                                    }
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
                            {formErrors.halfDayTypeEnd && (
                              <div className="invalid-feedback d-block mt-1">
                                {formErrors.halfDayTypeEnd}
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
                          value={formData.reason}
                          onChange={(e) =>
                            handleInputChange("reason", e.target.value)
                          }
                          className={`form-control ${
                            formErrors.reason ? "is-invalid" : ""
                          }`}
                          rows={4}
                          placeholder="Please provide details about your leave request"
                          maxLength={1000}
                        />
                        <div className="form-text">
                          {formData.reason.length}/1000 characters
                        </div>
                        {formErrors.reason && (
                          <div className="invalid-feedback d-block">
                            {formErrors.reason}
                          </div>
                        )}
                      </div>

                      {/* Duration Display */}
                      <div className="alert alert-secondary mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-semibold">
                            Calculated Duration:
                          </span>
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
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeave;
