import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingCart, Package, Boxes, Users2 } from "lucide-react";
import { cn } from "../libs/utils";

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
    { id: "cart", label: "Cart", icon: <ShoppingCart />, path: "/cart" },
    { id: "order", label: "My Orders", icon: <Package />, path: "/orders" },
    { id: "referral", label: "Referrals", icon: <Users2 />, path: "/referrals" },
  ];

  const handleNavigation = (id: string, path: string) => {
    if (active === id) return; // Avoid unnecessary updates
    setActive(id);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 text-white border-t shadow-md bg-orange-500">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.path)}
            className="relative flex flex-col items-center justify-center flex-1 h-full focus:outline-none"
            aria-label={item.label}
          >
            <div
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                active === item.id
                  ? "text-white dark:text-gray-200 font-semibold"
                  : "text-gray-500 dark:text-gray-200"
              )}
            >
              <div className="relative">
                {item.icon}
                {active === item.id && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-1 rounded-full bg-green-500 dark:bg-green-400" />
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
