import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import AxiosClient from "../../config/AxiosClient";
import { useZustandStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RegisterPage = ({ onRegister }) => {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser, setIsSignedIn, isSignedIn } = useZustandStore();

  const handleRegister = async () => {
    try {
      const { data } = await AxiosClient.post("api/user", {
        name: username,
        email,
        password,
      });
      setUser(data);
      setIsSignedIn(true);
      localStorage.setItem("accessToken", data.token);
      nav("/home");
      toast.success("Registration Successfull");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
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
        // bgcolor="white"
        p={3}
        borderRadius="8px"
        boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
        textAlign="center"
        sx={{
          width: ["100%", "100%", 500],
          background: "black",
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontSize: "1.5rem" }}>
          Register
        </Typography>
        <form>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ color: "black" }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ color: "black" }}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ color: "black" }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleRegister}
            sx={{ color: "black", bgcolor: "white", py: 1.5, mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default RegisterPage;
