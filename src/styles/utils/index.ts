export * from './spacing';
export * from './typography';
export * from './flexbox';
export * from './grid';
export * from './animations';

// Re-export commonly used utility functions
export { 
    createResponsiveTypography,
    createFlexContainer,
    createResponsiveGrid,
    createAnimation,
} from './typography';

// Combine all utilities into a single object for convenience
export const styleUtils = {
    spacing: require('./spacing').spacingUtils,
    typography: require('./typography').typographyUtils,
    flex: require('./flexbox').flexUtils,
    grid: require('./grid').gridUtils,
    animation: require('./animations').animationUtils,
};
