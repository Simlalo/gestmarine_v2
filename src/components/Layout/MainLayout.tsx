import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import { Sidebar } from '../Sidebar/Sidebar';
import { Header } from './Header';
import { MainRoot, MainContainer, ContentArea } from '../styled/layout';

export const MainLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const theme = useTheme();
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
          <Outlet />
        </ContentArea>
      </MainContainer>
    </MainRoot>
  );
};
