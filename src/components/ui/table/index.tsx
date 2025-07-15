import React, {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

interface TableContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`table-responsive ${className}`} {...props}>
      {children}
    </div>
  );
};

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  striped?: boolean;
  bordered?: boolean;
  borderless?: boolean;
  hover?: boolean;
  size?: "sm" | "md";
}

const TableRoot: React.FC<TableProps> = ({
  children,
  className = "",
  striped = false,
  bordered = false,
  borderless = false,
  hover = true,
  size,
  ...props
}) => {
  const classes = [
    "table",
    "align-middle",
    hover && "table-hover",
    striped && "table-striped",
    bordered && "table-bordered",
    borderless && "table-borderless",
    size === "sm" && "table-sm",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <table className={classes} {...props}>
      {children}
    </table>
  );
};

interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
  variant?: "light" | "dark" | "primary" | "secondary" | "white";
}

const TableHead: React.FC<TableHeadProps> = ({
  children,
  className = "",
  variant,
  ...props
}) => {
  const variantClass = variant ? `table-${variant}` : "";
  return (
    <thead className={`${variantClass} ${className}`} {...props}>
      {children}
    </thead>
  );
};

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

const TableBody: React.FC<TableBodyProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "light"
    | "dark";
  active?: boolean;
}

const TableRow: React.FC<TableRowProps> = ({
  children,
  className = "",
  variant,
  active = false,
  ...props
}) => {
  const classes = [
    variant && `table-${variant}`,
    active && "table-active",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
};

interface TableHeaderProps
  extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: "asc" | "desc" | null;
  onSort?: () => void;
  width?: string | number;
}

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  className = "",
  style = {},
  sortable = false,
  sorted = null,
  onSort,
  width,
  ...props
}) => {
  const handleClick = sortable && onSort ? onSort : undefined;
  const cursor = sortable ? "pointer" : undefined;

  return (
    <th
      className={`text-muted ${className}`}
      style={{
        fontSize: "11px",
        textTransform: "uppercase",
        cursor,
        width,
        ...style,
      }}
      onClick={handleClick}
      {...props}
    >
      {children}
      {sortable && (
        <span className="ms-1">
          {sorted === "asc" && "↑"}
          {sorted === "desc" && "↓"}
          {sorted === null && "↕"}
        </span>
      )}
    </th>
  );
};

interface TableCellProps extends TdHTMLAttributes<HTMLTableDataCellElement> {
  children: React.ReactNode;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  className = "py-3",
  ...props
}) => {
  return (
    <td className={` ${className}`} {...props}>
      {children}
    </td>
  );
};

interface TableEmptyStateProps {
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  message = "No data available",
  icon,
  action,
}) => {
  return (
    <tr>
      <td colSpan={100} className="text-center py-5">
        <div className="text-muted">
          {icon && <div className="mb-3">{icon}</div>}
          <p className="mb-2">{message}</p>
          {action && <div>{action}</div>}
        </div>
      </td>
    </tr>
  );
};

interface TableLoadingStateProps {
  columns: number;
  rows?: number;
}

const TableLoadingState: React.FC<TableLoadingStateProps> = ({
  columns,
  rows = 5,
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex} className="py-3">
              <div className="placeholder-glow">
                <span className="placeholder col-8"></span>
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export const Table = Object.assign(TableRoot, {
  Container: TableContainer,
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Header: TableHeader,
  Cell: TableCell,
  Thead: TableHead,
  Tbody: TableBody,
  Tr: TableRow,
  Th: TableHeader,
  Td: TableCell,
  EmptyState: TableEmptyState,
  LoadingState: TableLoadingState,
});
