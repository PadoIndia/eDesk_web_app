// Table.tsx
import React, { useState } from "react";
import Pagination from "./pagination";
import styles from "./styles.module.scss";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((data: T) => React.ReactNode);
  sortable?: boolean;
  cellRenderer?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  pagination?: boolean;
  pageSize?: number;
  className?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  stickyHeader?: boolean;
  hoverable?: boolean;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  pagination = true,
  pageSize = 10,
  className = "",
  onRowClick,
  emptyMessage = "No data available",
  stickyHeader = false,
  hoverable = true,
}: TableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });

  // Sorting logic
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return data;

    return [...data].sort((a, b) => {
      const key = sortConfig.key as keyof T;

      if (typeof a[key] === "string" && typeof b[key] === "string") {
        return sortConfig.direction === "asc"
          ? (a[key] as string).localeCompare(b[key] as string)
          : (b[key] as string).localeCompare(a[key] as string);
      }

      if (a[key] < b[key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const requestSort = (key: keyof T) => {
    let direction: "asc" | "desc" | null = "asc";

    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;

    const accessor =
      typeof column.accessor === "function" ? null : column.accessor;
    if (!accessor) return null;

    if (sortConfig.key !== accessor) {
      return <span className={styles.sortIcon}>↕️</span>;
    }

    return sortConfig.direction === "asc" ? (
      <span className={styles.sortIcon}>↑</span>
    ) : (
      <span className={styles.sortIcon}>↓</span>
    );
  };

  const getCellValue = (row: T, column: TableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }

    const value = row[column.accessor];

    if (column.cellRenderer) {
      return column.cellRenderer(value, row);
    }

    return value;
  };

  return (
    <div className={styles.tableContainer}>
      <div className={`${styles.tableWrapper} table-responsive ${className}`}>
        <table
          className={`${styles.table} ${
            stickyHeader ? styles.stickyHeader : ""
          }`}
        >
          <thead className={styles.tableHeader}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`${column.sortable ? styles.sortable : ""}`}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable &&
                    typeof column.accessor !== "function" &&
                    requestSort(column.accessor)
                  }
                >
                  <div className={styles.headerContent}>
                    {column.header}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`${hoverable ? styles.hoverable : ""} ${
                    onRowClick ? styles.clickable : ""
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{getCellValue(row, column)}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className={styles.emptyMessage}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
