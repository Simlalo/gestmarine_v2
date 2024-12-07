import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const validationTestUtils = {
  // Common validation patterns
  patterns: {
    email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    phone: /^\+?[1-9]\d{1,14}$/,
    numbers: /^\d+$/,
    letters: /^[A-Za-z]+$/,
    alphanumeric: /^[A-Za-z0-9]+$/,
  },

  // Validation test helpers
  async testRequiredField(labelText: string) {
    const input = screen.getByLabelText(labelText);
    await userEvent.clear(input);
    input.blur();
    
    const fieldset = input.closest('fieldset');
    const errorMessage = within(fieldset!).getByText(/required|obligatoire/i);
    expect(errorMessage).toBeInTheDocument();
    
    return { input, errorMessage };
  },

  async testMinLength(labelText: string, minLength: number) {
    const input = screen.getByLabelText(labelText);
    const shortText = 'a'.repeat(minLength - 1);
    const validText = 'a'.repeat(minLength);
    
    // Test invalid length
    await userEvent.clear(input);
    await userEvent.type(input, shortText);
    input.blur();
    
    const fieldset = input.closest('fieldset');
    const errorMessage = within(fieldset!).getByText(/minimum.*characters/i);
    expect(errorMessage).toBeInTheDocument();
    
    // Test valid length
    await userEvent.clear(input);
    await userEvent.type(input, validText);
    input.blur();
    
    expect(errorMessage).not.toBeInTheDocument();
    
    return { input, errorMessage };
  },

  async testMaxLength(labelText: string, maxLength: number) {
    const input = screen.getByLabelText(labelText);
    const longText = 'a'.repeat(maxLength + 1);
    const validText = 'a'.repeat(maxLength);
    
    // Attempt to type more than maxLength
    await userEvent.clear(input);
    await userEvent.type(input, longText);
    
    // Should be truncated to maxLength
    expect(input).toHaveValue(validText);
    
    return { input };
  },

  async testPattern(labelText: string, pattern: RegExp, validValue: string, invalidValue: string) {
    const input = screen.getByLabelText(labelText);
    
    // Test invalid pattern
    await userEvent.clear(input);
    await userEvent.type(input, invalidValue);
    input.blur();
    
    const fieldset = input.closest('fieldset');
    const errorMessage = within(fieldset!).getByText(/invalid format/i);
    expect(errorMessage).toBeInTheDocument();
    
    // Test valid pattern
    await userEvent.clear(input);
    await userEvent.type(input, validValue);
    input.blur();
    
    expect(errorMessage).not.toBeInTheDocument();
    
    return { input, errorMessage };
  },

  async testCustomValidation(
    labelText: string, 
    validate: (value: string) => boolean | string,
    validValue: string,
    invalidValue: string
  ) {
    const input = screen.getByLabelText(labelText);
    
    // Test invalid value
    await userEvent.clear(input);
    await userEvent.type(input, invalidValue);
    input.blur();
    
    const fieldset = input.closest('fieldset');
    const errorMessage = within(fieldset!).queryByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    
    // Test valid value
    await userEvent.clear(input);
    await userEvent.type(input, validValue);
    input.blur();
    
    expect(errorMessage).not.toBeInTheDocument();
    
    return { input, errorMessage };
  },

  // Common validation scenarios
  validationScenarios: {
    email: {
      valid: ['test@example.com', 'user.name@domain.co.uk'],
      invalid: ['test', 'test@', 'test@domain', '@domain.com'],
    },
    phone: {
      valid: ['+1234567890', '1234567890'],
      invalid: ['abc', '+abc', '123'],
    },
    password: {
      valid: ['Password123!', 'StrongP@ss1'],
      invalid: ['pass', 'password', '12345678'],
    },
    username: {
      valid: ['user123', 'username_123'],
      invalid: ['u', 'user@123', 'user name'],
    },
  },
};
