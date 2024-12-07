import React from 'react';
import { render, screen, fireEvent } from '../../../setup/test-utils';
import { TableHeader } from '../../../../components/ui/Table';
import { tableTestUtils } from '../../../utils/table-test-utils';
import userEvent from '@testing-library/user-event';

describe('TableHeader Component', () => {
  const mockColumns = [
    { 
      field: 'name', 
      headerName: 'Name',
      sortable: true,
      filterable: true,
      resizable: true,
    },
    { 
      field: 'status', 
      headerName: 'Status',
      sortable: true,
      filterable: true,
      resizable: true,
    },
  ];

  const defaultProps = {
    columns: mockColumns,
    onSort: jest.fn(),
    onFilter: jest.fn(),
    onColumnResize: jest.fn(),
    onColumnVisibilityChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('column sorting', () => {
    it('shows sort indicators when column is sorted', () => {
      render(
        <TableHeader 
          {...defaultProps}
          sortModel={{ field: 'name', direction: 'asc' }}
        />
      );

      tableTestUtils.verifySortDirection('Name', 'asc');
    });

    it('calls onSort with correct parameters when clicking sortable column', async () => {
      render(<TableHeader {...defaultProps} />);
      await tableTestUtils.clickColumnHeader('Name');

      expect(defaultProps.onSort).toHaveBeenCalledWith({
        field: 'name',
        direction: 'asc'
      });
    });

    it('does not allow sorting on non-sortable columns', async () => {
      const nonSortableColumns = [
        { ...mockColumns[0], sortable: false }
      ];
      
      render(<TableHeader {...defaultProps} columns={nonSortableColumns} />);
      await tableTestUtils.clickColumnHeader('Name');

      expect(defaultProps.onSort).not.toHaveBeenCalled();
    });
  });

  describe('column filtering', () => {
    it('shows filter input when column is filterable', async () => {
      render(<TableHeader {...defaultProps} />);
      const filterButton = screen.getByRole('button', { name: /filter name/i });
      await userEvent.click(filterButton);

      expect(screen.getByPlaceholderText(/filter/i)).toBeInTheDocument();
    });

    it('calls onFilter with correct parameters when typing in filter', async () => {
      render(<TableHeader {...defaultProps} />);
      await tableTestUtils.setColumnFilter('Name', 'test');

      expect(defaultProps.onFilter).toHaveBeenCalledWith({
        field: 'name',
        value: 'test'
      });
    });

    it('clears filter when clear button is clicked', async () => {
      render(<TableHeader {...defaultProps} />);
      await tableTestUtils.setColumnFilter('Name', 'test');
      
      const clearButton = screen.getByRole('button', { name: /clear filter/i });
      await userEvent.click(clearButton);

      expect(defaultProps.onFilter).toHaveBeenLastCalledWith({
        field: 'name',
        value: ''
      });
    });
  });

  describe('column resizing', () => {
    it('shows resize handle for resizable columns', () => {
      render(<TableHeader {...defaultProps} />);
      const resizeHandles = screen.getAllByRole('separator');
      expect(resizeHandles).toHaveLength(mockColumns.length);
    });

    it('calls onColumnResize when dragging resize handle', async () => {
      render(<TableHeader {...defaultProps} />);
      const resizeHandle = screen.getAllByRole('separator')[0];

      // Simulate drag
      fireEvent.mouseDown(resizeHandle);
      fireEvent.mouseMove(resizeHandle, { clientX: 150 });
      fireEvent.mouseUp(resizeHandle);

      expect(defaultProps.onColumnResize).toHaveBeenCalledWith({
        field: 'name',
        width: expect.any(Number)
      });
    });

    it('maintains minimum width when resizing', async () => {
      render(<TableHeader {...defaultProps} />);
      const resizeHandle = screen.getAllByRole('separator')[0];

      // Simulate drag to very small width
      fireEvent.mouseDown(resizeHandle);
      fireEvent.mouseMove(resizeHandle, { clientX: 10 });
      fireEvent.mouseUp(resizeHandle);

      expect(defaultProps.onColumnResize).toHaveBeenCalledWith({
        field: 'name',
        width: expect.any(Number)
      });
      
      // Verify width is not less than minimum
      const headerCell = screen.getByRole('columnheader', { name: 'Name' });
      expect(headerCell).toHaveStyle({ minWidth: expect.any(String) });
    });
  });

  describe('column visibility', () => {
    it('shows column visibility menu when menu button is clicked', async () => {
      render(<TableHeader {...defaultProps} showColumnVisibilityMenu />);
      
      const menuButton = screen.getByRole('button', { name: /show columns/i });
      await userEvent.click(menuButton);

      mockColumns.forEach(column => {
        expect(screen.getByRole('checkbox', { name: column.headerName }))
          .toBeInTheDocument();
      });
    });

    it('calls onColumnVisibilityChange when toggling column visibility', async () => {
      render(<TableHeader {...defaultProps} showColumnVisibilityMenu />);
      
      const menuButton = screen.getByRole('button', { name: /show columns/i });
      await userEvent.click(menuButton);

      const checkbox = screen.getByRole('checkbox', { name: 'Name' });
      await userEvent.click(checkbox);

      expect(defaultProps.onColumnVisibilityChange).toHaveBeenCalledWith({
        field: 'name',
        visible: false
      });
    });

    it('disables checkbox for required columns', async () => {
      const columnsWithRequired = [
        { ...mockColumns[0], required: true },
        ...mockColumns.slice(1),
      ];

      render(
        <TableHeader 
          {...defaultProps} 
          columns={columnsWithRequired}
          showColumnVisibilityMenu 
        />
      );
      
      const menuButton = screen.getByRole('button', { name: /show columns/i });
      await userEvent.click(menuButton);

      const checkbox = screen.getByRole('checkbox', { name: 'Name' });
      expect(checkbox).toBeDisabled();
    });
  });
});
