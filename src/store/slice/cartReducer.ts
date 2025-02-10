// src/redux/slices/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { CartItem } from "../../interface/cart";

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
};

// 🔹 Add product to Firestore and Redux state
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, product }: { userId: string; product: CartItem }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "carts"), {
        userId,
        ...product,
      });
      return { ...product, id: docRef.id };
    } catch (error) {
      return rejectWithValue("Failed to add item to cart.");
    }
  }
);

// 🔹 Fetch cart items from Firestore for a specific user
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId: string, { rejectWithValue }) => {
  try {
    const q = query(collection(db, "carts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as CartItem));
  } catch (error) {
    return rejectWithValue("Failed to fetch cart items.");
  }
});

// 🔹 Remove product from Firestore
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (id: string, { rejectWithValue }) => {
  try {
    await deleteDoc(doc(db, "carts", id));
    return id;
  } catch (error) {
    return rejectWithValue("Failed to remove item from cart.");
  }
});

// 🔹 Clear all cart items for the user
export const clearCart = createAsyncThunk("cart/clearCart", async (userId: string, { rejectWithValue }) => {
  try {
    const q = query(collection(db, "carts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const batchDelete = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(batchDelete);
    return []; // Return an empty array to reset state
  } catch (error) {
    return rejectWithValue("Failed to clear cart.");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.items.push(action.payload);
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default cartSlice.reducer;
