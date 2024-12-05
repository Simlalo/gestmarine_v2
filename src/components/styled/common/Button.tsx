import { styled } from '@mui/material/styles';
import { Button as MuiButton, ButtonProps, IconButton as MuiIconButton } from '@mui/material';

interface StyledButtonProps extends ButtonProps {
  size?: 'small' | 'medium' | 'large';
}

export const Button = styled(MuiButton)<StyledButtonProps>(({ theme, size = 'medium' }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  fontWeight: theme.typography.fontWeightMedium,
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create([
    'background-color',
    'box-shadow',
    'border-color',
    'color',
  ]),

  ...(size === 'small' && {
    padding: theme.spacing(0.5, 1),
    fontSize: theme.typography.caption.fontSize,
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(1, 2),
    fontSize: theme.typography.body2.fontSize,
  }),
  ...(size === 'large' && {
    padding: theme.spacing(1.5, 3),
    fontSize: theme.typography.body1.fontSize,
  }),
}));

export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export const OutlinedButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.text.primary,
  },
}));

export const TextButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const IconButton = styled(MuiIconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    color: theme.palette.primary.main,
  },
}));

export const DangerButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

export const SuccessButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
  },
}));
