import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";  
import { telegramId } from "../libs/telegram";

interface OrderItem {
  name: string;
  price: number;
  productId: string;
  quantity: number;
}

interface OrderData {
  id: string;
  createdAt: string;
  items: OrderItem[];
  paymentMethod: string;
  status: string;
  totalPrice: number;
}

const Order = () => {
  const id = String(telegramId); 
  const [orders, setOrders] = useState<OrderData[]>([]);  
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Query to fetch orders for the user based on their id (telegramId)
        const ordersCollectionRef = collection(db, "orders"); 
        const q = query(ordersCollectionRef, where("userId", "==", id));  

        const querySnapshot = await getDocs(q);
        const ordersList: OrderData[] = [];

        querySnapshot.forEach((doc) => {
          ordersList.push({
            id: doc.id,
            createdAt: doc.data().createdAt, 
            items: doc.data().items,  
            paymentMethod: doc.data().paymentMethod,  
            status: doc.data().status,  
            totalPrice: doc.data().totalPrice,  
          });
        });

        setOrders(ordersList); 
      } catch (error) {
        console.error("Error fetching orders: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();  
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-4 p-4 border-b">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total Price:</strong> {order.totalPrice} ETB</p>

              <div>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <p>{item.name} (x{item.quantity})</p>
                      <p>{item.price * item.quantity} ETB</p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default Order;
