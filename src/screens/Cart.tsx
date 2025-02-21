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

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);

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
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 disabled:opacity-50"
                  onClick={() => handleDecrement(item)} // decrement
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  onClick={() => handleIncrement(item)} // increment
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                onClick={() => dispatch(removeFromCart({ id: item.id, userId }))} // remove
              >
                <Trash2 size={16} />
              </button>

            </div>
          ))}
          <button
            className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800"
            onClick={handleClearCart}
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
