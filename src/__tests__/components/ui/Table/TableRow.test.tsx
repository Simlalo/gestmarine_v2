import React from 'react';
import { render, screen } from '../../../setup/test-utils';
import { TableRow } from '../../../../components/ui/Table';
import { tableTestUtils } from '../../../utils/table-test-utils';
import userEvent from '@testing-library/user-event';

describe('TableRow Component', () => {
  const mockColumns = [
    { field: 'name', headerName: 'Name' },
    { field: 'status', headerName: 'Status' },
    { field: 'actions', headerName: 'Actions' },
  ];

  const mockData = {
    id: '1',
    name: 'Test Item',
    status: 'active',
  };

  const defaultProps = {
    columns: mockColumns,
    data: mockData,
    rowIndex: 0,
    onRowClick: jest.fn(),
    onRowSelect: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('renders row data correctly', () => {
      render(<TableRow {...defaultProps} />);
      expect(screen.getByText('Test Item')).toBeInTheDocument();
      expect(screen.getByText('active')).toBeInTheDocument();
    });

    it('applies correct row styles', () => {
      const customStyle = { backgroundColor: 'rgb(245, 245, 245)' };
      render(<TableRow {...defaultProps} style={customStyle} />);
      const row = screen.getByRole('row');
      expect(row).toHaveStyle(customStyle);
    });

    it('applies hover styles when hovered', async () => {
      render(<TableRow {...defaultProps} hover />);
      const row = screen.getByRole('row');
      await userEvent.hover(row);
      expect(row).toHaveClass('MuiTableRow-hover');
    });
  });

  describe('row selection', () => {
    const selectionProps = {
      ...defaultProps,
      selectable: true,
    };

    it('renders checkbox when selectable', () => {
      render(<TableRow {...selectionProps} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('handles selection state changes', async () => {
      render(<TableRow {...selectionProps} />);
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(selectionProps.onRowSelect).toHaveBeenCalledWith(mockData.id, true);
    });

    it('shows selected state correctly', () => {
      render(<TableRow {...selectionProps} selected />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('disables selection when row is not selectable', () => {
      render(<TableRow {...selectionProps} selectable={false} />);
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });
  });

  describe('row expansion', () => {
    const expansionProps = {
      ...defaultProps,
      expandable: true,
      expanded: false,
      onRowExpand: jest.fn(),
      ExpansionComponent: () => <div>Expanded Content</div>,
    };

    it('renders expansion toggle when expandable', () => {
      render(<TableRow {...expansionProps} />);
      expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
    });

    it('shows expanded content when expanded', () => {
      render(<TableRow {...expansionProps} expanded />);
      expect(screen.getByText('Expanded Content')).toBeInTheDocument();
    });

    it('handles expansion toggle correctly', async () => {
      render(<TableRow {...expansionProps} />);
      const expandButton = screen.getByRole('button', { name: /expand/i });
      await userEvent.click(expandButton);
      expect(expansionProps.onRowExpand).toHaveBeenCalledWith(mockData.id);
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

    it('renders action buttons correctly', () => {
      render(<TableRow {...actionProps} />);
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('handles action clicks', async () => {
      render(<TableRow {...actionProps} />);
      const editButton = screen.getByRole('button', { name: 'Edit' });
      await userEvent.click(editButton);
      expect(actionProps.actions[0].onClick).toHaveBeenCalledWith(mockData);
    });

    it('disables actions when specified', () => {
      const disabledActions = actionProps.actions.map(action => ({
        ...action,
        disabled: true,
      }));
      
      render(<TableRow {...actionProps} actions={disabledActions} />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  describe('custom cell rendering', () => {
    it('uses custom renderer when provided', () => {
      const customColumns = [
        {
          ...mockColumns[0],
          renderCell: (value: string) => <span>Custom {value}</span>,
        },
      ];

      render(<TableRow {...defaultProps} columns={customColumns} />);
      expect(screen.getByText('Custom Test Item')).toBeInTheDocument();
    });

    it('handles null or undefined values', () => {
      const dataWithNull = {
        ...mockData,
        name: null,
      };

      render(<TableRow {...defaultProps} data={dataWithNull} />);
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).toHaveTextContent('');
    });
  });

  describe('row click handling', () => {
    it('calls onRowClick when row is clicked', async () => {
      render(<TableRow {...defaultProps} />);
      const row = screen.getByRole('row');
      await userEvent.click(row);
      expect(defaultProps.onRowClick).toHaveBeenCalledWith(mockData);
    });

    it('does not call onRowClick when clicking actions', async () => {
      const props = {
        ...defaultProps,
        actions: [{ name: 'edit', label: 'Edit', onClick: jest.fn() }],
      };

      render(<TableRow {...props} />);
      const actionButton = screen.getByRole('button', { name: 'Edit' });
      await userEvent.click(actionButton);
      expect(defaultProps.onRowClick).not.toHaveBeenCalled();
    });
  });
});
