"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../store/store"
import { removeFromCart, clearCart, fetchCart, incrementQuantity, decrementQuantity } from "../store/slice/cartReducer"
import { Trash2, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react"
import type { CartItem } from "../interface/cart"
import ProductCheckout from "../components/product/ProductCheckout"
import { telegramId } from "../libs/telegram"
import { Button } from "../components/ui/button"

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const loading = useSelector((state: RootState) => state.cart.loading)
  const error = useSelector((state: RootState) => state.cart.error)

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const userId = telegramId ? String(telegramId) : ""

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId))
    }
  }, [dispatch, userId])

  const handleClearCart = () => {
    if (userId) {
      dispatch(clearCart(userId))
    }
  }

  const handleIncrement = (item: CartItem) => {
    if (item.quantity < 100 && userId) {
      dispatch(incrementQuantity({ id: item.id, quantity: item.quantity, userId }))
    }
  }

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1 && userId) {
      dispatch(decrementQuantity({ id: item.id, quantity: item.quantity, userId }))
    }
  }

  const handleRemoveItem = (id: string) => {
    if (userId) {
      dispatch(removeFromCart({ id, userId }))
    }
  }

  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  // Open the checkout dialog
  const handleCreateOrder = () => {
    setIsCheckoutOpen(true)
  }

  // Close the checkout dialog
  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false)
  }

  return (
    <div className="p-6 max-w-3xl mx-auto mb-20">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="w-10 h-10 animate-spin text-blue-light mb-4" />
          <p className="text-gray-400">Loading your cart...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-100 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <Button className="mt-2 bg-red-700 hover:bg-red-800" onClick={() => dispatch(fetchCart(userId))}>
            Try Again
          </Button>
        </div>
      )}

      {/* Empty Cart State */}
      {!loading && !error && cartItems.length === 0 && (
        <div className="text-center py-10">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-400 mb-6">Add some products to your cart to continue shopping</p>
          <Button onClick={() => (window.location.href = "/products")} className="bg-blue-60 hover:bg-blue-700">
            Browse Products
          </Button>
        </div>
      )}

      {/* Cart Items */}
      {!loading && !error && cartItems.length > 0 && (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border border-gray-700 p-4 rounded-lg shadow-sm bg-gray-800"
            >
              {/* Product Image */}
              {item.image && Array.isArray(item.image) && item.image.length > 0 ? (
                <img
                  src={item.image[0] || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                  }}
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded flex items-center justify-center">
                  <ShoppingCart className="text-gray-500" size={24} />
                </div>
              )}

              {/* Product Details */}
              <div className="flex-1 ml-4">
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <p className="text-blue-light">{item.price.toFixed(2)} ETB</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleDecrement(item)}
                  disabled={item.quantity <= 1 || loading}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold text-white min-w-[30px] text-center">{item.quantity}</span>
                <button
                  className="p-2 rounded-full text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handleIncrement(item)}
                  disabled={item.quantity >= 100 || loading}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Remove Button */}
              <button
                className="p-2 bg-red-600 text-white rounded-full ml-3 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleRemoveItem(item.id)}
                disabled={loading}
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Order Summary */}
          <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-800">
            <h3 className="text-xl font-semibold mb-4 text-white">Order Summary</h3>

            {/* Subtotal */}
            <div className="flex justify-between py-2 border-b border-gray-700">
              <p className="text-gray-300">Subtotal</p>
              <p className="text-white">{totalPrice.toFixed(2)} ETB</p>
            </div>

            {/* Shipping - placeholder */}
            <div className="flex justify-between py-2 border-b border-gray-700">
              <p className="text-gray-300">Shipping</p>
              <p className="text-white">Free</p>
            </div>

            {/* Total */}
            <div className="flex justify-between py-3 mt-2">
              <p className="text-lg font-semibold text-white">Total</p>
              <p className="text-lg font-semibold text-blue-light">{totalPrice.toFixed(2)} ETB</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              className="border-red-600 text-red-500 hover:bg-red-900/20"
              onClick={handleClearCart}
              disabled={loading}
            >
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCreateOrder}
              disabled={loading}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      {isCheckoutOpen && (
        <ProductCheckout cartItems={cartItems} totalPrice={totalPrice} onClose={handleCloseCheckout} />
      )}
    </div>
  )
}

export default Cart

