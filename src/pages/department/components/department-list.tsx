import DepartmentItem from "./department-item";
import { Department } from "../../../types/department-team.types";
import departmentService from "../../../services/api-services/department.service";
import departmentTeamService from "../../../services/api-services/department-team.service";
import { useEffect } from "react";
import { setDepartments, setError } from "../../../features/department.slice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";


const DepartmentList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector( (state: RootState) => state.department.departments);
  const error = useSelector((state: RootState) => state.department.error);
  const loading = useSelector((state:RootState)=> state.department.loading);


  useEffect(() => {
    fetchDepartments();
  },[]);

  
  if (loading) {
    return <div className="text-center p-5">Loading departments...</div>;
  }
  if (error) {
    return <div className="alert alert-danger text-center m-5">{error}</div>;
  }
  
  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getDepartments();
      const departmentsWithTeams = await Promise.all(
        response.data.map(async (dept: Department) => {
          const teamsResponse =
            await departmentTeamService.getTeamsByDepartment(dept.id);
          return {
            ...dept,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            teams: teamsResponse.data.map((dt: any) => dt.team),
          };
        })
      );
      dispatch(setDepartments(departmentsWithTeams));
    } catch (err) {
      setError("Failed to load departments");
      console.error("Error fetching departments:", err);
    }
  };
  
  return (
    <>
      {(departments??[]).length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">No departments created yet</h4>
        </div>
      ) : (
        departments.map((dept) => (
          <DepartmentItem
            key={dept.id}
            department={dept}
          />
        ))
      )}
    </>
  );
};

export default DepartmentList;