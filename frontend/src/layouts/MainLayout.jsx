import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getUserProfile = async () => {
      const res = await fetch("/api/auth/profile", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUser(data);
    };
    getUserProfile();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={true} user={user} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
