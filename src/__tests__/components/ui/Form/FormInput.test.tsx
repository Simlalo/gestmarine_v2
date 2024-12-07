import React from 'react';
import { render, screen, fireEvent } from '../../../setup/test-utils';
import { FormInput } from '../../../../components/ui/Form';
import { formTestUtils } from '../../../utils/form-test-utils';
import userEvent from '@testing-library/user-event';

describe('FormInput', () => {
  const defaultProps = {
    name: 'testInput',
    label: 'Test Input',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('text input behavior', () => {
    it('accepts and updates text value', async () => {
      render(<FormInput {...defaultProps} />);
      await formTestUtils.fillInput('Test Input', 'test value');
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'test value' })
        })
      );
    });

    it('handles empty input', async () => {
      render(<FormInput {...defaultProps} value="initial" />);
      await formTestUtils.fillInput('Test Input', '');
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '' })
        })
      );
    });

    it('trims whitespace when configured', async () => {
      render(<FormInput {...defaultProps} trimWhitespace />);
      await formTestUtils.fillInput('Test Input', '  test  ');
      expect(defaultProps.onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: 'test' })
        })
      );
    });

    it('maintains cursor position on controlled updates', async () => {
      const { rerender } = render(
        <FormInput {...defaultProps} value="initial text" />
      );
      const input = screen.getByLabelText('Test Input');
      
      // Set cursor position
      input.focus();
      input.setSelectionRange(3, 3);
      
      // Update value
      rerender(<FormInput {...defaultProps} value="updated text" />);
      
      expect(input.selectionStart).toBe(3);
      expect(input.selectionEnd).toBe(3);
    });
  });

  describe('number input constraints', () => {
    const numberProps = {
      ...defaultProps,
      type: 'number' as const,
      min: 0,
      max: 100,
    };

    it('accepts valid numbers', async () => {
      render(<FormInput {...numberProps} />);
      await formTestUtils.fillInput('Test Input', '42');
      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: '42' })
        })
      );
    });

    it('rejects non-numeric input', async () => {
      render(<FormInput {...numberProps} />);
      const input = screen.getByLabelText('Test Input');
      await userEvent.type(input, 'abc');
      expect(input).toHaveValue(null);
    });

    it('enforces min/max constraints', async () => {
      render(<FormInput {...numberProps} />);
      const input = screen.getByLabelText('Test Input');
      
      await userEvent.type(input, '150');
      expect(input).toHaveValue(100);

      await userEvent.clear(input);
      await userEvent.type(input, '-10');
      expect(input).toHaveValue(0);
    });

    it('formats decimal places correctly', async () => {
      render(<FormInput {...numberProps} step="0.01" />);
      await formTestUtils.fillInput('Test Input', '42.123');
      expect(screen.getByLabelText('Test Input')).toHaveValue(42.12);
    });
  });

  describe('input states', () => {
    it('renders in disabled state', () => {
      render(<FormInput {...defaultProps} disabled />);
      formTestUtils.verifyDisabledField('Test Input');
    });

    it('shows loading state', () => {
      render(<FormInput {...defaultProps} loading />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays in read-only mode', () => {
      render(<FormInput {...defaultProps} readOnly />);
      const input = screen.getByLabelText('Test Input');
      expect(input).toHaveAttribute('readonly');
    });

    it('handles focus/blur events', async () => {
      const onFocus = jest.fn();
      const onBlur = jest.fn();
      
      render(
        <FormInput 
          {...defaultProps} 
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );

      const input = screen.getByLabelText('Test Input');
      input.focus();
      expect(onFocus).toHaveBeenCalled();
      
      input.blur();
      expect(onBlur).toHaveBeenCalled();
    });
  });

  describe('validation behavior', () => {
    it('shows required field error', async () => {
      render(
        <FormInput 
          {...defaultProps} 
          required 
          error={true}
          helperText="This field is required"
        />
      );

      const errorMessage = formTestUtils.getErrorMessage('Test Input');
      expect(errorMessage).toHaveTextContent('This field is required');
    });

    it('validates minimum length', async () => {
      const onValidate = jest.fn();
      render(
        <FormInput 
          {...defaultProps} 
          minLength={3}
          onValidate={onValidate}
        />
      );

      await formTestUtils.fillInput('Test Input', 'ab');
      expect(onValidate).toHaveBeenCalledWith(false);
      
      await formTestUtils.fillInput('Test Input', 'abc');
      expect(onValidate).toHaveBeenCalledWith(true);
    });

    it('validates maximum length', async () => {
      const onValidate = jest.fn();
      render(
        <FormInput 
          {...defaultProps} 
          maxLength={5}
          onValidate={onValidate}
        />
      );

      await formTestUtils.fillInput('Test Input', 'abcdef');
      expect(onValidate).toHaveBeenCalledWith(false);
      
      await formTestUtils.fillInput('Test Input', 'abcde');
      expect(onValidate).toHaveBeenCalledWith(true);
    });

    it('handles custom validation', async () => {
      const customValidation = (value: string) => value.includes('@');
      const onValidate = jest.fn();
      
      render(
        <FormInput 
          {...defaultProps} 
          validate={customValidation}
          onValidate={onValidate}
        />
      );

      await formTestUtils.fillInput('Test Input', 'invalid');
      expect(onValidate).toHaveBeenCalledWith(false);
      
      await formTestUtils.fillInput('Test Input', 'valid@email.com');
      expect(onValidate).toHaveBeenCalledWith(true);
    });
  });
});
