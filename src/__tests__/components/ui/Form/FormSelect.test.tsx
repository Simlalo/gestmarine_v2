import React from 'react';
import { render, screen, within } from '../../../setup/test-utils';
import { FormSelect } from '../../../../components/ui/Form';
import { formTestUtils } from '../../../utils/form-test-utils';
import userEvent from '@testing-library/user-event';

describe('FormSelect', () => {
  const mockOptions = [
    { id: 1, label: 'Option 1', value: 'opt1' },
    { id: 2, label: 'Option 2', value: 'opt2' },
    { id: 3, label: 'Option 3', value: 'opt3' },
  ];

  const defaultProps = {
    name: 'testSelect',
    label: 'Test Select',
    options: mockOptions,
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('single select behavior', () => {
    it('opens dropdown on click', async () => {
      render(<FormSelect {...defaultProps} />);
      const select = screen.getByLabelText('Test Select');
      await userEvent.click(select);
      
      expect(screen.getByRole('listbox')).toBeInTheDocument();
      mockOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('selects option on click', async () => {
      render(<FormSelect {...defaultProps} />);
      await formTestUtils.selectOption('Test Select', 'Option 1');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'opt1' })
        })
      );
    });

    it('closes dropdown after selection', async () => {
      render(<FormSelect {...defaultProps} />);
      await formTestUtils.selectOption('Test Select', 'Option 1');
      
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('displays selected value', () => {
      render(<FormSelect {...defaultProps} value="opt1" />);
      expect(screen.getByLabelText('Test Select')).toHaveTextContent('Option 1');
    });
  });

  describe('multiple select behavior', () => {
    const multiSelectProps = {
      ...defaultProps,
      multiple: true,
      value: [],
    };

    it('allows multiple selections', async () => {
      render(<FormSelect {...multiSelectProps} />);
      await formTestUtils.selectMultipleOptions('Test Select', ['Option 1', 'Option 2']);
      
      expect(defaultProps.onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: ['opt1', 'opt2'] })
        })
      );
    });

    it('shows selected items list', () => {
      render(<FormSelect {...multiSelectProps} value={['opt1', 'opt2']} />);
      const select = screen.getByLabelText('Test Select');
      
      expect(select).toHaveTextContent('Option 1');
      expect(select).toHaveTextContent('Option 2');
    });

    it('handles item removal', async () => {
      render(<FormSelect {...multiSelectProps} value={['opt1', 'opt2']} />);
      const chips = screen.getAllByRole('button');
      await userEvent.click(chips[0]);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: ['opt2'] })
        })
      );
    });

    it('has select all option when configured', async () => {
      render(<FormSelect {...multiSelectProps} showSelectAll />);
      const select = screen.getByLabelText('Test Select');
      await userEvent.click(select);
      
      const selectAll = screen.getByText('Select All');
      await userEvent.click(selectAll);
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ 
            value: mockOptions.map(opt => opt.value) 
          })
        })
      );
    });
  });

  describe('search functionality', () => {
    const searchableProps = {
      ...defaultProps,
      searchable: true,
    };

    it('filters options on input', async () => {
      render(<FormSelect {...searchableProps} />);
      const select = screen.getByLabelText('Test Select');
      await userEvent.click(select);
      
      const searchInput = screen.getByRole('textbox');
      await userEvent.type(searchInput, 'Option 1');
      
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('shows no results state', async () => {
      render(<FormSelect {...searchableProps} />);
      const select = screen.getByLabelText('Test Select');
      await userEvent.click(select);
      
      const searchInput = screen.getByRole('textbox');
      await userEvent.type(searchInput, 'nonexistent');
      
      expect(screen.getByText('No options found')).toBeInTheDocument();
    });

    it('handles case sensitivity in search', async () => {
      render(<FormSelect {...searchableProps} />);
      const select = screen.getByLabelText('Test Select');
      await userEvent.click(select);
      
      const searchInput = screen.getByRole('textbox');
      await userEvent.type(searchInput, 'option');
      
      mockOptions.forEach(option => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('handles empty options list', () => {
      render(<FormSelect {...defaultProps} options={[]} />);
      const select = screen.getByLabelText('Test Select');
      expect(select).toBeDisabled();
    });

    it('manages large option sets', async () => {
      const largeOptions = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        label: `Option ${i}`,
        value: `opt${i}`,
      }));

      render(<FormSelect {...defaultProps} options={largeOptions} />);
      const select = screen.getByLabelText('Test Select');
      await userEvent.click(select);
      
      // Check if virtualization is working (not all options are in DOM)
      const visibleOptions = screen.getAllByRole('option');
      expect(visibleOptions.length).toBeLessThan(largeOptions.length);
    });

    it('deals with duplicate values', async () => {
      const duplicateOptions = [
        { id: 1, label: 'Option 1', value: 'opt1' },
        { id: 2, label: 'Option 1 Copy', value: 'opt1' },
      ];

      render(<FormSelect {...defaultProps} options={duplicateOptions} />);
      await formTestUtils.selectOption('Test Select', 'Option 1');
      
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'opt1' })
        })
      );
    });

    it('preserves selection on blur', async () => {
      render(<FormSelect {...defaultProps} value="opt1" />);
      const select = screen.getByLabelText('Test Select');
      
      await userEvent.click(select);
      select.blur();
      
      expect(select).toHaveTextContent('Option 1');
    });
  });
});
