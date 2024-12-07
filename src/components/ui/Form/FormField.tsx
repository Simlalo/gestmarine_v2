import React from 'react';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
  TextFieldProps,
} from '@mui/material';

export interface FormFieldProps extends Omit<TextFieldProps, 'error'> {
  label: string;
  error?: string;
  required?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  ...props
}) => {
  return (
    <FormControl error={!!error} required={required} fullWidth>
      <TextField
        {...props}
        label={label}
        error={!!error}
        required={required}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
