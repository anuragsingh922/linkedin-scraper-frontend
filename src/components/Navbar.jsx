import React from "react";
import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useZustandStore } from "../store/store";

const Navbar = () => {
  const nav = useNavigate();
  const { user, setUser, setIsSignedIn, isSignedIn } = useZustandStore();
  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    setUser({});
    setIsSignedIn(false);
    nav("/");
  };
  return (
    <AppBar position="static" style={{ background: "black" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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
  );
};

export default Navbar;
