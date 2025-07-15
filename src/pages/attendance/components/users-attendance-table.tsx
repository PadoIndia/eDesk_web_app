import React, {
  useEffect,
  useState,
  useMemo,
  lazy,
  useRef,
  useCallback,
} from "react";
import {
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarTimes,
  FaClock,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronUp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { UserAttendanceItem } from "../../../types/attendance-dashboard.types";
import attendanceDashboardService from "../../../services/api-services/attendance-dashboard.service";
import Avatar from "../../../components/avatar";
import { SearchBox } from "../../../components/ui/search";
import { Colors } from "../../../utils/constants";
import { Table } from "../../../components/ui/table";

const UserDetailedAttendance = lazy(() => import("./detailed-attendance"));

type SortField =
  | "name"
  | "department"
  | "presentDays"
  | "absentDays"
  | "leaveDays"
  | "missPunchCount"
  | "todayStatus";

type SortDirection = "asc" | "desc";

const UsersAttendanceTable = () => {
  const [users, setUsers] = useState<UserAttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [expandedHeights, setExpandedHeights] = useState<
    Record<number, number>
  >({});
  const detailRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    resizeObserverRef.current = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const userId = Number(entry.target.getAttribute("data-user-id"));
        if (!isNaN(userId) && expandedRows.has(userId)) {
          setExpandedHeights((prev) => ({
            ...prev,
            [userId]: entry.contentRect.height,
          }));
        }
      });
    });

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [expandedRows]);

  const updateHeight = useCallback((userId: number) => {
    const element = detailRefs.current[userId];
    if (element && resizeObserverRef.current) {
      resizeObserverRef.current.observe(element);

      setTimeout(() => {
        const height = element.scrollHeight;
        setExpandedHeights((prev) => ({ ...prev, [userId]: height }));
      }, 100);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [month, year]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await attendanceDashboardService.getDepartmentUsers(
        month,
        year
      );

      if (response.status === "success" && response.data) {
        setUsers(response.data);
      } else {
        toast.error("Failed to fetch users attendance data");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching attendance data");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleRowExpansion = (userId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);

        if (detailRefs.current[userId] && resizeObserverRef.current) {
          resizeObserverRef.current.unobserve(detailRefs.current[userId]);
        }
        setExpandedHeights((prev) => ({ ...prev, [userId]: 0 }));
      } else {
        newSet.add(userId);

        setTimeout(() => updateHeight(userId), 50);
      }
      return newSet;
    });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(lowerSearchTerm) ||
          user.department.toLowerCase().includes(lowerSearchTerm) ||
          user.todayStatus.toLowerCase().includes(lowerSearchTerm)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toString().toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [users, searchTerm, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <FaSort className="text-muted ms-1" size={12} />;
    }
    return sortDirection === "asc" ? (
      <FaSortUp className="text-primary ms-1" size={12} />
    ) : (
      <FaSortDown className="text-primary ms-1" size={12} />
    );
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("present")) {
      return (
        <span className="badge bg-success rounded-pill px-3">{status}</span>
      );
    } else if (statusLower.includes("absent")) {
      return (
        <span className="badge bg-danger rounded-pill px-3">{status}</span>
      );
    } else if (statusLower.includes("leave")) {
      return (
        <span className="badge bg-warning text-dark rounded-pill px-3">
          {status}
        </span>
      );
    } else if (
      statusLower.includes("holiday") ||
      statusLower.includes("weekend")
    ) {
      return <span className="badge bg-info rounded-pill px-3">{status}</span>;
    } else if (statusLower.includes("late")) {
      return (
        <span className="badge bg-orange rounded-pill px-3">{status}</span>
      );
    } else {
      return (
        <span className="badge bg-secondary rounded-pill px-3">{status}</span>
      );
    }
  };

  const getTotalStats = () => {
    const stats = filteredAndSortedUsers.reduce(
      (acc, user) => {
        acc.totalPresent += user.presentDays;
        acc.totalAbsent += user.absentDays;
        acc.totalLeave += user.leaveDays;
        acc.totalMissPunch += user.missPunchCount;
        return acc;
      },
      { totalPresent: 0, totalAbsent: 0, totalLeave: 0, totalMissPunch: 0 }
    );

    return stats;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-20">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted animate-pulse">Loading attendance data...</p>
        </div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="card rounded-lg" style={{ border: "1px solid #f1f1f1" }}>
      <div className="card-body p-6">
        <div className="row mb-6">
          <div className="col-lg-6 d-flex gap-3 mb-4 mb-lg-0">
            <div className="col-6">
              <SearchBox
                placeholder="Search by name,department"
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <div className="col-6 d-flex align-items-center gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(+e.target.value)}
                className="form-select form-select-sm"
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(+e.target.value)}
                className="form-select form-select-sm"
              >
                {Array.from(
                  { length: 10 },
                  (_, i) => new Date().getFullYear() - 5 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="d-flex justify-content-lg-end flex-wrap gap-2">
              <div className="badge bg-light text-dark p-3 rounded-lg hover-shadow-sm">
                <FaCheckCircle className="text-success me-2" />
                Present:{" "}
                <strong className="text-gradient-success">
                  {stats.totalPresent}
                </strong>
              </div>
              <div className="badge bg-light text-dark p-3 rounded-lg hover-shadow-sm">
                <FaTimesCircle className="text-danger me-2" />
                Absent:{" "}
                <strong className="text-gradient-danger">
                  {stats.totalAbsent}
                </strong>
              </div>
              <div className="badge bg-light text-dark p-3 rounded-lg hover-shadow-sm">
                <FaCalendarTimes className="text-warning me-2" />
                Leave:{" "}
                <strong className="text-gradient-warning">
                  {stats.totalLeave}
                </strong>
              </div>
              <div className="badge bg-light text-dark p-3 rounded-lg hover-shadow-sm">
                <FaClock className="text-info me-2" />
                Miss Punch:{" "}
                <strong className="text-gradient-info">
                  {stats.totalMissPunch}
                </strong>
              </div>
            </div>
          </div>
        </div>

        <Table.Container>
          <Table>
            <Table.Head>
              <Table.Row className="border-0">
                <Table.Header
                  className="bg-light rounded-tl-md"
                  style={{ width: "40px", fontSize: "14px" }}
                >
                  ID
                </Table.Header>
                <Table.Header
                  className="text-nowrap cursor-pointer bg-light hover-bg-primary hover-text-white"
                  onClick={() => handleSort("name")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Employee
                    {getSortIcon("name")}
                  </small>
                </Table.Header>
                <Table.Header
                  className="text-nowrap cursor-pointer bg-light hover-bg-primary hover-text-white"
                  onClick={() => handleSort("department")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Department
                    {getSortIcon("department")}
                  </small>
                </Table.Header>
                <Table.Header
                  className="text-nowrap text-center cursor-pointer bg-light hover-bg-primary hover-text-white"
                  onClick={() => handleSort("presentDays")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Present
                    {getSortIcon("presentDays")}
                  </small>
                </Table.Header>
                <Table.Header
                  className="text-nowrap text-center cursor-pointer bg-light hover-bg-primary hover-text-white"
                  onClick={() => handleSort("absentDays")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Absent
                    {getSortIcon("absentDays")}
                  </small>
                </Table.Header>
                <Table.Header
                  className="text-nowrap text-center cursor-pointer bg-light hover-bg-primary hover-text-white"
                  onClick={() => handleSort("leaveDays")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Leave
                    {getSortIcon("leaveDays")}
                  </small>
                </Table.Header>
                <Table.Header
                  className="text-nowrap text-center cursor-pointer bg-light hover-bg-primary hover-text-white"
                  onClick={() => handleSort("missPunchCount")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Miss Punch
                    {getSortIcon("missPunchCount")}
                  </small>
                </Table.Header>
                <Table.Header
                  className="text-nowrap cursor-pointer bg-light rounded-tr-md hover-bg-primary hover-text-white"
                  onClick={() => handleSort("todayStatus")}
                  style={{ cursor: "pointer", fontSize: "14px" }}
                >
                  <small className="text-uppercase fw-bold">
                    Today's Status
                    {getSortIcon("todayStatus")}
                  </small>
                </Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredAndSortedUsers.length === 0 ? (
                <Table.Row>
                  <Table.Cell colSpan={8} className="text-center py-10">
                    <div className="text-muted">
                      <FaUser className="mb-3 animate-bounce" size={48} />
                      <h5 className="mb-1">No employees found</h5>
                      {searchTerm && (
                        <p className="mb-0">
                          Try adjusting your search criteria
                        </p>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              ) : (
                filteredAndSortedUsers.flatMap((user) => {
                  const isExpanded = expandedRows.has(user.id);
                  return [
                    <Table.Row
                      key={user.id}
                      className={`hover-shadow-sm ${
                        isExpanded ? "bg-light" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <Table.Cell
                        className="text-center"
                        onClick={() => toggleRowExpansion(user.id)}
                      >
                        <button className="btn border-0 text-primary p-0">
                          <FaChevronUp
                            size={14}
                            style={{
                              rotate: isExpanded ? "180deg" : "0deg",
                              transition: "all 200ms ease-in-out",
                            }}
                          />
                        </button>
                      </Table.Cell>
                      <Table.Cell onClick={() => toggleRowExpansion(user.id)}>
                        <div className="d-flex align-items-center py-2">
                          <div>
                            <Avatar
                              fontSize={14}
                              bgColor={Colors.BGColorList[5]}
                              title={user.name}
                              imageUrl={user.thumbnail}
                            />
                          </div>
                          <div className="ms-3">
                            <div className="fw-semibold text-dark">
                              {user.name}
                            </div>
                            <small className="text-muted">ID: {user.id}</small>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell onClick={() => toggleRowExpansion(user.id)}>
                        <span className="text-secondary fw-medium">
                          {user.department}
                        </span>
                      </Table.Cell>
                      <Table.Cell
                        className="text-center"
                        onClick={() => toggleRowExpansion(user.id)}
                      >
                        <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-1 shadow-sm">
                          <FaCheckCircle
                            className="text-success me-1"
                            size={14}
                          />
                          <span className="fw-bold text-success">
                            {user.presentDays}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell
                        className="text-center"
                        onClick={() => toggleRowExpansion(user.id)}
                      >
                        <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-1 shadow-sm">
                          <FaTimesCircle
                            className="text-danger me-1"
                            size={14}
                          />
                          <span className="fw-bold text-danger">
                            {user.absentDays}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell
                        className="text-center"
                        onClick={() => toggleRowExpansion(user.id)}
                      >
                        <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-1 shadow-sm">
                          <FaCalendarTimes
                            className="text-warning me-1"
                            size={14}
                          />
                          <span className="fw-bold text-warning">
                            {user.leaveDays}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell
                        className="text-center"
                        onClick={() => toggleRowExpansion(user.id)}
                      >
                        <div className="d-inline-flex align-items-center bg-light rounded-pill px-3 py-1 shadow-sm">
                          <FaClock className="text-info me-1" size={14} />
                          <span className="fw-bold text-info">
                            {user.missPunchCount}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell onClick={() => toggleRowExpansion(user.id)}>
                        {getStatusBadge(user.todayStatus)}
                      </Table.Cell>
                    </Table.Row>,

                    <Table.Row key={`${user.id}-detail`}>
                      <Table.Cell colSpan={8} className="p-0">
                        <div
                          style={{
                            height: isExpanded
                              ? expandedHeights[user.id] || "auto"
                              : 0,
                            overflow: "hidden",
                            transition:
                              "height 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                          }}
                        >
                          <div
                            ref={(el) => {
                              detailRefs.current[user.id] = el;
                              if (
                                el &&
                                isExpanded &&
                                !expandedHeights[user.id]
                              ) {
                                updateHeight(user.id);
                              }
                            }}
                            data-user-id={user.id}
                          >
                            {isExpanded && (
                              <div className="bg-white border-top border-bottom p-4">
                                <React.Suspense
                                  fallback={
                                    <div className="text-center py-3">
                                      <div
                                        className="spinner-border spinner-border-sm"
                                        role="status"
                                      >
                                        <span className="visually-hidden">
                                          Loading...
                                        </span>
                                      </div>
                                    </div>
                                  }
                                >
                                  <UserDetailedAttendance
                                    userId={user.id}
                                    fromMonth={month}
                                    fromYear={year}
                                  />
                                </React.Suspense>
                              </div>
                            )}
                          </div>
                        </div>
                      </Table.Cell>
                    </Table.Row>,
                  ];
                })
              )}
            </Table.Body>
          </Table>
        </Table.Container>

        {filteredAndSortedUsers.length > 0 && (
          <div className="mt-6 d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing <strong>{filteredAndSortedUsers.length}</strong> of{" "}
              <strong>{users.length}</strong> employees
            </small>
            {month && year && (
              <small className="text-muted">
                Attendance for{" "}
                <strong className="text-gradient-primary">
                  {new Date(year, month - 1).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </strong>
              </small>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAttendanceTable;
