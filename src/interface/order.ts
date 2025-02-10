// types.ts
export interface Order {
    id: string;
    productId: string;
    quantity: number;
    totalPrice: number;
    status: "pending" | "shipped" | "delivered" | "cancelled";
    customerName: string;
    createdAt: string;
  }
  