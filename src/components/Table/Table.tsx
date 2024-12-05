import React from 'react';
import '../../styles/table.css';

interface Column {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps {
  columns: Column[];
  data: any[];
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  selectedRow?: any;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  isLoading = false,
  onRowClick,
  selectedRow
}) => {
  if (isLoading) {
    return (
      <div className="table-container table-loading">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.align ? `text-${column.align}` : 'text-left'}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="table-empty">
                Chargement...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.align ? `text-${column.align}` : 'text-left'}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="table-empty">
                Aucune donnée disponible
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.align ? `text-${column.align}` : 'text-left'}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              onClick={() => onRowClick?.(row)}
              className={selectedRow === row ? 'row-selected' : ''}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            >
              {columns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className={column.align ? `text-${column.align}` : 'text-left'}
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
