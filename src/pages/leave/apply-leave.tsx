// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { FaCalendarAlt, FaPaperPlane, FaInfoCircle } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface LeaveType {
//   id: number;
//   name: string;
//   isPaid: boolean;
//   description: string;
// }

// interface FormData {
//   leaveTypeId: number;
//   startDate: Date;
//   endDate: Date;
//   reason: string;
//   isHalfDay: boolean;
//   halfDayType?: 'first-half' | 'second-half';
// }

// const ApplyLeave = () => {
//   const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);

//   // Mock leave types - in a real app, these would come from your API
//   const leaveTypes: LeaveType[] = [
//     { id: 1, name: 'Annual Leave', isPaid: true, description: 'Paid time off for vacations' },
//     { id: 2, name: 'Sick Leave', isPaid: true, description: 'Paid time off for illness' },
//     { id: 3, name: 'Unpaid Leave', isPaid: false, description: 'Unpaid time off' },
//   ];

//   const onSubmit = async (data: FormData) => {
//     setIsSubmitting(true);
//     try {
//       // Calculate duration based on dates and half-day selection
//       const duration = calculateDuration(data.startDate, data.endDate, data.isHalfDay);

//       // Submit to your API
//       console.log({
//         ...data,
//         duration,
//         leaveTypeId: Number(data.leaveTypeId)
//       });

//       alert('Leave application submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting leave:', error);
//       alert('Failed to submit leave application');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const calculateDuration = (start: Date, end: Date, isHalfDay: boolean): number => {
//     // Basic calculation - in a real app, consider weekends/holidays
//     const diffTime = end.getTime() - start.getTime();
//     const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1; // +1 to include both start and end dates
//     return isHalfDay ? diffDays * 0.5 : diffDays;
//   };

//   const handleLeaveTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedId = Number(e.target.value);
//     const type = leaveTypes.find(lt => lt.id === selectedId) || null;
//     setSelectedLeaveType(type);
//   };

//   return (
//     <div className="container py-4">
//       <div className="row justify-content-center">
//         <div className="col-lg-8">
//           <div className="card">
//             <div className="card-header bg-primary text-white">
//               <h2 className="mb-0">Apply for Leave</h2>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 {/* Leave Type Selection */}
//                 <div className="mb-3">
//                   <label className="form-label">Leave Type</label>
//                   <select
//                     {...register('leaveTypeId', { required: 'Leave type is required' })}
//                     className={`form-select ${errors.leaveTypeId ? 'is-invalid' : ''}`}
//                     onChange={handleLeaveTypeChange}
//                   >
//                     <option value="">Select leave type</option>
//                     {leaveTypes.map(type => (
//                       <option key={type.id} value={type.id}>
//                         {type.name} {type.isPaid ? '(Paid)' : '(Unpaid)'}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.leaveTypeId && (
//                     <div className="invalid-feedback">{errors.leaveTypeId.message}</div>
//                   )}
//                   {selectedLeaveType && (
//                     <div className="mt-2 text-muted">
//                       <FaInfoCircle className="me-1" />
//                       <small>{selectedLeaveType.description}</small>
//                     </div>
//                   )}
//                 </div>

//                 {/* Date Selection */}
//                 <div className="row mb-3">
//                   <div className="col-md-6">
//                     <label className="form-label">Start Date</label>
//                     <DatePicker
//                       selected={watch('startDate')}
//                       onChange={(date: Date | null) => date && setValue('startDate', date)}
//                       minDate={new Date()}
//                       className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
//                       placeholderText="Select start date"
//                       required
//                     />
//                     {errors.startDate && (
//                       <div className="invalid-feedback">Start date is required</div>
//                     )}
//                   </div>
//                   <div className="col-md-6">
//                     <label className="form-label">End Date</label>
//                     <DatePicker
//                       selected={watch('endDate')}
//                       onChange={(date: Date | null) => date && setValue('endDate', date)}
//                       minDate={watch('startDate') || new Date()}
//                       className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
//                       placeholderText="Select end date"
//                       required
//                     />
//                     {errors.endDate && (
//                       <div className="invalid-feedback">End date is required</div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Half Day Option */}
//                 <div className="mb-3">
//                   <div className="form-check">
//                     <input
//                       type="checkbox"
//                       {...register('isHalfDay')}
//                       className="form-check-input"
//                       id="halfDayCheck"
//                     />
//                     <label className="form-check-label" htmlFor="halfDayCheck">
//                       Half Day Leave
//                     </label>
//                   </div>

//                   {watch('isHalfDay') && (
//                     <div className="mt-2">
//                       <div className="form-check form-check-inline">
//                         <input
//                           type="radio"
//                           {...register('halfDayType')}
//                           value="first-half"
//                           className="form-check-input"
//                           id="firstHalf"
//                         />
//                         <label className="form-check-label" htmlFor="firstHalf">
//                           First Half (Morning)
//                         </label>
//                       </div>
//                       <div className="form-check form-check-inline">
//                         <input
//                           type="radio"
//                           {...register('halfDayType')}
//                           value="second-half"
//                           className="form-check-input"
//                           id="secondHalf"
//                         />
//                         <label className="form-check-label" htmlFor="secondHalf">
//                           Second Half (Afternoon)
//                         </label>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Reason */}
//                 <div className="mb-4">
//                   <label className="form-label">Reason</label>
//                   <textarea
//                     {...register('reason', {
//                       required: 'Reason is required',
//                       minLength: {
//                         value: 10,
//                         message: 'Reason should be at least 10 characters'
//                       }
//                     })}
//                     rows={4}
//                     className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
//                     placeholder="Enter the reason for your leave"
//                   />
//                   {errors.reason && (
//                     <div className="invalid-feedback">{errors.reason.message}</div>
//                   )}
//                 </div>

//                 {/* Submit Button */}
//                 <div className="d-grid">
//                   <button
//                     type="submit"
//                     disabled={isSubmitting}
//                     className="btn btn-primary"
//                   >
//                     {isSubmitting ? (
//                       <>
//                         <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         <FaPaperPlane className="me-2" />
//                         Submit Leave Application
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplyLeave;

// import React, { useState, useMemo } from 'react';
// import { useForm, Controller, useWatch } from 'react-hook-form';
// import { FaCalendarAlt, FaPaperPlane, FaInfoCircle } from 'react-icons/fa';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// interface LeaveType {
//   id: number;
//   name: string;
//   isPaid: boolean;
//   description: string;
// }

// interface FormData {
//   leaveTypeId: number;
//   startDate: Date;
//   endDate: Date;
//   reason: string;
//   isHalfDay: boolean;
//   halfDayType?: 'first-half' | 'second-half';
// }

// const ApplyLeave: React.FC = () => {
//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>({
//     defaultValues: {
//       leaveTypeId: 0,
//       startDate: undefined,
//       endDate: undefined,
//       reason: '',
//       isHalfDay: false,
//       halfDayType: undefined,
//     },
//   });

//   // Mock data - replace with API fetch
//   const leaveTypes: LeaveType[] = useMemo(() => [
//     { id: 1, name: 'Annual Leave', isPaid: true, description: 'Paid time off for vacations' },
//     { id: 2, name: 'Sick Leave', isPaid: true, description: 'Paid time off for illness' },
//     { id: 3, name: 'Unpaid Leave', isPaid: false, description: 'Unpaid time off' },
//   ], []);

//   const watchIsHalfDay = useWatch({ control, name: 'isHalfDay' });
//   const watchStart = useWatch({ control, name: 'startDate' });
//   const watchEnd = useWatch({ control, name: 'endDate' });

//   const calculateDuration = () => {
//     if (!watchStart || !watchEnd) return 0;
//     const diffTime = watchEnd.getTime() - watchStart.getTime();
//     const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
//     return watchIsHalfDay ? diffDays * 0.5 : diffDays;
//   };

//   const duration = calculateDuration();

//   const onSubmit = async (data: FormData) => {
//     try {
//       const payload = { ...data, duration };
//       console.log('Submitting:', payload);
//       // await api.post('/leave-request', payload);
//       alert('Leave application submitted successfully!');
//     } catch (err) {
//       console.error(err);
//       alert('Submission failed.');
//     }
//   };

//   return (
//     <div className="container py-4">
//       <div className="row justify-content-center">
//         <div className="col-lg-6">
//           <div className="card shadow-sm">
//             <div className="card-header bg-primary text-white">
//               <h4 className="mb-0">Apply for Leave</h4>
//             </div>
//             <div className="card-body">
//               <form onSubmit={handleSubmit(onSubmit)} noValidate>
//                 {/* Leave Type */}
//                 <div className="mb-4">
//                   <label className="form-label">Leave Type</label>
//                   <select
//                     {...register('leaveTypeId', { validate: v => v > 0 || 'Select a leave type' })}
//                     className={`form-select ${errors.leaveTypeId ? 'is-invalid' : ''}`}
//                   >
//                     <option value={0}>-- Select --</option>
//                     {leaveTypes.map(lt => (
//                       <option key={lt.id} value={lt.id}>
//                         {lt.name} {lt.isPaid ? '(Paid)' : '(Unpaid)'}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.leaveTypeId && <div className="invalid-feedback">{errors.leaveTypeId.message}</div>}
//                 </div>

//                 {/* Description */}
//                 <Controller
//                   name="leaveTypeId"
//                   control={control}
//                   render={({ field }) => {
//                     const type = leaveTypes.find(lt => lt.id === field.value);
//                     return (
//                       <>
//                         {type && (
//                           <div className="alert alert-info d-flex align-items-center">
//                             <FaInfoCircle className="me-2" /> {type.description}
//                           </div>
//                         )}
//                       </>
//                     );
//                   }}
//                 />

//                 {/* Dates */}
//                 <div className="row mb-4">
//                   {(['startDate', 'endDate'] as const).map((name) => (
//                     <div className="col-md-6 mb-3" key={name}>
//                       <label className="form-label text-capitalize">
//                         {name === 'startDate' ? 'Start Date' : 'End Date'}
//                       </label>
//                       <Controller<FormData>
//                         name={name}
//                         control={control}
//                         rules={{ required: 'Required' }}
//                         render={({ field: { value, onChange, ...field } }) => (
//                           <DatePicker
//                             {...field}
//                             selected={value as Date}
//                             onChange={(date: Date | null) => onChange(date)}
//                             minDate={name === 'startDate' ? new Date() : watchStart || new Date()}
//                             className={`form-control ${errors[name]?.message ? 'is-invalid' : ''}`}
//                             placeholderText="Select date"
//                           />
//                         )}
//                       />
//                       <div className="invalid-feedback">{errors[name]?.message}</div>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Half Day */}
//                 <div className="mb-4">
//                   <div className="form-check mb-2">
//                     <input type="checkbox" {...register('isHalfDay')} className="form-check-input" id="halfDay" />
//                     <label htmlFor="halfDay" className="form-check-label">
//                       Half Day
//                     </label>
//                   </div>
//                   {watchIsHalfDay && (
//                     <div>
//                       {['first-half', 'second-half'].map(val => (
//                         <div className="form-check form-check-inline" key={val}>
//                           <input
//                             type="radio"
//                             {...register('halfDayType', { required: 'Select half-day type' })}
//                             value={val}
//                             className="form-check-input"
//                             id={val}
//                           />
//                           <label htmlFor={val} className="form-check-label text-capitalize">
//                             {val.replace('-', ' ')}
//                           </label>
//                         </div>
//                       ))}
//                       <div className="invalid-feedback d-block">
//                         {errors.halfDayType && errors.halfDayType.message}
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Reason */}
//                 <div className="mb-4">
//                   <label className="form-label">Reason</label>
//                   <textarea
//                     {...register('reason', { required: 'Reason is required', minLength: { value: 10, message: 'At least 10 characters' } })}
//                     className={`form-control ${errors.reason ? 'is-invalid' : ''}`}
//                     rows={3}
//                   />
//                   {errors.reason && <div className="invalid-feedback">{errors.reason.message}</div>}
//                 </div>

//                 {/* Duration Display */}
//                 <div className="mb-4">
//                   <strong>Calculated Duration: </strong> {duration} day(s)
//                 </div>

//                 {/* Submit */}
//                 <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
//                   {isSubmitting ? (
//                     <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
//                   ) : (
//                     <><FaPaperPlane className="me-2" /> Submit</>
//                   )}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplyLeave;

import React, { useState, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { FaCalendarAlt, FaPaperPlane, FaInfoCircle } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface LeaveType {
  id: number;
  name: string;
  isPaid: boolean;
  description: string;
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
  const {
    register,
    handleSubmit,
    control,
    setValue,
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

  // Mock data - replace with API fetch
  const leaveTypes: LeaveType[] = useMemo(
    () => [
      {
        id: 1,
        name: "Annual Leave",
        isPaid: true,
        description: "Paid time off for vacations",
      },
      {
        id: 2,
        name: "Sick Leave",
        isPaid: true,
        description: "Paid time off for illness",
      },
      {
        id: 3,
        name: "Unpaid Leave",
        isPaid: false,
        description: "Unpaid time off",
      },
    ],
    []
  );

  // const watchStartIsHalfDay = useWatch({ control, name: "isHalfDay" });
  // const watchEndIsHalfDay = useWatch({ control, name: "isHalfDay" });
  // const watchStart = useWatch({ control, name: "startDate" });
  // const watchEnd = useWatch({ control, name: "endDate" });

  // const calculateDuration = () => {
  //   if (!watchStart || !watchEnd) return 0;
  //   const diffTime = watchEnd.getTime() - watchStart.getTime();
  //   const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1;
  //   const totalStartDays = watchStartIsHalfDay ? diffDays - 0.5 : diffDays;
  //   const totalEndDays = watchEndIsHalfDay
  //     ? totalStartDays - 0.5
  //     : totalStartDays;
  //   return totalEndDays;
  // };

  // const duration = calculateDuration();

  // Watchers
  const watchStartIsHalfDay = useWatch({ control, name: "isStartHalfDay" });
  const watchEndIsHalfDay = useWatch({ control, name: "isEndHalfDay" });
  const watchStart = useWatch({ control, name: "startDate" });
  const watchEnd = useWatch({ control, name: "endDate" });
  const watchHalfDayTypeStart = useWatch({ control, name: "halfDayTypeStart" });
  const watchHalfDayTypeEnd = useWatch({ control, name: "halfDayTypeEnd" });

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
    try {
      const payload = { ...data, duration };
      console.log("Submitting:", payload);
      // await api.post('/leave-request', payload);
      alert("Leave application submitted successfully!");
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    }
  };

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
                        {lt.name} {lt.isPaid ? "(Paid)" : "(Unpaid)"}
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
                            <span>{type.description}</span>
                          </div>
                        )}
                      </>
                    );
                  }}
                />

                {/* Dates */}
                {/* <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold p-3">Start Date</label>
                    <Controller<FormData>
                      name="startDate"
                      control={control}
                      rules={{ required: 'Start date is required' }}
                      render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                          {...field}
                          selected={value as Date}
                          onChange={(date: Date | null) => onChange(date)}
                          minDate={new Date()}
                          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
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
                    <label className="form-label fw-semibold p-3">End Date</label>
                    <Controller<FormData>
                      name="endDate"
                      control={control}
                      rules={{ 
                        required: 'End date is required',
                        validate: value => 
                          !watchStart || (value && value >= watchStart) || 
                          'End date must be after start date'
                      }}
                      render={({ field: { value, onChange, ...field } }) => (
                        <DatePicker
                          {...field}
                          selected={value as Date}
                          onChange={(date: Date | null) => onChange(date)}
                          minDate={watchStart || new Date()}
                          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
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
                </div> */}

                {/* Half Day Options */}
                {/* <div className="mb-4">
                  <div className="form-check mb-3">
                    <input 
                      type="checkbox" 
                      {...register('isHalfDay')} 
                      className="form-check-input" 
                      id="halfDay" 
                    />
                    <label htmlFor="halfDay" className="form-check-label fw-semibold">
                      start Half Day Leave
                    </label>
                  </div>
                  
                  {watchStartIsHalfDay && (
                    <div className="ps-3 mb-3">
                      <div className="d-flex flex-wrap gap-3">
                        {['first-half', 'second-half'].map(val => (
                          <div className="form-check" key={val}>
                            <input
                              type="radio"
                              {...register('halfDayType', { required: watchStartIsHalfDay ? 'Please select half-day type' : false })}
                              value={val}
                              className="form-check-input"
                              id={val}
                            />
                            <label htmlFor={val} className="form-check-label text-capitalize">
                              {val.replace('-', ' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.halfDayType && (
                        <div className="invalid-feedback d-block mt-1">
                          {errors.halfDayType.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <div className="form-check mb-3">
                    <input 
                      type="checkbox" 
                      {...register('isHalfDay')} 
                      className="form-check-input" 
                      id="halfDay" 
                    />
                    <label htmlFor="halfDay" className="form-check-label fw-semibold">
                      end Half Day Leave
                    </label>
                  </div>
                  
                  {watchEndIsHalfDay && (
                    <div className="ps-3 mb-3">
                      <div className="d-flex flex-wrap gap-3">
                        {['first-half', 'second-half'].map(val => (
                          <div className="form-check" key={val}>
                            <input
                              type="radio"
                              {...register('halfDayType', { required: watchEndIsHalfDay ? 'Please select half-day type' : false })}
                              value={val}
                              className="form-check-input"
                              id={val}
                            />
                            <label htmlFor={val} className="form-check-label text-capitalize">
                              {val.replace('-', ' ')}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.halfDayType && (
                        <div className="invalid-feedback d-block mt-1">
                          {errors.halfDayType.message}
                        </div>
                      )}
                    </div>
                  )}
                </div> */}

                {/* Dates */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold p-3">
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
                          minDate={new Date()}
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
                    <label className="form-label fw-semibold p-3">
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
                          minDate={watchStart || new Date()}
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
                    disabled={isSubmitting}
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
