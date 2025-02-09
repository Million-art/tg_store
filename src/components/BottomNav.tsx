import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ShoppingCart, Package, Boxes } from "lucide-react";
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
    {
      id: "home",
      label: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      id: "products",
      label: "Products",
      icon: <Boxes className="h-5 w-5" />,
      path: "/products",
    },
    {
      id: "cart",
      label: "Cart",
      icon: <ShoppingCart className="h-5 w-5" />,
      path: "/cart",
    },
    {
      id: "order",
      label: "My Orders",
      icon: <Package className="h-5 w-5" />,
      path: "/orders",
    },
  ];

  const handleNavigation = (id: string, path: string) => {
    setActive(id);
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-orange-500">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id, item.path)}
            className="flex flex-col items-center justify-center flex-1 h-full"
          >
            <div
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                active === item.id
                  ? "text-primary dark:text-white"
                  : "text-muted-foreground dark:text-gray-200"
              )}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
