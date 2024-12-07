import React from 'react';
import { render, screen } from '../../../setup/test-utils';
import { BaseTable } from '../../../../components/ui/Table';
import { tableTestUtils } from '../../../utils/table-test-utils';

describe('BaseTable Component', () => {
  const mockColumns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'status', headerName: 'Status' },
  ];

  const mockData = [
    { id: '1', name: 'Item 1', status: 'active' },
    { id: '2', name: 'Item 2', status: 'inactive' },
    { id: '3', name: 'Item 3', status: 'active' },
  ];

  const defaultProps = {
    columns: mockColumns,
    data: mockData,
    onSort: jest.fn(),
    onFilter: jest.fn(),
    onRowClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders table with correct columns and data', () => {
      render(<BaseTable {...defaultProps} />);

      // Check column headers
      mockColumns.forEach(column => {
        expect(screen.getByText(column.headerName)).toBeInTheDocument();
      });

      // Check data rows
      mockData.forEach(row => {
        expect(screen.getByText(row.name)).toBeInTheDocument();
        expect(screen.getByText(row.status)).toBeInTheDocument();
      });
    });

    it('shows loading state when loading prop is true', () => {
      render(<BaseTable {...defaultProps} loading />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows empty state when no data is provided', () => {
      render(<BaseTable {...defaultProps} data={[]} />);
      expect(screen.getByText(/no data available/i)).toBeInTheDocument();
    });

    it('renders custom empty state component when provided', () => {
      const CustomEmptyState = () => <div>Custom Empty State</div>;
      render(
        <BaseTable 
          {...defaultProps} 
          data={[]} 
          EmptyStateComponent={CustomEmptyState}
        />
      );
      expect(screen.getByText('Custom Empty State')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('handles column sorting', async () => {
      render(<BaseTable {...defaultProps} />);
      await tableTestUtils.clickColumnHeader('Name');
      
      expect(defaultProps.onSort).toHaveBeenCalledWith({
        field: 'name',
        direction: 'asc'
      });
    });

    it('toggles sort direction on multiple clicks', async () => {
      render(<BaseTable {...defaultProps} />);
      
      // First click - ascending
      await tableTestUtils.clickColumnHeader('Name');
      expect(defaultProps.onSort).toHaveBeenLastCalledWith({
        field: 'name',
        direction: 'asc'
      });

      // Second click - descending
      await tableTestUtils.clickColumnHeader('Name');
      expect(defaultProps.onSort).toHaveBeenLastCalledWith({
        field: 'name',
        direction: 'desc'
      });
    });

    it('shows sort indicators', async () => {
      render(
        <BaseTable 
          {...defaultProps} 
          sortModel={{ field: 'name', direction: 'asc' }}
        />
      );

      tableTestUtils.verifySortDirection('Name', 'asc');
    });
  });

  describe('row selection', () => {
    const selectionProps = {
      ...defaultProps,
      selectable: true,
      onSelectionChange: jest.fn(),
    };

    it('allows row selection when selectable is true', async () => {
      render(<BaseTable {...selectionProps} />);
      await tableTestUtils.selectRow(1);
      
      expect(selectionProps.onSelectionChange).toHaveBeenCalledWith(['2']);
    });

    it('supports multiple row selection', async () => {
      render(<BaseTable {...selectionProps} />);
      await tableTestUtils.selectRow(1);
      await tableTestUtils.selectRow(2);
      
      expect(selectionProps.onSelectionChange).toHaveBeenLastCalledWith(['2', '3']);
    });

    it('handles select all functionality', async () => {
      render(<BaseTable {...selectionProps} />);
      await tableTestUtils.selectAllRows();
      
      expect(selectionProps.onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
    });
  });

  describe('pagination', () => {
    const paginationProps = {
      ...defaultProps,
      pagination: true,
      page: 0,
      pageSize: 2,
      totalCount: 3,
      onPageChange: jest.fn(),
    };

    it('renders pagination controls when enabled', () => {
      render(<BaseTable {...paginationProps} />);
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('handles page changes', async () => {
      render(<BaseTable {...paginationProps} />);
      await tableTestUtils.goToNextPage();
      
      expect(paginationProps.onPageChange).toHaveBeenCalledWith(1);
    });

    it('disables navigation buttons appropriately', () => {
      render(<BaseTable {...paginationProps} page={0} />);
      const prevButton = screen.getByRole('button', { name: /previous page/i });
      expect(prevButton).toBeDisabled();
    });
  });

  describe('row actions', () => {
    const actionProps = {
      ...defaultProps,
      actions: [
        { name: 'edit', label: 'Edit', onClick: jest.fn() },
        { name: 'delete', label: 'Delete', onClick: jest.fn() },
      ],
    };

    it('renders row action buttons', () => {
      render(<BaseTable {...actionProps} />);
      expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(3);
      expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(3);
    });

    it('handles action clicks', async () => {
      render(<BaseTable {...actionProps} />);
      await tableTestUtils.clickRowAction(0, 'Edit');
      
      expect(actionProps.actions[0].onClick).toHaveBeenCalledWith(mockData[0]);
    });
  });
});
