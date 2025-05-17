// import { useState } from "react";
// import { FaPlus } from "react-icons/fa";

// interface DepartmentFormProps {
//   onAddDepartment: (name: string, responsibilities: string) => void;
// }

// const DepartmentForm = ({ onAddDepartment }: DepartmentFormProps) => {
//   const [name, setName] = useState("");
//   const [responsibilities, setResponsibilities] = useState("");

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (name.trim()) {
//       onAddDepartment(name, responsibilities);
//       setName("");
//       setResponsibilities("");
//     }
//   };

//   return (
//     <div className="mb-4">
//       <h6>Create New Department</h6>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Department name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>
        
//         <div className="mb-3">
//           <input
//             type="text"
//             className="form-control"
//             placeholder="Department Responsibilities"
//             value={responsibilities}
//             onChange={(e) => setResponsibilities(e.target.value)}
//           />
//           <p className="form-text text-muted mt-1">
//             Separate responsibilities with commas
//           </p>
//         </div>

//         <button className="btn btn-primary w-100" type="submit">
//           <FaPlus className="me-2" />
//           Add Department
//         </button>
//       </form>
//     </div>
//   );
// };

// export default DepartmentForm;



import { useState } from "react";
import { FaPlus } from "react-icons/fa";

// Add slugify utility function
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start
    .replace(/-+$/, '');      // Trim - from end
};

interface DepartmentFormProps {
   onAddDepartment: (department: {
    name: string;
    slug: string;
    responsibilities: string;
  }) => void;
}

const DepartmentForm = ({ onAddDepartment }: DepartmentFormProps) => {
  const [name, setName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const slug = slugify(name);
      onAddDepartment({
        name: name.trim(),
        slug,
        responsibilities
      });
      setName("");
      setResponsibilities("");
    }
  };

  return (
    <div className="mb-4">
      <h6>Create New Department</h6>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Department Responsibilities"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
          <p className="form-text text-muted mt-1">
            Separate responsibilities with commas
          </p>
        </div>

        <button className="btn btn-primary w-100" type="submit">
          <FaPlus className="me-2" />
          Add Department
        </button>
      </form>
    </div>
  );
};

export default DepartmentForm;