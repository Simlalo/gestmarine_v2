import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { keyframes } from '@mui/material/styles';

interface StyledButtonProps {
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const spinAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledButton = styled(Button)<StyledButtonProps>(({ 
  theme, 
  size = 'medium',
  fullWidth = false,
  loading = false,
  variant = 'primary'
}) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  textTransform: 'none',
  fontWeight: 500,
  position: 'relative',
  width: fullWidth ? '100%' : 'auto',

  // Size variants
  ...(size === 'small' && {
    padding: theme.spacing(0.5, 1),
    fontSize: theme.typography.body2.fontSize,
  }),
  ...(size === 'medium' && {
    padding: theme.spacing(1, 2),
    fontSize: theme.typography.body1.fontSize,
  }),
  ...(size === 'large' && {
    padding: theme.spacing(1.5, 3),
    fontSize: theme.typography.h6.fontSize,
  }),

  // Color variants
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.divider}`,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
  ...(variant === 'danger' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  }),

  // Loading state
  ...(loading && {
    color: 'transparent',
    pointerEvents: 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      width: '1em',
      height: '1em',
      border: `2px solid ${theme.palette.common.white}`,
      borderRadius: '50%',
      borderRightColor: 'transparent',
      animation: `${spinAnimation} 0.8s linear infinite`,
    },
  }),

  // Disabled state
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
}));

export const ButtonIcon = styled('span')(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1em',
  height: '1em',
  '& > svg': {
    width: '100%',
    height: '100%',
  },
}));

// Export as a component object
export const Button = {
  Root: StyledButton,
  Icon: ButtonIcon,
};
