import { css } from '@mui/material/styles';

export const typographyUtils = {
  truncate: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,

  multiLineEllipsis: (lines: number) => css`
    display: -webkit-box;
    -webkit-line-clamp: ${lines};
    -webkit-box-orient: vertical;
    overflow: hidden;
  `,

  fontWeight: {
    light: css`
      font-weight: 300;
    `,
    regular: css`
      font-weight: 400;
    `,
    medium: css`
      font-weight: 500;
    `,
    semibold: css`
      font-weight: 600;
    `,
    bold: css`
      font-weight: 700;
    `,
  },

  fontSize: (size: number | string) => css`
    font-size: ${typeof size === 'number' ? `${size}px` : size};
  `,

  lineHeight: (height: number | string) => css`
    line-height: ${typeof height === 'number' ? height : height};
  `,

  textAlign: {
    left: css`
      text-align: left;
    `,
    center: css`
      text-align: center;
    `,
    right: css`
      text-align: right;
    `,
    justify: css`
      text-align: justify;
    `,
  },

  textTransform: {
    uppercase: css`
      text-transform: uppercase;
    `,
    lowercase: css`
      text-transform: lowercase;
    `,
    capitalize: css`
      text-transform: capitalize;
    `,
  },

  responsive: {
    heading1: css`
      font-size: ${({ theme }) => theme.typography.h1.fontSize};
      font-weight: ${({ theme }) => theme.typography.h1.fontWeight};
      line-height: 1.2;
      
      ${({ theme }) => theme.breakpoints.down('md')} {
        font-size: calc(${({ theme }) => theme.typography.h1.fontSize} * 0.85);
      }
      
      ${({ theme }) => theme.breakpoints.down('sm')} {
        font-size: calc(${({ theme }) => theme.typography.h1.fontSize} * 0.7);
      }
    `,
    heading2: css`
      font-size: ${({ theme }) => theme.typography.h2.fontSize};
      font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
      line-height: 1.3;
      
      ${({ theme }) => theme.breakpoints.down('md')} {
        font-size: calc(${({ theme }) => theme.typography.h2.fontSize} * 0.85);
      }
      
      ${({ theme }) => theme.breakpoints.down('sm')} {
        font-size: calc(${({ theme }) => theme.typography.h2.fontSize} * 0.7);
      }
    `,
  },
};

// Helper functions
export const createResponsiveTypography = (
  baseFontSize: number | string,
  options?: {
    mdScale?: number;
    smScale?: number;
    lineHeight?: number | string;
    fontWeight?: number | string;
  }
) => css`
  font-size: ${baseFontSize};
  line-height: ${options?.lineHeight || 1.5};
  font-weight: ${options?.fontWeight || 'inherit'};
  
  ${({ theme }) => theme.breakpoints.down('md')} {
    font-size: calc(${baseFontSize} * ${options?.mdScale || 0.85});
  }
  
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: calc(${baseFontSize} * ${options?.smScale || 0.7});
  }
`;
