import { styled } from '@mui/material/styles';
import { AppBar, Box, Container, Grid, Paper } from '@mui/material';

interface MainContainerProps {
  isSidebarCollapsed: boolean;
}

// Header components
export const StyledHeader = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[1],
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.drawer + 1,
  width: '100%',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 2),
  minHeight: theme.custom.layout.headerHeight,
  gap: theme.spacing(2),
  [`@media (max-width: 900px)`]: {
    padding: theme.spacing(0, 1),
  }
}));

// Main layout components
export const MainRoot = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  overflow: 'hidden',
}));

export const MainContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isSidebarCollapsed',
})<MainContainerProps>(({ theme, isSidebarCollapsed }) => ({
  flexGrow: 1,
  marginLeft: isSidebarCollapsed 
    ? `${theme.custom.layout.sidebarCollapsedWidth}px` 
    : `${theme.custom.layout.sidebarWidth}px`,
  width: `calc(100% - ${isSidebarCollapsed ? theme.custom.layout.sidebarCollapsedWidth : theme.custom.layout.sidebarWidth}px)`,
  minHeight: '100vh',
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  [`@media (max-width: 900px)`]: {
    marginLeft: 0,
    width: '100%',
    padding: theme.spacing(1),
  }
}));

export const ContentArea = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: theme.custom.layout.headerHeight,
  minHeight: `calc(100vh - ${theme.custom.layout.headerHeight}px)`,
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  zIndex: theme.zIndex.drawer - 1,
  overflow: 'auto',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
    width: '100%',
  },
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.background.default,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.divider,
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  [`@media (max-width: 900px)`]: {
    padding: theme.spacing(2),
  }
}));

// Container components
export const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  [`@media (max-width: 900px)`]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  }
}));

export const GridContainer = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(3),
}));

export const GridItem = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
});

export const Section = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));
