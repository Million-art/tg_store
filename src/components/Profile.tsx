import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { telegramId, firstName } from "../libs/telegram";
import { User } from "../interface/user";
import { db } from "../firebase/firebase";
import { ShoppingCart, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";

const Profile: React.FC = () => {
  const id = telegramId ? String(telegramId) : "";
  const [user, setUser] = useState<User | null>(null);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return;

      try {
        const userRef = doc(db, "users", id);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data() as User);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-light to-blue-medium shadow-lg w-full py-8 flex items-center px-4">
      {/* User Image
      <div className="w-12 h-12 rounded-full overflow-hidden  flex-shrink-0">
        {profilePicture ? (
          <img className="w-full h-full rounded-full" src={profilePicture} alt="User Profile" />
        ) : (
          <div className=" text-sm bg-primary w-full h-full flex items-center justify-center">
            {firstName?.charAt(0).toUpperCase() || "U"}
          </div>
        )}
      </div> */}

      {/* User Info */}
      <div className="ml-4 flex-1">
        <p className=" text-xl">Hello, {firstName || "User"}!</p>
        <p className=" text-xs font-semibold">{user?.balance ?? 0} Points</p>
      </div>

      {/* Shopping Cart Button */}
      <Button variant="ghost">
        <ShoppingCart className="h-6 w-6 " />
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
  );
};

export default Profile;
