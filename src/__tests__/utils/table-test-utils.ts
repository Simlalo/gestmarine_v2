import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const tableTestUtils = {
  // Sorting helpers
  clickColumnHeader: async (columnName: string) => {
    const header = screen.getByRole('columnheader', { name: columnName });
    await userEvent.click(header);
    return header;
  },

  verifySortDirection: (columnName: string, direction: 'asc' | 'desc' | null) => {
    const header = screen.getByRole('columnheader', { name: columnName });
    if (direction === null) {
      expect(header).not.toHaveAttribute('aria-sort');
    } else {
      expect(header).toHaveAttribute('aria-sort', direction);
    }
  },

  // Row selection helpers
  selectRow: async (rowIndex: number) => {
    const rows = screen.getAllByRole('row');
    const checkbox = within(rows[rowIndex]).getByRole('checkbox');
    await userEvent.click(checkbox);
    return checkbox;
  },

  selectAllRows: async () => {
    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    await userEvent.click(selectAllCheckbox);
    return selectAllCheckbox;
  },

  // Pagination helpers
  goToNextPage: async () => {
    const nextButton = screen.getByRole('button', { name: /next page/i });
    await userEvent.click(nextButton);
    return nextButton;
  },

  goToPreviousPage: async () => {
    const prevButton = screen.getByRole('button', { name: /previous page/i });
    await userEvent.click(prevButton);
    return prevButton;
  },

  // Row action helpers
  clickRowAction: async (rowIndex: number, actionName: string) => {
    const rows = screen.getAllByRole('row');
    const actionButton = within(rows[rowIndex]).getByRole('button', { name: actionName });
    await userEvent.click(actionButton);
    return actionButton;
  },

  // Filter helpers
  setColumnFilter: async (columnName: string, value: string) => {
    const header = screen.getByRole('columnheader', { name: columnName });
    const filterInput = within(header).getByRole('textbox');
    await userEvent.clear(filterInput);
    await userEvent.type(filterInput, value);
    return filterInput;
  },

  // Row expansion helpers
  expandRow: async (rowIndex: number) => {
    const rows = screen.getAllByRole('row');
    const expandButton = within(rows[rowIndex]).getByRole('button', { name: /expand/i });
    await userEvent.click(expandButton);
    return expandButton;
  },

  // Verification helpers
  verifyRowCount: (expectedCount: number) => {
    const rows = screen.getAllByRole('row');
    // Subtract 1 for header row
    expect(rows.length - 1).toBe(expectedCount);
  },

  verifyColumnValues: (columnName: string, expectedValues: string[]) => {
    const cells = screen.getAllByRole('cell', { name: new RegExp(columnName) });
    expect(cells.map(cell => cell.textContent)).toEqual(expectedValues);
  },
};
