import { useState, useCallback } from 'react';

export interface DialogState {
  isOpen: boolean;
  data?: any;
}

export interface UseDialogReturn {
  isOpen: boolean;
  data: any;
  open: (data?: any) => void;
  close: () => void;
  toggle: () => void;
}

export const useDialog = (initialState: boolean = false): UseDialogReturn => {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: initialState,
    data: undefined,
  });

  const open = useCallback((data?: any) => {
    setDialogState({ isOpen: true, data });
  }, []);

  const close = useCallback(() => {
    setDialogState({ isOpen: false, data: undefined });
  }, []);

  const toggle = useCallback(() => {
    setDialogState((prev) => ({ 
      isOpen: !prev.isOpen, 
      data: !prev.isOpen ? prev.data : undefined 
    }));
  }, []);

  return {
    isOpen: dialogState.isOpen,
    data: dialogState.data,
    open,
    close,
    toggle,
  };
};
