import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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
import MapIcon from '@mui/icons-material/Map';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import StatsIcon from '@mui/icons-material/BarChart';
import { LinkProps } from '@mui/material/Link';

interface DrawerLinkProps extends LinkProps {
  active: boolean;
}

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
  transition: 'background-color 0.3s ease-in-out, transform 0.3s ease',
  '&:hover, &.active': {
    textDecoration: 'none',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white, // Ensure the color remains white
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    marginRight: theme.spacing(1),
    transform: 'scale(1.05)', // Scale up slightly on hover
  },
}));

const DropdownButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  marginLeft: theme.spacing(1),
  textTransform: 'none',
  fontFamily: 'Quicksand, sans-serif',
  transition: 'background-color 0.3s, transform 0.3s ease',
  '&:hover, &.active': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)', // Scale up slightly on hover
  },
}));

const RightLink = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  borderColor: theme.palette.common.white,
  fontFamily: 'Quicksand, sans-serif',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    transform: 'scale(1.05)', // Scale up slightly on hover
  },
}));

const DrawerList = styled(List)(({ theme }) => ({
  backgroundColor: 'rgb(7, 55, 99)',
  height: '100%',
  color: theme.palette.common.white,
  fontFamily: 'Quicksand, sans-serif',
}));

const DrawerLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'active',
})<DrawerLinkProps>(({ theme, active }) => ({
  color: theme.palette.common.white,
  textDecoration: 'none',
  backgroundColor: active ? theme.palette.primary.dark : 'transparent', // Highlight background if active
  display: 'flex',
  alignItems: 'center',
  transition: 'background-color 0.3s ease-in-out, transform 0.3s ease',
  '&:hover, &.active': {
    textDecoration: 'none',
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.common.white,
    transform: 'scale(1.05)', // Scale up slightly on hover
  },
}));

const icons: { [key: string]: JSX.Element } = {
  Home: <HomeIcon />,
  Providers: <PeopleIcon />,
  'Document Upload': <UploadFileIcon />,
  'Educational Resources': <SchoolIcon />,
  Reports: <ReportIcon />,
  'Business Dashboard': <DashboardIcon />,
  'Documents Dashboard': <FolderIcon />,
  'Admin Map': <MapIcon />,
  'Heat Map': <ThermostatIcon />,
  'Calculator Usage Stats': <StatsIcon />,
  'User': <PeopleIcon />,
  About: <InfoIcon />
};

const NavBar: React.FC<NavbarProps> = ({ isLoggedIn, onLogInButton }) => {
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState<null | HTMLElement>(null);
  const [mapMenuOpen, setMapMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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

  const handleMapMenuClick = () => {
    setMapMenuOpen(!mapMenuOpen);
  };

  const handleAdminDashboardMenuClick = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAdminAnchorEl(null);
  };

  // Check if any menu item is active to style the parent dropdown
  const isDropdownActive = [
    '/DocumentUpload',
    '/MapV2',
    '/CarbonEmissionsCalculator',
  ].some(isActive);

  const isAdminDropdownActive = [
    '/UserManagement',
    '/Reports',
    '/QuickSightDashboard',
    '/DocumentsDashboard',
    '/AdminMap',
    '/AdminMapAnalytics',
    '/calcUsageStats',
  ].some(isActive);

  const drawerContent = (
    <DrawerList>
      <ListItem>
        <Link href="/" sx={{ width: '100%' }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: '55px', margin: theme.spacing(1) }}
          />
        </Link>
      </ListItem>
      <ListItem disablePadding>
        <DrawerLink href="/" sx={{ width: '100%' }} active={isActive('/')}>
          {icons.Home}
          <ListItemText primary="Home" sx={{ marginLeft: theme.spacing(1) }} />
        </DrawerLink>
      </ListItem>
      <ListItem disablePadding>
        <DrawerLink
          href="/Provider"
          sx={{ width: '100%' }}
          active={isActive('/Provider')}
        >
          {icons.Providers}
          <ListItemText
            primary="Providers"
            sx={{ marginLeft: theme.spacing(1) }}
          />
        </DrawerLink>
      </ListItem>
      <ListItem disablePadding>
        <DrawerLink
          href="/EducationalResources"
          sx={{ width: '100%' }}
          active={isActive('/EducationalResources')}
        >
          {icons['Educational Resources']}
          <ListItemText
            primary="Educational Resources"
            sx={{ marginLeft: theme.spacing(1) }}
          />
        </DrawerLink>
      </ListItem>
      <ListItem button onClick={handleMapMenuClick}>
        {icons['Admin Map']}
        <ListItemText
          primary="Map & Calculator"
          sx={{ marginLeft: theme.spacing(1) }}
        />
        {mapMenuOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={mapMenuOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem disablePadding>
            <DrawerLink
              href="/DocumentUpload"
              sx={{ width: '100%', pl: 4 }}
              active={isActive('/DocumentUpload')}
            >
              {icons['Document Upload']}
              <ListItemText
                primary="Document Upload"
                sx={{ marginLeft: theme.spacing(1) }}
              />
            </DrawerLink>
          </ListItem>
          <ListItem disablePadding>
            <DrawerLink
              href="/MapV2"
              sx={{ width: '100%', pl: 4 }}
              active={isActive('/MapV2')}
            >
              {icons['Admin Map']}
              <ListItemText
                primary="Map"
                sx={{ marginLeft: theme.spacing(1) }}
              />
            </DrawerLink>
          </ListItem>
          <ListItem disablePadding>
            <DrawerLink
              href="/CarbonEmissionsCalculator"
              sx={{ width: '100%', pl: 4 }}
              active={isActive('/CarbonEmissionsCalculator')}
            >
              {icons['Calculator Usage Stats']}
              <ListItemText
                primary="Carbon Calculator"
                sx={{ marginLeft: theme.spacing(1) }}
              />
            </DrawerLink>
          </ListItem>
        </List>
      </Collapse>
      <ListItem disablePadding>
        <DrawerLink
          href="/About"
          sx={{ width: '100%' }}
          active={isActive('/About')}
        >
          {icons.About}
          <ListItemText
            primary="About"
            sx={{ marginLeft: theme.spacing(1) }}
          />
        </DrawerLink>
      </ListItem>
      {isLoggedIn && (
        <>
          <ListItem button onClick={handleAdminDashboardMenuClick}>
            {icons.Reports}
            <ListItemText
              primary="Admin Dashboard"
              sx={{ marginLeft: theme.spacing(1) }}
            />
            {adminMenuOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem disablePadding>
                <DrawerLink
                  href="/UserManagement"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/UserManagement')}
                >
                  {icons.User}
                  <ListItemText
                    primary="User Management"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
              <ListItem disablePadding>
                <DrawerLink
                  href="/Reports"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/Reports')}
                >
                  {icons.Reports}
                  <ListItemText
                    primary="Reports"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
              <ListItem disablePadding>
                <DrawerLink
                  href="/QuickSightDashboard"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/QuickSightDashboard')}
                >
                  {icons['Business Dashboard']}
                  <ListItemText
                    primary="Business Dashboard"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
              <ListItem disablePadding>
                <DrawerLink
                  href="/DocumentsDashboard"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/DocumentsDashboard')}
                >
                  {icons['Documents Dashboard']}
                  <ListItemText
                    primary="Documents Dashboard"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
              <ListItem disablePadding>
                <DrawerLink
                  href="/AdminMap"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/AdminMap')}
                >
                  {icons['Admin Map']}
                  <ListItemText
                    primary="Admin Map"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
              <ListItem disablePadding>
                <DrawerLink
                  href="/AdminMapAnalytics"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/AdminMapAnalytics')}
                >
                  {icons['Heat Map']}
                  <ListItemText
                    primary="Heat Map"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
              <ListItem disablePadding>
                <DrawerLink
                  href="/calcUsageStats"
                  sx={{ width: '100%', pl: 4 }}
                  active={isActive('/calcUsageStats')}
                >
                  {icons['Calculator Usage Stats']}
                  <ListItemText
                    primary="Statistics"
                    sx={{ marginLeft: theme.spacing(1) }}
                  />
                </DrawerLink>
              </ListItem>
            </List>
          </Collapse>
        </>
      )}
    </DrawerList>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: 'rgb(7, 55, 99)' }}>
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
          <Link href="/" className={isActive('/') ? 'active' : ''}>
            <img src={logo} alt="Logo" style={{ height: '55px' }} />
          </Link>
          {!isMobile && (
            <>
              <StyledLink href="/" className={isActive('/') ? 'active' : ''}>
                Home
              </StyledLink>
              <StyledLink
                href="/Provider"
                className={isActive('/Provider') ? 'active' : ''}
              >
                Providers
              </StyledLink>
              <StyledLink
                href="/EducationalResources"
                className={isActive('/EducationalResources') ? 'active' : ''}
              >
                Educational Resources
              </StyledLink>
              <DropdownButton
                aria-controls="map-menu"
                aria-haspopup="true"
                onClick={handleMenuClick}
                className={isDropdownActive ? 'active' : ''}
              >
                Map & Calculator
              </DropdownButton>
              <Menu
                id="map-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                  sx: {
                    bgcolor: 'rgb(7, 55, 99)', // Same background color as NavBar
                    color: 'white', // White text color
                  },
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  href="/DocumentUpload"
                  className={isActive('/DocumentUpload') ? 'active' : ''}
                >
                  Document Upload
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  href="/MapV2"
                  className={isActive('/MapV2') ? 'active' : ''}
                >
                  Map
                </MenuItem>
                <MenuItem
                  onClick={handleClose}
                  component={Link}
                  href="/CarbonEmissionsCalculator"
                  className={isActive('/CarbonEmissionsCalculator') ? 'active' : ''}
                >
                  Carbon Calculator
                </MenuItem>
              </Menu>
              <StyledLink
                href="/About"
                className={isActive('/About') ? 'active' : ''}
              >
                About
              </StyledLink>
              {isLoggedIn && (
                <>
                  <DropdownButton
                    aria-controls="admin-menu"
                    aria-haspopup="true"
                    onClick={handleAdminMenuClick}
                    className={isAdminDropdownActive ? 'active' : ''}
                  >
                    Admin Dashboard
                  </DropdownButton>
                  <Menu
                    id="admin-menu"
                    anchorEl={adminAnchorEl}
                    keepMounted
                    open={Boolean(adminAnchorEl)}
                    onClose={handleClose}
                    MenuListProps={{
                      sx: {
                        bgcolor: 'rgb(7, 55, 99)', // Same background color as NavBar
                        color: 'white', // White text color
                      },
                    }}
                  >
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/UserManagement"
                      className={isActive('/UserManagements') ? 'active' : ''}
                    >
                      User Management
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/Reports"
                      className={isActive('/Reports') ? 'active' : ''}
                    >
                      Reports
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/QuickSightDashboard"
                      className={isActive('/QuickSightDashboard') ? 'active' : ''}
                    >
                      Business Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/DocumentsDashboard"
                      className={isActive('/DocumentsDashboard') ? 'active' : ''}
                    >
                      Documents Dashboard
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/AdminMap"
                      className={isActive('/AdminMap') ? 'active' : ''}
                    >
                      Admin Map
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/AdminMapAnalytics"
                      className={isActive('/AdminMapAnalytics') ? 'active' : ''}
                    >
                      Heat Map
                    </MenuItem>
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      href="/calcUsageStats"
                      className={isActive('/calcUsageStats') ? 'active' : ''}
                    >
                      Statistics
                    </MenuItem>
                  </Menu>
                </>
              )}
            </>
          )}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            {isLoggedIn ? (
              <>
                {userName && (
                  <Box
                    sx={{ color: 'common.white', marginRight: 1, marginLeft: 1 }}
                  >
                    Hello, {userName}!
                  </Box>
                )}
                {isMobile ? (
                  <IconButton onClick={onLogInButton} color="inherit">
                    <ExitToAppIcon />
                  </IconButton>
                ) : (
                  <RightLink
                    onClick={onLogInButton}
                    variant="outlined"
                    className={isActive('/logout') ? 'active' : ''}
                  >
                    Logout
                  </RightLink>
                )}
              </>
            ) : (
              <RightLink
                onClick={onLogInButton}
                variant="outlined"
                className={isActive('/login') ? 'active' : ''}
              >
                Login
              </RightLink>
            )}
          </Box>
        </StyledToolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}
      >
        {drawerContent}
      </Drawer>
      <Toolbar /> {/* This Toolbar is just to offset the content below the AppBar */}
    </Box>
  );
};

export default NavBar;
