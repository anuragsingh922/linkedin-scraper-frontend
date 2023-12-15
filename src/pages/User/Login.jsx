import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useZustandStore } from "../../store/store";
import toast from "react-hot-toast";
import AxiosClient from "../../config/AxiosClient";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setIsSignedIn, isSignedIn } = useZustandStore();

  const handleLogin = async () => {
    try {
      const { data } = await AxiosClient.post("api/user/login", {
        email,
        password,
      });
      setUser(data);
      setIsSignedIn(true);

      localStorage.setItem("accessToken", data.token);
      nav("/home");
      toast.success("Login Successfull");
    } catch (error) {
      console.log(error);
      toast.error("Login failed");
    }
  };

  useEffect(() => {
    if (isSignedIn) nav("/home");
  }, [nav]);

  return (
    <Box
      // bgcolor="rgb(38, 39, 48)"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        bgcolor="black"
        p={3}
        borderRadius="8px"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
        textAlign="center"
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <form>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{ color: "black", bgcolor: "white", py: 1.5, mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginPage;
