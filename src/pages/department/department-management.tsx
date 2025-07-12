import { lazy, useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";
import { HiMiniRectangleGroup } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchUserPermissions } from "../../features/auth.slice";

const AccessDenied = lazy(
  () => import("../../components/layout/errors/access-denied")
);
const DepartmentTable = lazy(() => import("./components/department-table"));
const TeamTable = lazy(() => import("./components/team-table"));

type Tab = "departments" | "teams";

const DepartmentManagement = () => {
  const [activeTab, setActiveTab] = useState<Tab>("departments");
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const dispatch = useAppDispatch();

  const permissions =
    useAppSelector((s) => s.auth.userData?.user.permissions) || [];
  const haveAccess =
    permissions.includes("is_admin") ||
    permissions.includes("can_manage_department_team");

  useEffect(() => {
    if (userId) dispatch(fetchUserPermissions(userId));
  }, []);

  const canViewDepts =
    haveAccess ||
    permissions.some((e) =>
      ["is_admin_team", "is_admin_department"].includes(e)
    );

  return (
    <div className="p-2">
      {canViewDepts ? (
        <>
          <div
            className="rounded-lg mx-2 bg-white mb-2"
            style={{ border: "1px solid #f1f1f1" }}
          >
            <div className="d-flex gap-2 p-3">
              <button
                className={`btn ${
                  activeTab === "departments"
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setActiveTab("departments")}
              >
                <FaLayerGroup className="me-1" /> Departments
              </button>

              <button
                className={`btn ${
                  activeTab === "teams"
                    ? "btn-primary"
                    : "btn-outline-secondary"
                }`}
                onClick={() => setActiveTab("teams")}
              >
                <HiMiniRectangleGroup className="me-1" /> Teams
              </button>
            </div>
          </div>
          <div
            className="rounded-lg mx-2 bg-white"
            style={{ border: "1px solid #f1f1f1" }}
          >
            {activeTab === "departments" ? (
              <DepartmentTable haveAccess={haveAccess} />
            ) : (
              <TeamTable haveAccess={haveAccess} />
            )}
          </div>
        </>
      ) : (
        <AccessDenied />
      )}
    </div>
  );
};

export default DepartmentManagement;
