import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { fetchUserPermissions } from "../../../../features/auth.slice";
import { RiDashboardFill } from "react-icons/ri";
import { FaWpforms } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { CiMenuFries } from "react-icons/ci";
import { BsChatRightText } from "react-icons/bs";
import { RxVideo } from "react-icons/rx";
import { FaLayerGroup } from "react-icons/fa6";
import { GrGroup } from "react-icons/gr";
import styles from "./styles.module.scss";

type Props = {
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
};

const HrmSideBar = ({ isOpen, setIsOpen }: Props) => {
  const currentUser = useAppSelector((s) => s.auth.userData?.user);
  const dispatch = useAppDispatch();

  const permissions = currentUser?.permissions;
  const isAdmin = permissions?.some((p) =>
    ["is_admin", "is_hr", "is_admin_team", "is_admin_department"].includes(p)
  );

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchUserPermissions(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  const navigationItems = [
    {
      path: "/hrm/dashboard",
      icon: RiDashboardFill,
      label: "Dashboard",
      show: true,
    },
    {
      path: "/hrm/leave",
      icon: MdOutlineInventory2,
      label: "Leave",
      show: true,
    },
    {
      path: "/hrm/attendance",
      icon: FaWpforms,
      label: "Attendance",
      show: true,
    },
    {
      path: "/hrm/users/list",
      icon: GrGroup,
      label: "Users",
      show: isAdmin,
    },
    {
      path: "/hrm/department-management",
      icon: FaLayerGroup,
      label: "Departments",
      show: isAdmin,
    },
  ];

  const appItems = [
    {
      path: "/",
      icon: RxVideo,
      label: "eVideo",
      show: isAdmin,
    },
    {
      path: "/chats",
      icon: BsChatRightText,
      label: "Chats",
      show: isAdmin,
    },
  ];

  return (
    <div
      className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>
            <img src={"/fire-fist.png"} width={50} height={50} />
          </span>
          {isOpen && <span className={styles.logoText}>eDesk</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.menuButton + " btn border-0"}
          aria-label="Toggle menu"
        >
          <CiMenuFries />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          {isOpen && <div className={styles.sectionTitle}>NAVIGATION</div>}
          <nav className={styles.nav}>
            {navigationItems
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.active : ""}`
                    }
                    title={!isOpen ? item.label : undefined}
                  >
                    <span className={styles.iconWrapper}>
                      <Icon />
                    </span>
                    {isOpen && (
                      <span className={styles.label}>{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
          </nav>
        </div>

        <div className={styles.section}>
          {isOpen && <div className={styles.sectionTitle}>SERVICES</div>}
          <nav className={styles.nav}>
            {appItems
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.active : ""}`
                    }
                    title={item.label}
                  >
                    <span className={styles.iconWrapper}>
                      <Icon />
                    </span>
                    {isOpen && (
                      <span className={styles.label}>{item.label}</span>
                    )}
                  </NavLink>
                );
              })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HrmSideBar;
