import { css, keyframes } from '@mui/material/styles';

// Keyframe Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const slideInUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInDown = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Animation Utilities
export const animationUtils = {
  fadeIn: (duration = 300) => css`
    animation: ${fadeIn} ${duration}ms ease-in-out;
  `,

  fadeOut: (duration = 300) => css`
    animation: ${fadeOut} ${duration}ms ease-in-out;
  `,

  slideInUp: (duration = 300) => css`
    animation: ${slideInUp} ${duration}ms ease-out;
  `,

  slideInDown: (duration = 300) => css`
    animation: ${slideInDown} ${duration}ms ease-out;
  `,

  slideInLeft: (duration = 300) => css`
    animation: ${slideInLeft} ${duration}ms ease-out;
  `,

  slideInRight: (duration = 300) => css`
    animation: ${slideInRight} ${duration}ms ease-out;
  `,

  scaleIn: (duration = 300) => css`
    animation: ${scaleIn} ${duration}ms ease-out;
  `,

  rotate: (duration = 1000) => css`
    animation: ${rotate} ${duration}ms linear infinite;
  `,

  // Transition utilities
  transition: {
    all: (duration = 300) => css`
      transition: all ${duration}ms ease-in-out;
    `,
    
    transform: (duration = 300) => css`
      transition: transform ${duration}ms ease-in-out;
    `,
    
    opacity: (duration = 300) => css`
      transition: opacity ${duration}ms ease-in-out;
    `,
    
    colors: (duration = 300) => css`
      transition: background-color ${duration}ms ease-in-out,
                 color ${duration}ms ease-in-out,
                 border-color ${duration}ms ease-in-out;
    `,
  },

  // Hover animations
  hover: {
    scale: css`
      transition: transform 200ms ease-in-out;
      &:hover {
        transform: scale(1.05);
      }
    `,
    
    lift: css`
      transition: transform 200ms ease-in-out;
      &:hover {
        transform: translateY(-4px);
      }
    `,
    
    glow: css`
      transition: box-shadow 200ms ease-in-out;
      &:hover {
        box-shadow: ${({ theme }) => theme.shadows[4]};
      }
    `,
  },

  // Loading animations
  loading: {
    spinner: css`
      animation: ${rotate} 1s linear infinite;
    `,
    
    pulse: keyframes`
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(0.95);
        opacity: 0.7;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    `,
    
    shimmer: keyframes`
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    `,
  },
};

// Helper function to create custom animations
export const createAnimation = (options: {
  keyframes: string;
  duration?: number;
  timingFunction?: string;
  delay?: number;
  iterationCount?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}) => css`
  animation: ${keyframes`${options.keyframes}`}
             ${options.duration || 300}ms
             ${options.timingFunction || 'ease-in-out'}
             ${options.delay || 0}ms
             ${options.iterationCount || 1}
             ${options.direction || 'normal'}
             ${options.fillMode || 'none'};
`;
