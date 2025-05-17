// pages/department-management.tsx
import { useState, useEffect } from "react";
import { FaUsers } from "react-icons/fa";
import DepartmentSidebar from "./components/department-sidebar";
import DepartmentList from "./components/department-list";
import { Department, User } from "../../types/department-team.types";
import DepartmentTeamService from "../../services/api-services/department-team.service";
import { Link } from "react-router-dom";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" },
  ]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await DepartmentTeamService.getDepartments();
        setDepartments(response.data);
      } catch (err) {
        setError("Failed to load departments");
        console.error("Error fetching departments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Loading departments...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center m-5">{error}</div>;
  }

  const handleAddDepartment = async (departmentData: {
    name: string;
    slug: string;
    responsibilities: string;
  }) => {
    try {
      const response = await DepartmentTeamService.createDepartment(
        departmentData
      );

      setDepartments([...departments, response.data]);
    } catch (error) {
      console.log("Failed to create department:", error);
    }
  };

  const handleAddTeam = (
    departmentId: string,
    teamName: string,
    responsibilities: string
  ) => {
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
                responsibilities,
                members: [],
              },
            ],
          };
        }
        return dept;
      })
    );
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
              if (
                team.id === teamId &&
                !team.members.some((m) => m.id === user.id)
              ) {
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

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };
  // Keep other handlers (deleteDepartment, deleteTeam, addMember) the same

  return (
    <div className="container p-4">
      <div className="row g-4">
      <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaUsers className="me-2" />
          Departments & Teams
        </h5>
        <div>
          <Link to="/hrm/user-department" className="btn btn-light me-2">
            Assign Users
          </Link>
        </div>
      </div>
        <DepartmentSidebar
          departments={departments}
          onAddDepartment={handleAddDepartment}
          onAddTeam={handleAddTeam}
        />

        <div className="col-lg-9">
          <div className="card shadow">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <FaUsers className="me-2 fs-4" />
                Departments & Teams
              </h5>
            </div>
            <div className="card-body p-0">
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
