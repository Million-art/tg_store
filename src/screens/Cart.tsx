// src/screens/Cart.tsx
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/store"; // Import AppDispatch
import { removeFromCart, clearCart, fetchCart } from "../store/slice/cartReducer";
import { useEffect } from "react";

const Cart = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Correct typing
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const loading = useSelector((state: RootState) => state.cart.loading);
  const error = useSelector((state: RootState) => state.cart.error);
  const user = useSelector((state: RootState) => state.user.value);

  // Fetch cart items on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchCart(user.uid));
    }
  }, [dispatch, user]);

  const handleClearCart = () => {
    if (!user) {
      alert("Please log in to clear the cart.");
      return;
    }
    dispatch(clearCart(user.uid));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Your Cart</h2>

      {loading && <p>Loading cart items...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="border p-2 mb-2 flex justify-between">
              <span>{item.name} (x{item.quantity}) - ${item.price * item.quantity}</span>
              <button
                className="bg-red-500 text-white px-2 py-1"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-gray-600 text-white px-4 py-2 mt-4"
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
