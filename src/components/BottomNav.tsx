import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Package, Boxes, Users2 } from "lucide-react";
import { firstName, profilePicture } from "../libs/telegram";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

export default function BottomNav() {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    { id: "home", label: "Home", icon: <Home />, path: "/" },
    { id: "products", label: "Products", icon: <Boxes />, path: "/products" },
    { id: "order", label: "Orders", icon: <Package />, path: "/orders" },
    { id: "referral", label: "Referrals", icon: <Users2 />, path: "/referrals" },
  ];

  const handleNavigation = (id: string, path: string) => {
    if (active === id) return;
    setActive(id);
    navigate(path);
  };

  return (
    <nav className="fixed  bottom-1 left-1/2 transform -translate-x-1/2 w-[90%] max-w-[400px] bg-white/20 backdrop-blur-md border border-white/10 rounded-full shadow-lg flex justify-between items-center px-5 py-2">
      {navItems.slice(0, 2).map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.id, item.path)}
          className="flex flex-col items-center transition-all duration-300 ease-in-out relative"
          aria-label={item.label}
        >
          {item.icon}
          {active === item.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full bg-blue-light shadow-md transition-all" />
          )}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}

      {/* Centered User Profile */}
      <div className="relative w-14 h-14 rounded-full bg-blue flex items-center justify-center border-4 border-white shadow-md">
        {profilePicture ? (
          <img className="w-full h-full rounded-full" src={profilePicture} alt="User Profile" />
        ) : (
          <div className="text-white text-sm bg-primary w-full h-full flex items-center justify-center">
            {firstName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div>

      {navItems.slice(2).map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigation(item.id, item.path)}
          className="flex flex-col items-center transition-all duration-300 ease-in-out relative"
          aria-label={item.label}
        >
          {item.icon}
          {active === item.id && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full bg-blue-light shadow-md transition-all" />
          )}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
