import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Layout protégé partagé : Navbar latérale + contenu de la page courante.
const Layout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
