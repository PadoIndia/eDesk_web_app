import React from "react";
import styles from "./styles.module.scss";

export interface BadgeProps {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className = "",
}) => {
  return (
    <span className={`${styles.badge} ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};
