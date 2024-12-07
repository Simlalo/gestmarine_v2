import React from 'react';
import { render, screen, fireEvent } from '../../../setup/test-utils';
import BaseDialog from '../../../../components/ui/Dialog/BaseDialog';

describe('BaseDialog Component', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    title: 'Test Dialog',
    maxWidth: 'sm' as const,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders correctly when open', () => {
    render(
      <BaseDialog {...defaultProps}>
        <div>Dialog Content</div>
      </BaseDialog>
    );

    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <BaseDialog {...defaultProps} open={false}>
        <div>Dialog Content</div>
      </BaseDialog>
    );

    expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument();
    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <BaseDialog {...defaultProps}>
        <div>Dialog Content</div>
      </BaseDialog>
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking outside the dialog', () => {
    render(
      <BaseDialog {...defaultProps}>
        <div>Dialog Content</div>
      </BaseDialog>
    );

    // Click the backdrop
    const backdrop = document.querySelector('.MuiBackdrop-root');
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('renders with custom title component', () => {
    const CustomTitle = () => <h2>Custom Title</h2>;
    render(
      <BaseDialog {...defaultProps} title={<CustomTitle />}>
        <div>Dialog Content</div>
      </BaseDialog>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('applies custom styles when provided', () => {
    const customStyles = {
      paper: {
        backgroundColor: 'rgb(255, 0, 0)',
      },
    };

    render(
      <BaseDialog {...defaultProps} styles={customStyles}>
        <div>Dialog Content</div>
      </BaseDialog>
    );

    const dialogPaper = document.querySelector('.MuiPaper-root');
    expect(dialogPaper).toHaveStyle({ backgroundColor: 'rgb(255, 0, 0)' });
  });
});
