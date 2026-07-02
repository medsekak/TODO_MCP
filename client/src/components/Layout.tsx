import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

// Layout protégé partagé : Navbar latérale + contenu de la page courante.
const Layout = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-950">
      <Navbar />
      {/* Décalage = marge du rail flottant (left-4) + largeur (w-20) + gouttière */}
      <div className="flex flex-col flex-1 min-w-0 pl-28">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
