import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { setDepartments } from "../../../features/department.slice";
import departmentService from "../../../services/api-services/department.service";

// Add slugify utility function
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};

const DepartmentForm = () => {
  const [name, setName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector(
    (state: RootState) => state.department.departments 
  );

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const slug = slugify(name);
      try {
        const response = await departmentService.createDepartment(
          {name,slug,responsibilities}
        );
        dispatch(setDepartments([...departments, response.data]));
      } catch (error) {
        console.log("Failed to create department:", error);
      }
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
