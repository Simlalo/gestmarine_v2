import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

export const formTestUtils = {
  // Input helpers
  fillInput: async (labelText: string, value: string) => {
    const input = screen.getByLabelText(labelText);
    await userEvent.clear(input);
    await userEvent.type(input, value);
    return input;
  },

  // Select helpers
  selectOption: async (labelText: string, optionText: string) => {
    const select = screen.getByLabelText(labelText);
    fireEvent.mouseDown(select);
    const listbox = within(screen.getByRole('listbox'));
    const option = listbox.getByText(optionText);
    fireEvent.click(option);
    return select;
  },

  selectMultipleOptions: async (labelText: string, optionTexts: string[]) => {
    const select = screen.getByLabelText(labelText);
    fireEvent.mouseDown(select);
    const listbox = within(screen.getByRole('listbox'));
    
    for (const optionText of optionTexts) {
      const option = listbox.getByText(optionText);
      fireEvent.click(option);
    }
    
    return select;
  },

  // Validation helpers
  getErrorMessage: (labelText: string) => {
    const input = screen.getByLabelText(labelText);
    const fieldset = input.closest('fieldset');
    return within(fieldset!).queryByText(/error|required/i);
  },

  // Form submission helpers
  submitForm: async () => {
    const submitButton = screen.getByRole('button', { name: /submit|save/i });
    await userEvent.click(submitButton);
    return submitButton;
  },

  // Helper text verification
  getHelperText: (labelText: string) => {
    const input = screen.getByLabelText(labelText);
    const fieldset = input.closest('fieldset');
    return within(fieldset!).getByClassName('MuiFormHelperText-root');
  },

  // Required field verification
  verifyRequiredField: (labelText: string) => {
    const input = screen.getByLabelText(labelText);
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
  },

  // Disabled state verification
  verifyDisabledField: (labelText: string) => {
    const input = screen.getByLabelText(labelText);
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute('aria-disabled', 'true');
  },
};
