import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { useZustandStore } from "../store/store";
import Sidebar from "../components/Sidebar";

const Check = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Check;
