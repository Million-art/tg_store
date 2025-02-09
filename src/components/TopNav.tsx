import { useEffect, useState } from "react";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

export default function TopNav() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-orange-500 shadow-md px-4 py-3">
      <div className="flex justify-between items-center max-w-5xl mx-auto">
        {/* Left: Welcome Text (Theme Aware) */}
        <h1
          className={`text-lg font-semibold transition-colors text-white`}
        >
          Welcome
        </h1>

        {/* Right: Cart & Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Button variant="ghost">
            <ShoppingCart className="h-6 w-6 text-gray-700 dark:text-white" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            onClick={() => {
              const newTheme = currentTheme === "dark" ? "light" : "dark";
              setTheme(newTheme);
              localStorage.setItem("team-theme", newTheme);
            }}
          >
            {mounted && currentTheme === "dark" ? (
              <Sun className="h-6 w-6 text-white" />
            ) : (
              <Moon className="h-6 w-6 text-gray-600" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
}
