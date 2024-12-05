import React from 'react';
import { Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../hooks/useAuth';

interface SidebarFooterProps {
  isCollapsed: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ isCollapsed }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const content = (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
            <PersonIcon sx={{ fontSize: 16 }} className="text-primary-600 dark:text-primary-400" />
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="flex-grow min-w-0">
            <p className="text-sm font-medium truncate">
              {user.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user.role}
            </p>
          </div>
        )}

        <Tooltip title="Déconnexion" placement="right">
          <button
            onClick={logout}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Déconnexion"
          >
            <LogoutIcon sx={{ fontSize: 16 }} />
          </button>
        </Tooltip>
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <Tooltip title={user.email} placement="right" arrow>
        <div>{content}</div>
      </Tooltip>
    );
  }

  return content;
};
