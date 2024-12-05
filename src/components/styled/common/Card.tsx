import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';

export const Card = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

export const CardHeader = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const CardContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
}));

export const CardFooter = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

export const CardTitle = styled('h2')(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.fontWeightSemibold,
  color: theme.palette.text.primary,
  margin: 0,
}));

export const CardSubtitle = styled('h3')(({ theme }) => ({
  fontSize: theme.typography.subtitle1.fontSize,
  color: theme.palette.text.secondary,
  margin: theme.spacing(0.5, 0, 0),
}));

export const CardActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 2),
}));

export const CardMedia = styled('div')<{ height?: string | number }>(({ theme, height = '200px' }) => ({
  height,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
}));

export const InteractiveCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

export const BorderedCard = styled(Card)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[1],
  },
}));
