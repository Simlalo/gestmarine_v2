import { styled } from '@mui/material/styles';
import { TextField, Button, Typography } from '@mui/material';

// Container Components
export const LoginContainer = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}));

export const LoginCard = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 400,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(6),
  margin: theme.spacing(2),
}));

// Typography Components
export const LoginTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: theme.typography.h4.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  textAlign: 'center',
  marginBottom: theme.spacing(1),
}));

export const LoginSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  fontSize: theme.typography.body1.fontSize,
}));

// Form Components
export const LoginForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.primary,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputAdornment-root svg': {
    color: theme.palette.text.secondary,
  },
}));

export const LoginButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 2),
  fontWeight: theme.typography.fontWeightMedium,
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  textAlign: 'center',
  marginTop: theme.spacing(1),
  fontSize: theme.typography.body2.fontSize,
}));

export const ThemeToggleContainer = styled('div')(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

// Export as a component object
export const Login = {
  Container: LoginContainer,
  Card: LoginCard,
  Title: LoginTitle,
  Subtitle: LoginSubtitle,
  Form: LoginForm,
  TextField: StyledTextField,
  Button: LoginButton,
  Error: ErrorMessage,
  ThemeToggle: {
    Container: ThemeToggleContainer,
  },
};
