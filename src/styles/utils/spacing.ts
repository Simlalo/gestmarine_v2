import { css } from '@mui/material/styles';

export const spacingUtils = {
  mt: (value: number) => css`
    margin-top: ${({ theme }) => theme.spacing(value)};
  `,
  mb: (value: number) => css`
    margin-bottom: ${({ theme }) => theme.spacing(value)};
  `,
  ml: (value: number) => css`
    margin-left: ${({ theme }) => theme.spacing(value)};
  `,
  mr: (value: number) => css`
    margin-right: ${({ theme }) => theme.spacing(value)};
  `,
  mx: (value: number) => css`
    margin-left: ${({ theme }) => theme.spacing(value)};
    margin-right: ${({ theme }) => theme.spacing(value)};
  `,
  my: (value: number) => css`
    margin-top: ${({ theme }) => theme.spacing(value)};
    margin-bottom: ${({ theme }) => theme.spacing(value)};
  `,
  m: (value: number) => css`
    margin: ${({ theme }) => theme.spacing(value)};
  `,
  pt: (value: number) => css`
    padding-top: ${({ theme }) => theme.spacing(value)};
  `,
  pb: (value: number) => css`
    padding-bottom: ${({ theme }) => theme.spacing(value)};
  `,
  pl: (value: number) => css`
    padding-left: ${({ theme }) => theme.spacing(value)};
  `,
  pr: (value: number) => css`
    padding-right: ${({ theme }) => theme.spacing(value)};
  `,
  px: (value: number) => css`
    padding-left: ${({ theme }) => theme.spacing(value)};
    padding-right: ${({ theme }) => theme.spacing(value)};
  `,
  py: (value: number) => css`
    padding-top: ${({ theme }) => theme.spacing(value)};
    padding-bottom: ${({ theme }) => theme.spacing(value)};
  `,
  p: (value: number) => css`
    padding: ${({ theme }) => theme.spacing(value)};
  `,
  gap: (value: number) => css`
    gap: ${({ theme }) => theme.spacing(value)};
  `,
};
