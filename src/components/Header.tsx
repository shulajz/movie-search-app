import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink, useLocation } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import SearchIcon from "@mui/icons-material/Search";
import ThemeSwitcher from "./ThemeSwitcher";
import { useThemeContext } from "../context/ThemeContext";

const Header: React.FC = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const navItems = [
    {
      name: "Search",
      path: "/",
      icon: <SearchIcon fontSize="small" sx={{ mr: 1 }} />,
    },
    {
      name: "Favorites",
      path: "/favorites",
      icon: <FavoriteIcon fontSize="small" sx={{ mr: 1 }} />,
    },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: <WatchLaterIcon fontSize="small" sx={{ mr: 1 }} />,
    },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{
          my: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <MovieIcon />
        MotionPicks
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              component={RouterLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                textAlign: "center",
                color:
                  location.pathname === item.path
                    ? "primary.main"
                    : "text.primary",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.icon}
                <ListItemText primary={item.name} />
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" elevation={3} color="default">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <MovieIcon
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              color: "primary.main",
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: mode === "light" ? "text.primary" : "inherit",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            MotionPicks
          </Typography>

          <ThemeSwitcher />

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better mobile performance
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: "flex" }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : mode === "light"
                        ? "text.primary"
                        : "white",
                    "&:hover": {
                      color: "primary.main",
                    },
                    mx: 1,
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
