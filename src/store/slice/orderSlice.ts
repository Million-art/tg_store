import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchOrdersFromFirebase,
  createOrderInFirebase,
  updateOrderInFirebase,
  deleteOrderFromFirebase,
} from "../../firebase/firebaseApi";
import { Order } from "../../interface/order";

interface OrderState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

// Define the expected shape of rejected errors
interface RejectError {
  error: string;
}

const initialState: OrderState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch Orders
export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: RejectError }>(
  "orders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrdersFromFirebase();
    } catch (error) {
      return rejectWithValue({ error: "Failed to fetch orders" });
    }
  }
);

// Create Order
export const createOrder = createAsyncThunk<Order, Order, { rejectValue: RejectError }>(
  "orders/create",
  async (order, { rejectWithValue }) => {
    try {
      return await createOrderInFirebase(order);
    } catch (error) {
      return rejectWithValue({ error: "Failed to create order" });
    }
  }
);

// Update Order
export const updateOrder = createAsyncThunk<Order, { id: string; orderData: Partial<Order> }, { rejectValue: RejectError }>(
  "orders/update",
  async ({ id, orderData }, { rejectWithValue }) => {
    try {
      return await updateOrderInFirebase(id, orderData);
    } catch (error) {
      return rejectWithValue({ error: "Failed to update order" });
    }
  }
);

// Delete Order
export const deleteOrder = createAsyncThunk<string, string, { rejectValue: RejectError }>(
  "orders/delete",
  async (id, { rejectWithValue }) => {
    try {
      return await deleteOrderFromFirebase(id);
    } catch (error) {
      return rejectWithValue({ error: "Failed to delete order" });
    }
  }
);

// Order Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch orders";
      })

      // Create Order
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.items.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.error = action.payload?.error || "Failed to create order";
      })

      // Update Order
      .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        const index = state.items.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.error = action.payload?.error || "Failed to update order";
      })

      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((order) => order.id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.error || "Failed to delete order";
      });
  },
});

export default orderSlice.reducer;
