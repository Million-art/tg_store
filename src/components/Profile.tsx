import type React from "react"
import { useState, useEffect } from "react"
import { doc, getDoc } from "firebase/firestore"
import { telegramId, firstName } from "../libs/telegram"
import type { User } from "../interface/user"
import { db } from "../firebase/firebase"
import { ShoppingCart, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"

const Profile: React.FC = () => {
  const id = telegramId ? String(telegramId) : ""
  const [user, setUser] = useState<User | null>(null)
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const navigate = useNavigate()

  // Get cart items from Redux store
  const cartItems = useSelector((state: RootState) => state.cart.items)

  // Calculate total quantity of items in cart
  const cartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!id) return

      try {
        const userRef = doc(db, "users", id)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setUser(userSnap.data() as User)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [id])

  const currentTheme = theme === "system" ? systemTheme : theme

  return (
    <div className=" bg-gradient-to-r text-white from-blue-light to-blue-medium shadow-lg w-full py-4 flex items-center px-4">
      {/* User Info */}
      <div className="flex-1">
        <p className="text-xl">Hello, {firstName || "User"}!</p>
        <p className="text-xs font-semibold">{user?.balance ?? 0} Points</p>
      </div>

      {/* Shopping Cart Button */}
      <Button variant="ghost" className="relative" onClick={() => navigate("/cart")}>
        {/* Cart Quantity Badge */}
        {cartQuantity > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px]">
            {cartQuantity}
          </span>
        )}
        <ShoppingCart className="h-6 w-6" />
      </Button>

      {/* Dark Mode Toggle */}
      <Button
        variant="ghost"
        onClick={() => {
          const newTheme = currentTheme === "dark" ? "light" : "dark"
          setTheme(newTheme)
          localStorage.setItem("team-theme", newTheme)
        }}
      >
        {mounted && currentTheme === "dark" ? (
          <Sun className="h-6 w-6 text-white" />
        ) : (
          <Moon className="h-6 w-6 text-gray-600" />
        )}
      </Button>
    </div>
  )
}

export default Profile

