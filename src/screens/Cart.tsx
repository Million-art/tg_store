import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store";  
import { 
  removeFromCart, 
  clearCart, 
  fetchCart, 
  incrementQuantity, 
  decrementQuantity 
} from "../store/slice/cartReducer";
import { useEffect } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem } from "../interface/cart";
import ProductCheckout from "../components/product/ProductCheckout";
 
const Cart = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false); // State for dialog visibility

  const userId = "123"; 

  useEffect(() => {
    dispatch(fetchCart(userId));  
  }, [dispatch]);

  const handleClearCart = () => {
    dispatch(clearCart(userId));  
  };

  const handleIncrement = (item: CartItem) => {
    if (item.quantity < 100) {  // optional limit to avoid overflow
      dispatch(incrementQuantity({ id: item.id, quantity: item.quantity }));
    }
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      dispatch(decrementQuantity({ id: item.id, quantity: item.quantity }));
    }
  };

  // Calculate the total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Open the checkout dialog
  const handleCreateOrder = () => {
    setIsCheckoutOpen(true);
  };

  // Close the checkout dialog
  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {loading && <p className="text-gray-500">Loading cart items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
              {item.image && Array.isArray(item.image) && item.image.length > 0 ? (
                <img src={item.image[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-sm">No Image</span>
                </div>
              )}
              <div className="flex-1 ml-4">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-200">{item.price.toFixed(2)}ETB</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2  rounded-full  disabled:opacity-50"
                  onClick={() => handleDecrement(item)} // decrement
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  className="p-2  rounded-full"
                  onClick={() => handleIncrement(item)} // increment
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="p-2 bg-red-500 text-white rounded-full ml-3 hover:bg-red-600"
                onClick={() => dispatch(removeFromCart({ id: item.id, userId }))} // remove
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Display the total price */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-semibold">Total:</p>
            <p className="text-xl font-semibold">{totalPrice.toFixed(2)} ETB</p>
          </div>
          <div className="flex justify-between items-center">
            <button
              className="w-fit bg-red-500 p-2 text-white py-3 rounded-lg mt-4"
              onClick={handleClearCart}
            >
              Clear Cart
            </button>
            <button
              className="w-fit bg-green-500 p-2 text-white py-3 rounded-lg mt-4"
              onClick={handleCreateOrder} // Open the checkout dialog
            >
              Create Order
            </button>
          </div>
        </div>
      )}

      {/* Checkout Dialog */}
      {isCheckoutOpen && (
        <ProductCheckout
          cartItems={cartItems}
          totalPrice={totalPrice}
          onClose={handleCloseCheckout}
        />
      )}
    </div>
  );
};

export default Cart;