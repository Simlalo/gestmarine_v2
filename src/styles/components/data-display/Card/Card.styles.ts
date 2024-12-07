import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/material/styles';

interface CardProps {
  interactive?: boolean;
  variant?: 'default' | 'bordered' | 'flat';
  loading?: boolean;
}

const loadingAnimation = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const CardRoot = styled('div')<CardProps>(({ theme, interactive, variant, loading }) => ({
  backgroundColor: variant === 'flat' 
    ? theme.palette.background.default 
    : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: variant === 'bordered' || variant === 'flat' 
    ? 'none' 
    : theme.shadows[1],
  border: variant === 'bordered' 
    ? `1px solid ${theme.palette.divider}` 
    : 'none',
  transition: theme.transitions.create(['transform', 'box-shadow']),
  position: 'relative',
  
  ...(interactive && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[2],
    },
  }),

  ...(loading && {
    pointerEvents: 'none',
    opacity: 0.7,
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(90deg, transparent, ${theme.palette.background.default}, transparent)`,
      animation: `${loadingAnimation} 1.5s infinite`,
    },
  }),
}));

export const CardHeader = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

export const CardTitle = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.h6.fontWeight,
  color: theme.palette.text.primary,
}));

export const CardSubtitle = styled('div')(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(0.5),
}));

export const CardContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const CardMedia = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  '& img': {
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius,
  },
}));

export const CardActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const CardFooter = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

// Export as a component object for better organization
export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Subtitle: CardSubtitle,
  Content: CardContent,
  Media: CardMedia,
  Actions: CardActions,
  Footer: CardFooter,
};
