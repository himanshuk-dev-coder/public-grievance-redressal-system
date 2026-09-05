import { useContext } from "react";
import { WebData } from "../../context/UserContext.jsx";

import PublicNavbar from "./PublicNavbar.jsx";
import CitizenNavbar from "./CitizenNavbar.jsx";
import OfficerNavbar from "./OfficerNavbar.jsx";
import AdminNavbar from "./AdminNavbar.jsx";

const NavbarWrapper = () => {
  const { user, loading } = useContext(WebData);
  console.log("user :- ", user);

  // ⏳ While refresh token API is running
  if (loading) return null;
  
  if (!user) return <PublicNavbar />;

  if (user.role === "citizen") return <CitizenNavbar />;
  if (user.role === "officer") return <OfficerNavbar />;
  if (user.role === "admin") return <AdminNavbar />;

  return null;
};

export default NavbarWrapper;
