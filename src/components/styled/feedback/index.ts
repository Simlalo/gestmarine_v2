import { styled } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar } from '@mui/material';

export const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(2),
      width: `calc(100% - ${theme.spacing(4)})`,
      maxWidth: '100%',
    },
  },
}));

export const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

export const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  '&:first-of-type': {
    paddingTop: theme.spacing(3),
  },
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  '& > :not(:first-of-type)': {
    marginLeft: theme.spacing(1),
  },
}));

export const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&.MuiAlert-standardSuccess': {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.dark,
  },
  '&.MuiAlert-standardError': {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.dark,
  },
  '&.MuiAlert-standardWarning': {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.dark,
  },
  '&.MuiAlert-standardInfo': {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.dark,
  },
}));

export const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  '& .MuiSnackbarContent-root': {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[3],
  },
}));
