// import React from "react";

// interface MissPunchFormProps {
//   formData: {
//     name: string;
//     date: string;
//     time: string;
//     reason: string;
//   };
//   setFormData: (data: { name: string; date: string; time: string; reason: string }) => void;
//   handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
//   setShowMissPunchForm: (show: boolean) => void;
// }

// const MissPunchForm: React.FC<MissPunchFormProps> = ({
//   formData,
//   setFormData,
//   handleFormSubmit,
//   setShowMissPunchForm
// }) => {
//   return (
//     <div
//       className="modal show d-block"
//       style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header bg-primary text-white">
//             <h5 className="modal-title">Miss Punch Request</h5>
//             <button
//               type="button"
//               className="btn-close btn-close-white"
//               onClick={() => setShowMissPunchForm(false)}
//             />
//           </div>
//           <form onSubmit={handleFormSubmit}>
//             <div className="modal-body">
//               <div className="mb-3">
//                 <label className="form-label">Date</label>
//                 <input
//                   type="date"
//                   className="form-control"
//                   value={formData.date}
//                   onChange={(e) =>
//                     setFormData({ ...formData, date: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Time</label>
//                 <input
//                   type="time"
//                   className="form-control"
//                   value={formData.time}
//                   onChange={(e) =>
//                     setFormData({ ...formData, time: e.target.value })
//                   }
//                   required
//                 />
//               </div>
//               <div className="mb-3">
//                 <label className="form-label">Reason</label>
//                 <textarea
//                   className="form-control"
//                   value={formData.reason}
//                   onChange={(e) =>
//                     setFormData({ ...formData, reason: e.target.value })
//                   }
//                   required
//                   rows={3}
//                 />
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={() => setShowMissPunchForm(false)}
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="btn btn-primary">
//                 Submit Request
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MissPunchForm;



import React from "react";

interface MissPunchFormProps {
  formData: {
    name: string;
    date: string;
    time: string;
    reason: string;
  };
  setFormData: (data: { name: string; date: string; time: string; reason: string }) => void;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setShowMissPunchForm: (show: boolean) => void;
}

const MissPunchForm: React.FC<MissPunchFormProps> = ({
  formData,
  setFormData,
  handleFormSubmit,
  setShowMissPunchForm
}) => {
  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Miss Punch Request</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => setShowMissPunchForm(false)}
              aria-label="Close"
            />
          </div>
          <form onSubmit={handleFormSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="punchDate" className="form-label">Date</label>
                <input
                  id="punchDate"
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="punchTime" className="form-label">Time</label>
                <input
                  id="punchTime"
                  type="time"
                  className="form-control"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="punchReason" className="form-label">Reason</label>
                <textarea
                  id="punchReason"
                  className="form-control"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  required
                  rows={3}
                  placeholder="Please provide a reason for missing the punch"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowMissPunchForm(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!formData.time || !formData.reason}
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MissPunchForm;