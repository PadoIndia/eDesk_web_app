import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import DepartmentSidebar from "./components/department-sidebar";
import DepartmentList from "./components/department-list";
import { Department, User} from "../../types/department-team.types";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" },
  ]);

  const handleAddDepartment = (name: string) => {
    if (!departments.some((d) => d.name === name)) {
      setDepartments([
        ...departments,
        {
          id: Date.now().toString(),
          name,
          teams: [],
        },
      ]);
    }
  };

  const handleAddTeam = (departmentId: string, teamName: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            teams: [
              ...dept.teams,
              {
                id: Date.now().toString(),
                name: teamName,
                members: [],
              },
            ],
          };
        }
        return dept;
      })
    );
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  const handleDeleteTeam = (deptId: string, teamId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            teams: dept.teams.filter((t) => t.id !== teamId),
          };
        }
        return dept;
      })
    );
  };

  const handleAddMember = (deptId: string, teamId: string, user: User) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            teams: dept.teams.map((team) => {
              if (team.id === teamId && !team.members.some((m) => m.id === user.id)) {
                return {
                  ...team,
                  members: [...team.members, user],
                };
              }
              return team;
            }),
          };
        }
        return dept;
      })
    );
  };

  return (
    <div className="container p-4">
      <div className="row">
        <DepartmentSidebar
          departments={departments}
          onAddDepartment={handleAddDepartment}
          onAddTeam={handleAddTeam}
        />
        
        <div className="col-md-9">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                Departments & Teams
              </h5>
            </div>
            <div className="card-body">
              <DepartmentList
                departments={departments}
                onDeleteDepartment={handleDeleteDepartment}
                onDeleteTeam={handleDeleteTeam}
                onAddMember={handleAddMember}
                users={users}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;