"use client"

import { useState } from "react"
import axios from "axios"
import type { CartItem } from "../../interface/cart"
import { setShowMessage } from "../../store/slice/messageReducer"
import { useDispatch } from "react-redux"
import { telegramId } from "../../libs/telegram"
import { clearCart } from "../../store/slice/cartReducer"
import { X, CreditCard, Truck, Loader2 } from "lucide-react"
import type { AppDispatch } from "../../store/store" 
interface ProductCheckoutProps {
  cartItems: CartItem[]
  totalPrice: number
  onClose: () => void
}

const ProductCheckout = ({ cartItems, totalPrice, onClose }: ProductCheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "chapa">("cash")
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  // Use the typed AppDispatch instead of the default dispatch
  const dispatch = useDispatch<AppDispatch>()

  const handlePlaceOrder = async () => {
    if (!telegramId) {
      dispatch(setShowMessage({ message: "User ID is missing", color: "red" }))
      return
    }

    if (!phone) {
      dispatch(setShowMessage({ message: "Phone number is required", color: "red" }))
      return
    }

    if (!address) {
      dispatch(setShowMessage({ message: "Delivery address is required", color: "red" }))
      return
    }

    try {
      setLoading(true)
      const orderData = {
        userId: String(telegramId),
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
        paymentMethod,
        deliveryDetails: {
          address,
          phone,
          notes,
        },
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      // Send POST request to the backend API
      const response = await axios.post("https://tg-store-bot.vercel.app/api/create-order", orderData)

      console.log("Order placed successfully:", response.data)

      // Clear the cart after successful order
      dispatch(clearCart(String(telegramId)))

      dispatch(
        setShowMessage({
          message: "Order placed successfully!",
          color: "green",
        }),
      )

      onClose()
    } catch (error: any) {
      console.error("Error placing order:", error)
      dispatch(
        setShowMessage({
          message: error.response?.data?.error || "Please try again later",
          color: "red",
        }),
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="p-6 rounded-lg w-full max-w-md bg-gray-800 border border-gray-700 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Checkout</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" disabled={loading}>
            <X size={20} />
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-2">Order Summary</h3>
          <div className="bg-gray-900 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b border-gray-700 last:border-0">
                <div className="flex-1">
                  <p className="text-white text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs">
                    {item.quantity} x {item.price.toFixed(2)} ETB
                  </p>
                </div>
                <p className="text-white text-sm font-medium">{(item.quantity * item.price).toFixed(2)} ETB</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-semibold text-white">
            <p>Total:</p>
            <p>{totalPrice.toFixed(2)} ETB</p>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="mb-4">
          <h3 className="font-semibold text-white mb-2">Delivery Information</h3>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="e.g., +251912345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Delivery Address *</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Enter your full delivery address"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">Additional Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                placeholder="Any special instructions for delivery"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-6">
          <h3 className="font-semibold text-white mb-2">Payment Method</h3>

          <div className="space-y-2">
            <label className="flex items-center p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="mr-3"
              />
              <Truck size={20} className="mr-2 text-green-500" />
              <span className="text-white">Cash on Delivery</span>
            </label>

            <label className="flex items-center p-3 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="payment"
                value="chapa"
                checked={paymentMethod === "chapa"}
                onChange={() => setPaymentMethod("chapa")}
                className="mr-3"
              />
              <CreditCard size={20} className="mr-2 text-blue-500" />
              <span className="text-white">Chapa Payment</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            onClick={handlePlaceOrder}
            disabled={loading || !phone || !address}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCheckout

