import React, { HtmlHTMLAttributes } from "react";
import styles from "./styles.module.scss";

export interface BadgeProps extends HtmlHTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
}

export const Badge: React.FC<BadgeProps> = ({
  variant = "default",
  children,
  className,
  ...rest
}) => {
  return (
    <span
      className={`${styles.badge} ${styles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
};
