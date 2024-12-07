import { styled } from '@mui/material/styles';

interface NavLinkProps {
  active?: boolean;
}

interface NavMobileMenuProps {
  open?: boolean;
}

export const NavRoot = styled('nav')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'relative',
  zIndex: theme.zIndex.appBar,
}));

export const NavContent = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
}));

export const NavLogo = styled('a')(({ theme }) => ({
  fontSize: theme.typography.h6.fontSize,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  textDecoration: 'none',
}));

export const NavLinks = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const NavLink = styled('a')<NavLinkProps>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  textDecoration: 'none',
  fontWeight: theme.typography.fontWeightMedium,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(['color', 'background-color']),
  backgroundColor: active ? theme.palette.action.selected : 'transparent',

  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const NavActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const NavToggle = styled('button')(({ theme }) => ({
  display: 'none',
  padding: theme.spacing(0.5),
  color: theme.palette.text.primary,
  cursor: 'pointer',
  border: 'none',
  background: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block',
  },
}));

export const NavMobileMenu = styled('div')<NavMobileMenuProps>(({ theme, open }) => ({
  display: open ? 'block' : 'none',
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  zIndex: theme.zIndex.drawer,

  '& ${NavLinks}': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },

  '& ${NavLink}': {
    width: '100%',
    padding: theme.spacing(1),
  },
}));

export const NavDropdown = styled('div')(({ theme }) => ({
  position: 'relative',
}));

export const NavDropdownContent = styled('div')(({ theme }) => ({
  display: 'none',
  position: 'absolute',
  top: '100%',
  right: 0,
  minWidth: 200,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  padding: theme.spacing(0.5, 0),

  [`${NavDropdown}:hover &`]: {
    display: 'block',
  },
}));

export const NavDropdownItem = styled('a')(({ theme }) => ({
  display: 'block',
  padding: theme.spacing(1, 2),
  color: theme.palette.text.primary,
  textDecoration: 'none',
  transition: theme.transitions.create('background-color'),

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Export as a component object
export const Navigation = {
  Root: NavRoot,
  Content: NavContent,
  Logo: NavLogo,
  Links: NavLinks,
  Link: NavLink,
  Actions: NavActions,
  Toggle: NavToggle,
  MobileMenu: NavMobileMenu,
  Dropdown: NavDropdown,
  DropdownContent: NavDropdownContent,
  DropdownItem: NavDropdownItem,
};
