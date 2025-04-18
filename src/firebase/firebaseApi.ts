import { Category } from "../interface/Category";
import { Order } from "../interface/order";
import { Product } from "../interface/product";
import { db } from "./firebase";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  QueryDocumentSnapshot, 
  DocumentData 
} from "firebase/firestore";

// Firestore collections
const ordersCollection = collection(db, "orders");
const productsCollection = collection(db, "products");

/** 
 * Fetch all orders from Firestore
 */
export const fetchOrdersFromFirebase = async (): Promise<Order[]> => {
    try {
      const snapshot = await getDocs(ordersCollection);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data() as Partial<Order>; 
        return { 
          id: doc.id, 
          productId: data.productId ?? "", 
          quantity: data.quantity ?? 0, 
          totalPrice: data.totalPrice ?? 0, 
          status: data.status ?? "pending", 
          customerName: data.customerName ?? "Unknown", 
          createdAt: data.createdAt ?? new Date().toISOString(), 
        };
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw new Error("Failed to fetch orders.");
    }
  };
  

/** 
 * Create a new order in Firestore
 */
export const createOrderInFirebase = async (order: Omit<Order, "id">): Promise<Order> => {
  try {
    const docRef = await addDoc(ordersCollection, order);
    return { id: docRef.id, ...order };
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order.");
  }
};

/** 
 * Update an existing order in Firestore
 */
export const updateOrderInFirebase = async (id: string, orderData: Partial<Order>): Promise<Order> => {
    try {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, orderData);
  
      // Ensure no property is undefined by providing defaults
      return { 
        id, 
        productId: orderData.productId ?? "", 
        quantity: orderData.quantity ?? 0, 
        totalPrice: orderData.totalPrice ?? 0, 
        status: orderData.status ?? "pending", 
        customerName: orderData.customerName ?? "Unknown",
        createdAt: orderData.createdAt ?? new Date().toISOString(), 
      };
    } catch (error) {
      console.error(`Error updating order ${id}:`, error);
      throw new Error("Failed to update order.");
    }
  };
  
/** 
 * Delete an order from Firestore
 */
export const deleteOrderFromFirebase = async (id: string): Promise<string> => {
  try {
    await deleteDoc(doc(db, "orders", id));
    return id;
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw new Error("Failed to delete order.");
  }
};

/** 
 * Fetch all products from Firestore
 */
export const fetchProductsFromFirebase = async (): Promise<Product[]> => {
    try {
      const snapshot = await getDocs(productsCollection);
      return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data() as Partial<Product>;
        return { 
          id: doc.id, 
          name: data.name ?? "Unknown Product", 
          price: data.price ?? 0, 
          image: data.image??[],
          quantity: data.quantity ?? 0, 
          category: (data.category as Category) ?? "Uncategorized",
        };
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error("Failed to fetch products.");
    }
  };
  

/** 
 * Create a new product in Firestore (Only for admins)
 */
export const createProductInFirebase = async (product: Omit<Product, "id">): Promise<Product> => {
  try {
    const docRef = await addDoc(productsCollection, product);
    return { id: docRef.id, ...product };
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product.");
  }
};
