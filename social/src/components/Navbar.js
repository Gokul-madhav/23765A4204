import { AppBar, Toolbar, Typography, Tabs, Tab } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const getActiveTab = () => {
    if (location.pathname === '/feed') return 0;
    if (location.pathname === '/trending') return 1;
    if (location.pathname === '/top-users') return 2;
    return 0;
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Social Media Analytics
        </Typography>
        <Tabs value={getActiveTab()} indicatorColor="secondary" textColor="inherit">
          <Tab label="Feed" component={Link} to="/feed" />
          <Tab label="Trending Posts" component={Link} to="/trending" />
          <Tab label="Top Users" component={Link} to="/top-users" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;