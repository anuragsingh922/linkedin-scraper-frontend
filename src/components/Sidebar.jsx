import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useZustandStore } from "../store/store";
import { Button, FormControl, MenuItem, Select } from "@mui/material";

const drawerWidth = 340;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const { user, setUser, setIsSignedIn, isSignedIn } = useZustandStore();
  const { pathname } = useLocation();
  const handleDrawerOpen = () => {
    setOpen(false);
  };
  const option = pathname.includes("request")
    ? "Send Connection Request"
    : pathname.includes("emails")
    ? "Send Emails"
    : "Home";
  const [optionBox, setOptionBox] = React.useState(option);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const nav = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    setUser({});
    setIsSignedIn(false);
    nav("/");
  };

  if (!isSignedIn) {
    return <Outlet />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            Outreach-Bot
          </Typography>{" "}
          {isSignedIn && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography
                variant="h6"
                color="inherit"
                sx={{ textTransform: "capitalize" }}
              >
                {user.name}
              </Typography>

              <Button variant="contained" onClick={handleSignOut}>
                SIGN OUT
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Box sx={{ px: 2, mt: 4 }}>
          <FormControl fullWidth>
            <Select
              value={optionBox}
              onChange={(e) => {
                setOptionBox(e.target.value);
                if (e.target.value.includes("Request")) {
                  nav("/connection-request");
                } else if (e.target.value.includes("Emails")) {
                  nav("/send-emails");
                } else if (e.target.value.includes("Job")) {
                  nav("/job");
                } else {
                  nav("/home");
                }
              }}
            >
              <MenuItem value={"Home"}>Home</MenuItem>
              <MenuItem value={"Job"}>Job</MenuItem>
              <MenuItem value={"Send Connection Request"}>
                Send Connection Request
              </MenuItem>
              <MenuItem value={"Send Emails"}>Send Emails</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Outlet />
      </Main>
    </Box>
  );
}
