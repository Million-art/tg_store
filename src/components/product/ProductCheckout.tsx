import { useState } from "react";
import axios from "axios";
import { CartItem } from "../../interface/cart";
// import { requestPhoneAccess } from "@telegram-apps/sdk";
import { setShowMessage } from "../../store/slice/messageReducer";
import { useDispatch } from "react-redux";

interface ProductCheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onClose: () => void;
}

const ProductCheckout = ({ cartItems, totalPrice, onClose }: ProductCheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "chapa">("cash");
  const [loading, setLoading] = useState(false);
  const userId = "123"; 
  const dispatch = useDispatch();

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      const orderData = {
        userId,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice,
        paymentMethod,
      };

      // Send POST request to the backend API
      const response = await axios.post("https://tg-store-bot.vercel.app/api/create-order", orderData);

      console.log("Order placed successfully:", response.data);
      dispatch(
        setShowMessage({
          message: 'Order successed!',
          color: 'green',
        })
      );

      onClose();  
    } catch (error) {
      console.error("Error placing order:", error);
      dispatch(
        setShowMessage({
          message: 'Please Try Again later',
          color: 'red',
        })
      );    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-30 flex items-center justify-center">
      <div className="p-6 rounded-lg w-96 bg-white">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {/* Display cart items */}
        <div className="space-y-2 mb-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <p>{item.name}</p>
              <p>
                {item.quantity} x {item.price.toFixed(2)} ETB
              </p>
            </div>
          ))}
        </div>

        {/* Display total price */}
        <div className="flex justify-between mb-4">
          <p className="font-semibold">Total:</p>
          <p className="font-semibold">{totalPrice.toFixed(2)} ETB</p>
        </div>

        {/* Payment method selection */}
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Payment Method</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="chapa"
                checked={paymentMethod === "chapa"}
                onChange={() => setPaymentMethod("chapa")}
                className="mr-2"
              />
              Chapa
            </label>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCheckout;
