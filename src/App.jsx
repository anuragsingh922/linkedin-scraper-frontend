import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import JOB from "./pages/Job_Home";
import Login from "./pages/User/Login";
import Register from "./pages/User/Register";
import { useEffect, useMemo, useState } from "react";
import AxiosClient from "./config/AxiosClient";
import { useZustandStore } from "./store/store";
import {
  Box,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { themeSettings } from "./theme";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ConnectionRequest from "./pages/ConnectionRequest";
import SendEmails from "./pages/SendEmails";

function App() {
  const { setUser, setIsSignedIn } = useZustandStore();
  const [loading, setLoading] = useState(true);

  const mode = "dark";
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  const getLoggedData = async () => {
    try {
      const { data } = await AxiosClient.get("api/user");
      setUser(data);
      setIsSignedIn(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getLoggedData();
  }, []);

  if (loading)
    return (
      <Box
        sx={{
          minHeight: "97vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={60} sx={{ color: "black" }} />
      </Box>
    );

    

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route exact path="/" element={<Sidebar />}>
            <Route exact path="/" element={<JOB />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/job" element={<JOB />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/connection-request" element={<ConnectionRequest />} />
            <Route path="/send-emails" element={<SendEmails />} />
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
