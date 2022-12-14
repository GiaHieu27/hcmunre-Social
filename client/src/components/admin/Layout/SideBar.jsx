import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  colors,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ArticleIcon from '@mui/icons-material/Article';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

const sideBarItems = [
  {
    text: 'Bảng điều khiển',
    path: '/admin',
    icon: <DashboardCustomizeOutlinedIcon />,
  },
  {
    text: 'Người dùng',
    path: '/admin/user/',
    icon: <PersonOutlineOutlinedIcon />,
  },
  {
    text: 'Bài viết',
    path: '/admin/post/',
    icon: <ArticleIcon />,
  },
  {
    text: 'Duyệt bài',
    path: '/admin/post-pending/',
    icon: <PendingActionsIcon />,
  },
  {
    text: 'Quản trị viên',
    path: '/admin/all-admin/',
    icon: <AdminPanelSettingsIcon />,
  },
];

function SideBar() {
  const location = useLocation();
  const SIDE_BAR_WIDTH = 250;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const activeItem = sideBarItems.findIndex((item) => {
      return window.location.pathname.split('/')[2] === item.path.split('/')[2];
    });
    setActiveIndex(activeItem);
  }, [location]);

  return (
    <Drawer
      variant='permanent'
      container={window.document.body}
      sx={{
        width: SIDE_BAR_WIDTH,
        height: '100vh',
        boxShadow: 3,
        '& .MuiDrawer-paper': {
          boxSizing: 'border-box',
          width: SIDE_BAR_WIDTH,
          borderRight: 0,
        },
      }}
    >
      <Toolbar />
      <List>
        {sideBarItems.map((item, i) => {
          return (
            <ListItemButton
              key={`sidebar-key-${i}`}
              selected={i === activeIndex}
              component={Link}
              to={item.path}
              sx={{
                width: 'calc(100% - 20px)',
                margin: '5px auto',
                borderRadius: '10px',
                '&.Mui-selected': {
                  color: colors.green.A700,
                  backgroundColor: colors.green[50],
                },
                '&.Mui-selected:hover': {
                  backgroundColor: colors.green[100],
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: i === activeIndex && colors.green.A700,
                  minWidth: '34px',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& span': {
                    fontWeight: i === activeIndex && '500',
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
}

export default SideBar;
