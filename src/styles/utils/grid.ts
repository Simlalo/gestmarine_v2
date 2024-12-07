import { css } from '@mui/material/styles';

export const gridUtils = {
  container: css`
    display: grid;
  `,

  columns: (count: number) => css`
    grid-template-columns: repeat(${count}, 1fr);
  `,

  gap: (value: number) => css`
    gap: ${({ theme }) => theme.spacing(value)};
  `,

  columnGap: (value: number) => css`
    column-gap: ${({ theme }) => theme.spacing(value)};
  `,

  rowGap: (value: number) => css`
    row-gap: ${({ theme }) => theme.spacing(value)};
  `,

  alignItems: {
    start: css`
      align-items: start;
    `,
    center: css`
      align-items: center;
    `,
    end: css`
      align-items: end;
    `,
    stretch: css`
      align-items: stretch;
    `,
  },

  justifyItems: {
    start: css`
      justify-items: start;
    `,
    center: css`
      justify-items: center;
    `,
    end: css`
      justify-items: end;
    `,
    stretch: css`
      justify-items: stretch;
    `,
  },

  alignContent: {
    start: css`
      align-content: start;
    `,
    center: css`
      align-content: center;
    `,
    end: css`
      align-content: end;
    `,
    between: css`
      align-content: space-between;
    `,
    around: css`
      align-content: space-around;
    `,
    evenly: css`
      align-content: space-evenly;
    `,
  },

  justifyContent: {
    start: css`
      justify-content: start;
    `,
    center: css`
      justify-content: center;
    `,
    end: css`
      justify-content: end;
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

  // Common responsive grid layouts
  responsive: {
    basic: css`
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: ${({ theme }) => theme.spacing(2)};
      
      ${({ theme }) => theme.breakpoints.down('md')} {
        grid-template-columns: repeat(8, 1fr);
      }
      
      ${({ theme }) => theme.breakpoints.down('sm')} {
        grid-template-columns: repeat(4, 1fr);
      }
    `,
    
    autoFit: (minWidth: number) => css`
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${minWidth}px, 1fr));
      gap: ${({ theme }) => theme.spacing(2)};
    `,
    
    autoFill: (minWidth: number) => css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(${minWidth}px, 1fr));
      gap: ${({ theme }) => theme.spacing(2)};
    `,
  },

  // Grid item utilities
  item: {
    columnSpan: (span: number) => css`
      grid-column: span ${span};
    `,
    
    rowSpan: (span: number) => css`
      grid-row: span ${span};
    `,
    
    columnStart: (start: number) => css`
      grid-column-start: ${start};
    `,
    
    columnEnd: (end: number) => css`
      grid-column-end: ${end};
    `,
    
    rowStart: (start: number) => css`
      grid-row-start: ${start};
    `,
    
    rowEnd: (end: number) => css`
      grid-row-end: ${end};
    `,
  },
};

// Helper function to create a responsive grid container
export const createResponsiveGrid = (options?: {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  rowGap?: number;
  columnGap?: number;
}) => css`
  display: grid;
  gap: ${({ theme }) => theme.spacing(options?.gap || 2)};
  row-gap: ${({ theme }) => options?.rowGap ? theme.spacing(options.rowGap) : 'inherit'};
  column-gap: ${({ theme }) => options?.columnGap ? theme.spacing(options.columnGap) : 'inherit'};
  
  grid-template-columns: repeat(${options?.columns?.xs || 1}, 1fr);
  
  ${({ theme }) => theme.breakpoints.up('sm')} {
    grid-template-columns: repeat(${options?.columns?.sm || options?.columns?.xs || 2}, 1fr);
  }
  
  ${({ theme }) => theme.breakpoints.up('md')} {
    grid-template-columns: repeat(${options?.columns?.md || options?.columns?.sm || 3}, 1fr);
  }
  
  ${({ theme }) => theme.breakpoints.up('lg')} {
    grid-template-columns: repeat(${options?.columns?.lg || options?.columns?.md || 4}, 1fr);
  }
  
  ${({ theme }) => theme.breakpoints.up('xl')} {
    grid-template-columns: repeat(${options?.columns?.xl || options?.columns?.lg || 4}, 1fr);
  }
`;
