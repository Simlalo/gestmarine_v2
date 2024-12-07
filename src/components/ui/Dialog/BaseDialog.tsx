import React from 'react';
import {
  Dialog as MuiDialog,
  DialogProps as MuiDialogProps,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface DialogProps extends Omit<MuiDialogProps, 'title'> {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export const BaseDialog: React.FC<DialogProps> = ({
  title,
  actions,
  children,
  showCloseButton = true,
  onClose,
  ...props
}) => {
  return (
    <MuiDialog
      {...props}
      onClose={onClose}
      aria-labelledby="dialog-title"
    >
      {title && (
        <DialogTitle id="dialog-title" sx={{ m: 0, p: 2 }}>
          {title}
          {showCloseButton && onClose && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}
      <DialogContent>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </MuiDialog>
  );
};
