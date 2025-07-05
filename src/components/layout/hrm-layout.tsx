import { Outlet } from "react-router-dom";
import styles from "./hrm-layout.module.scss";
import { useState } from "react";
import HrmSideBar from "./sidebar/hrm/hrm-index";

const HrmLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={styles.layout}>
      <HrmSideBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div
        className={`${styles.mainContainer} ${
          !isOpen ? styles.sidebarClosed : ""
        }`}
      >
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default HrmLayout;
