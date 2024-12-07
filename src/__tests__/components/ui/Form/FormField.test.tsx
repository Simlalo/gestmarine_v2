import React from 'react';
import { render, screen } from '../../../setup/test-utils';
import { FormField } from '../../../../components/ui/Form';
import { formTestUtils } from '../../../utils/form-test-utils';

describe('FormField Component', () => {
  const defaultProps = {
    name: 'testField',
    label: 'Test Field',
    value: '',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with basic props', () => {
    render(<FormField {...defaultProps} />);
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
  });

  it('handles input value changes', async () => {
    const onChange = jest.fn();
    render(<FormField {...defaultProps} onChange={onChange} />);
    
    await formTestUtils.fillInput('Test Field', 'test value');
    
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: 'test value'
      })
    }));
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FormField 
        {...defaultProps} 
        error={true}
        helperText="This field is required"
      />
    );

    const errorMessage = formTestUtils.getErrorMessage('Test Field');
    expect(errorMessage).toHaveTextContent('This field is required');
  });

  it('shows required indicator when required prop is true', () => {
    render(<FormField {...defaultProps} required />);
    formTestUtils.verifyRequiredField('Test Field');
  });

  it('disables input when disabled prop is true', () => {
    render(<FormField {...defaultProps} disabled />);
    formTestUtils.verifyDisabledField('Test Field');
  });

  it('renders helper text when provided', () => {
    render(
      <FormField 
        {...defaultProps} 
        helperText="Helper text"
      />
    );

    const helperText = formTestUtils.getHelperText('Test Field');
    expect(helperText).toHaveTextContent('Helper text');
  });

  it('applies custom styles when provided', () => {
    const customStyle = { width: '200px' };
    render(
      <FormField 
        {...defaultProps} 
        style={customStyle}
      />
    );

    const input = screen.getByLabelText('Test Field');
    expect(input.parentElement).toHaveStyle(customStyle);
  });

  it('handles different input types correctly', () => {
    render(
      <FormField 
        {...defaultProps} 
        type="number"
        min={0}
        max={100}
      />
    );

    const input = screen.getByLabelText('Test Field');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('supports placeholder text', () => {
    render(
      <FormField 
        {...defaultProps} 
        placeholder="Enter value here"
      />
    );

    const input = screen.getByPlaceholderText('Enter value here');
    expect(input).toBeInTheDocument();
  });

  it('handles onBlur events', async () => {
    const onBlur = jest.fn();
    render(
      <FormField 
        {...defaultProps} 
        onBlur={onBlur}
      />
    );

    const input = screen.getByLabelText('Test Field');
    input.focus();
    input.blur();

    expect(onBlur).toHaveBeenCalled();
  });
});
