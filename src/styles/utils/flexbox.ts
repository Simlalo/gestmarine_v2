import { css } from '@mui/material/styles';

export const flexUtils = {
  row: css`
    display: flex;
    flex-direction: row;
  `,

  column: css`
    display: flex;
    flex-direction: column;
  `,

  center: css`
    display: flex;
    align-items: center;
    justify-content: center;
  `,

  alignItems: {
    start: css`
      align-items: flex-start;
    `,
    center: css`
      align-items: center;
    `,
    end: css`
      align-items: flex-end;
    `,
    stretch: css`
      align-items: stretch;
    `,
    baseline: css`
      align-items: baseline;
    `,
  },

  justifyContent: {
    start: css`
      justify-content: flex-start;
    `,
    center: css`
      justify-content: center;
    `,
    end: css`
      justify-content: flex-end;
    `,
    between: css`
      justify-content: space-between;
    `,
    around: css`
      justify-content: space-around;
    `,
    evenly: css`
      justify-content: space-evenly;
    `,
  },

  flex: (value: number | string) => css`
    flex: ${value};
  `,

  flexGrow: (value: number) => css`
    flex-grow: ${value};
  `,

  flexShrink: (value: number) => css`
    flex-shrink: ${value};
  `,

  flexBasis: (value: number | string) => css`
    flex-basis: ${typeof value === 'number' ? `${value}px` : value};
  `,

  wrap: css`
    flex-wrap: wrap;
  `,

  nowrap: css`
    flex-wrap: nowrap;
  `,

  wrapReverse: css`
    flex-wrap: wrap-reverse;
  `,

  // Common flex layouts
  layouts: {
    centerAll: css`
      display: flex;
      align-items: center;
      justify-content: center;
    `,
    
    spaceBetween: css`
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
    
    columnCenter: css`
      display: flex;
      flex-direction: column;
      align-items: center;
    `,
    
    columnStretch: css`
      display: flex;
      flex-direction: column;
      align-items: stretch;
    `,
  },

  // Responsive flex utilities
  responsive: {
    row: css`
      display: flex;
      flex-direction: row;
      
      ${({ theme }) => theme.breakpoints.down('sm')} {
        flex-direction: column;
      }
    `,
    
    rowReverse: css`
      display: flex;
      flex-direction: row;
      
      ${({ theme }) => theme.breakpoints.down('sm')} {
        flex-direction: column-reverse;
      }
    `,
  },
};

// Helper function to create a flex container with custom properties
export const createFlexContainer = (options?: {
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  gap?: number;
}) => css`
  display: flex;
  flex-direction: ${options?.direction || 'row'};
  align-items: ${options?.align === 'start' ? 'flex-start' :
                 options?.align === 'end' ? 'flex-end' :
                 options?.align || 'stretch'};
  justify-content: ${options?.justify === 'start' ? 'flex-start' :
                    options?.justify === 'end' ? 'flex-end' :
                    options?.justify === 'between' ? 'space-between' :
                    options?.justify === 'around' ? 'space-around' :
                    options?.justify === 'evenly' ? 'space-evenly' :
                    options?.justify || 'flex-start'};
  flex-wrap: ${options?.wrap || 'nowrap'};
  gap: ${({ theme }) => options?.gap ? theme.spacing(options.gap) : 0};
`;
