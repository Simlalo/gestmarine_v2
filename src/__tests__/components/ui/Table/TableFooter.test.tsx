import React from 'react';
import { render, screen } from '../../../setup/test-utils';
import { TableFooter } from '../../../../components/ui/Table';
import userEvent from '@testing-library/user-event';

describe('TableFooter Component', () => {
  const defaultProps = {
    page: 0,
    pageSize: 10,
    totalCount: 100,
    onPageChange: jest.fn(),
    onPageSizeChange: jest.fn(),
    rowsPerPageOptions: [5, 10, 25, 50],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pagination controls', () => {
    it('renders pagination controls correctly', () => {
      render(<TableFooter {...defaultProps} />);
      
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    });

    it('displays correct page information', () => {
      render(<TableFooter {...defaultProps} />);
      expect(screen.getByText(/1-10 of 100/i)).toBeInTheDocument();
    });

    it('handles page size changes', async () => {
      render(<TableFooter {...defaultProps} />);
      
      const select = screen.getByRole('combobox');
      await userEvent.click(select);
      await userEvent.click(screen.getByRole('option', { name: '25' }));

      expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(25);
    });

    it('disables previous button on first page', () => {
      render(<TableFooter {...defaultProps} page={0} />);
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    });

    it('disables next button on last page', () => {
      render(<TableFooter {...defaultProps} page={9} />);
      expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
    });
  });

  describe('page navigation', () => {
    it('handles next page click', async () => {
      render(<TableFooter {...defaultProps} />);
      const nextButton = screen.getByRole('button', { name: /next page/i });
      await userEvent.click(nextButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
    });

    it('handles previous page click', async () => {
      render(<TableFooter {...defaultProps} page={1} />);
      const prevButton = screen.getByRole('button', { name: /previous page/i });
      await userEvent.click(prevButton);
      expect(defaultProps.onPageChange).toHaveBeenCalledWith(0);
    });

    it('displays correct range with partial page', () => {
      render(<TableFooter {...defaultProps} totalCount={95} page={9} />);
      expect(screen.getByText(/91-95 of 95/i)).toBeInTheDocument();
    });
  });

  describe('rows per page options', () => {
    it('renders custom rows per page options', () => {
      const customOptions = [10, 20, 30];
      render(<TableFooter {...defaultProps} rowsPerPageOptions={customOptions} />);
      
      const select = screen.getByRole('combobox');
      userEvent.click(select);
      
      customOptions.forEach(option => {
        expect(screen.getByRole('option', { name: String(option) }))
          .toBeInTheDocument();
      });
    });

    it('shows current page size as selected', () => {
      render(<TableFooter {...defaultProps} pageSize={25} />);
      expect(screen.getByRole('combobox')).toHaveValue('25');
    });
  });

  describe('accessibility', () => {
    it('provides accessible labels for controls', () => {
      render(<TableFooter {...defaultProps} />);
      
      expect(screen.getByLabelText(/rows per page/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next page/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeInTheDocument();
    });

    it('maintains focus after page change', async () => {
      render(<TableFooter {...defaultProps} />);
      const nextButton = screen.getByRole('button', { name: /next page/i });
      
      await userEvent.click(nextButton);
      expect(nextButton).toHaveFocus();
    });
  });

  describe('edge cases', () => {
    it('handles zero total count', () => {
      render(<TableFooter {...defaultProps} totalCount={0} />);
      expect(screen.getByText(/0-0 of 0/i)).toBeInTheDocument();
    });

    it('handles page size larger than total count', () => {
      render(<TableFooter {...defaultProps} pageSize={150} totalCount={100} />);
      expect(screen.getByText(/1-100 of 100/i)).toBeInTheDocument();
    });

    it('disables controls when loading', () => {
      render(<TableFooter {...defaultProps} loading />);
      
      expect(screen.getByRole('combobox')).toBeDisabled();
      expect(screen.getByRole('button', { name: /next page/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
    });
  });
});
