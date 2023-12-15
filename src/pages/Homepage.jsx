import React, { useEffect } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useZustandStore } from "../store/store";

const Homepage = () => {
  const nav = useNavigate();
  const { isSignedIn } = useZustandStore();

  const containerStyle = {
    // backgroundColor: "rgb(38,39,48)",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "2px solid white",
    padding: "10px 20px",
    margin: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    color: "white",
  };

  useEffect(() => {
    if (isSignedIn) nav("/home");
  }, [nav]);

  return (
    <Box sx={containerStyle}>
      <Typography variant="h2">Welcome to Your AI Assistant</Typography>
      <Typography variant="p">
        Your AI-powered companion for tasks and information.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          onClick={() => {
            nav("/login");
          }}
          sx={buttonStyle}
        >
          Login
        </Button>
        <Button
          onClick={() => {
            nav("/register");
          }}
          sx={buttonStyle}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default Homepage;
