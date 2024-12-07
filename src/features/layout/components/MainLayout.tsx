import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { useTheme } from '../../../features/theme/context/ThemeContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MainRoot, MainContainer, ContentArea } from './styled/layout';
import { ErrorBoundary } from '../../../components/ErrorBoundary';

const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const muiTheme = useMuiTheme();
  const { mode } = useTheme();
  const isUnder900px = useMediaQuery('(max-width:900px)');

  useEffect(() => {
    setIsSidebarCollapsed(isUnder900px);
  }, [isUnder900px]);

  const handleToggleSidebar = () => {
    if (!isUnder900px) {
      setIsSidebarCollapsed(prev => !prev);
    }
  };

  return (
    <MainRoot>
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={handleToggleSidebar} />
      <MainContainer isSidebarCollapsed={isSidebarCollapsed}>
        <Header />
        <ContentArea component="main">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </ContentArea>
      </MainContainer>
    </MainRoot>
  );
};

export default MainLayout;
