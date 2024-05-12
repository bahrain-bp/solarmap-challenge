import React, { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import { fetchUserAttributes } from '@aws-amplify/auth';
import logo from "../assets/logo.png";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import PeopleIcon from '@mui/icons-material/People';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SchoolIcon from '@mui/icons-material/School';
import ReportIcon from '@mui/icons-material/Assessment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogInButton: () => void;
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  justifyContent: 'space-between',
  backgroundColor: 'rgb(7, 55, 99)',
  fontFamily: 'Quicksand, sans-serif',
  transition: 'background-color 0.3s ease-in-out',
  [theme.breakpoints.up('sm')]: {
    minHeight: 70,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(3),
  fontFamily: 'Quicksand, sans-serif',
  transition: 'background-color 0.3s ease-in-out',
  '&:hover': {
    textDecoration: 'none',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
  },
}));

const DropdownButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(1),
  textTransform: 'none',
  fontFamily: 'Quicksand, sans-serif',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const RightLink = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  borderColor: theme.palette.common.white,
  fontFamily: 'Quicksand, sans-serif',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const DrawerList = styled(List)(({ theme }) => ({
  backgroundColor: 'rgb(7, 55, 99)',
  height: '100%',
  color: theme.palette.common.white,
  fontFamily: 'Quicksand, sans-serif',
}));

const DrawerLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.white,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'none',
  },
  display: 'flex',
  alignItems: 'center',
}));

const icons: { [key: string]: JSX.Element } = {
  Home: <HomeIcon />,
  About: <InfoIcon />,
  Providers: <PeopleIcon />,
  'Document Upload': <UploadFileIcon />,
  'Educational Resources': <SchoolIcon />,
  Reports: <ReportIcon />,
  'Business Dashboard': <DashboardIcon />,
  'Documents Dashboard': <FolderIcon />,
};

const NavBar: React.FC<NavbarProps> = ({ isLoggedIn, onLogInButton }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  async function getUserInfo() {
    try {
      const data = await fetchUserAttributes();
      setUserName(data.given_name ?? null);
    } catch (error) {
      console.error('Failed to fetch user attributes:', error);
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      getUserInfo();
    }
  }, [isLoggedIn]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAdminAnchorEl(null);
  };

  const drawerContent = (
    <DrawerList>
      <ListItem>
        <Link href="/" sx={{ width: '100%' }}>
          <img src={logo} alt="Logo" style={{ height: '55px', margin: theme.spacing(1) }} />
        </Link>
      </ListItem>
      {['Home', 'About', 'Providers', 'Document Upload', 'Educational Resources'].map((text) => (
        <ListItem key={text} disablePadding>
          <DrawerLink href={`/${text.replace(/ /g, '')}`} sx={{ width: '100%' }}>
            {icons[text as keyof typeof icons]}
            <ListItemText primary={text} sx={{ marginLeft: theme.spacing(1) }} />
          </DrawerLink>
        </ListItem>
      ))}
      {isLoggedIn && ['Reports', 'Business Dashboard', 'Documents Dashboard'].map((text) => (
        <ListItem key={text} disablePadding>
          <DrawerLink href={`/${text.replace(/ /g, '')}`} sx={{ width: '100%' }}>
            {icons[text as keyof typeof icons]}
            <ListItemText primary={text} sx={{ marginLeft: theme.spacing(1) }} />
          </DrawerLink>
        </ListItem>
      ))}
    </DrawerList>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: isLoggedIn ? 'rgb(7, 55, 99)' : 'rgb(7, 55, 99)' }}>
        <StyledToolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Link href="/">
            <img src={logo} alt="Logo" style={{ height: '55px' }} />
          </Link>
          {!isMobile && (
            <>
              <StyledLink href="/">Home</StyledLink>
              <StyledLink href="/About">About</StyledLink>
              <StyledLink href="/Provider">Providers</StyledLink>
              <DropdownButton aria-controls="map-menu" aria-haspopup="true" onClick={handleMenuClick}>
                Map & Calculator
              </DropdownButton>
              <Menu
                id="map-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose} component={Link} href="/DocumentUpload">Document Upload</MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/MapV2">Map V2</MenuItem>
                <MenuItem onClick={handleClose} component={Link} href="/CarbonEmissionsCalculator">Carbon Calculator</MenuItem>
              </Menu>
              {isLoggedIn && (
                <>
                  <DropdownButton aria-controls="admin-menu" aria-haspopup="true" onClick={handleAdminMenuClick}>
                    Admin Dashboard
                  </DropdownButton>
                  <Menu
                    id="admin-menu"
                    anchorEl={adminAnchorEl}
                    keepMounted
                    open={Boolean(adminAnchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose} component={Link} href="/Reports">Reports</MenuItem>
                    <MenuItem onClick={handleClose} component={Link} href="/QuickSightDashboard">Business Dashboard</MenuItem>
                    <MenuItem onClick={handleClose} component={Link} href="/DocumentsDashboard">Documents Dashboard</MenuItem>
                  </Menu>
                </>
              )}
            </>
          )}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isLoggedIn ? (
              <>
                {userName && <Box sx={{ color: 'common.white', marginRight: 2 }}>Hello, {userName}!</Box>}
                <RightLink onClick={onLogInButton} variant="outlined">Logout</RightLink>
              </>
            ) : (
              <RightLink onClick={onLogInButton} variant="outlined">Login</RightLink>
            )}
          </Box>
        </StyledToolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawerContent}
      </Drawer>
      <Toolbar /> {/* This Toolbar is just to offset the content below the AppBar */}
    </Box>
  );
};

export default NavBar;
