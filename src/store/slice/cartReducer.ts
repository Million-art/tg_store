import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, getDocs, deleteDoc, query, where} from "firebase/firestore";
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

// Add product to Firestore and Redux state
export const addToCart = createAsyncThunk<CartItem, { userId: string; product: CartItem }, { rejectValue: string }>(
  "cart/addToCart",
  async ({ userId, product }, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "carts"), {
        userId,
        ...product,
        quantity: 1,
      });
      return { ...product, id: docRef.id };
    } catch (error) {
      return rejectWithValue("Failed to add item to cart.");
    }
  }
);

// Fetch cart items from Firestore for a the user
export const fetchCart = createAsyncThunk<CartItem[], string, { rejectValue: string }>(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "carts"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const cartItems: CartItem[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CartItem[];
      
      return cartItems;
    } catch (error) {
      return rejectWithValue("Failed to fetch cart items.");
    }
  }
);

// Remove product from Firestore
export const removeFromCart = createAsyncThunk<string, { id: string; userId: string }, { rejectValue: string }>(
  "cart/removeFromCart",
  async ({ id, userId }, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "carts"), where("userId", "==", userId), where("id", "==", id));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return rejectWithValue("Item not found in cart.");
      }
      
      const itemDoc = querySnapshot.docs[0];
      await deleteDoc(itemDoc.ref);
      
      return id; // Return the id of the item removed
    } catch (error) {
      return rejectWithValue("Failed to remove item from cart.");
    }
  }
);


// Clear all cart items for the user
export const clearCart = createAsyncThunk<void, string, { rejectValue: string }>(
  "cart/clearCart",
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "carts"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const batchDelete = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(batchDelete);
    } catch (error) {
      return rejectWithValue("Failed to clear cart.");
    }
  }
);

// Increment product quantity in Redux store only
export const incrementQuantity = createAsyncThunk<{ id: string; quantity: number }, { id: string; quantity: number }>(
  "cart/incrementQuantity",
  async ({ id, quantity }) => {
    return { id, quantity: quantity + 1 };
  }
);

// Decrement product quantity in Redux store only
export const decrementQuantity = createAsyncThunk<{ id: string; quantity: number } | string, { id: string; quantity: number }>(
  "cart/decrementQuantity",
  async ({ id, quantity }) => {
    if (quantity > 1) {
      return { id, quantity: quantity - 1 };
    } else {
      return id; // If quantity is 1, return the id to remove it from the store
    }
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
  },
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
      })
      .addCase(incrementQuantity.fulfilled, (state, action: PayloadAction<{ id: string; quantity: number }>) => {
        const item = state.items.find((item) => item.id === action.payload.id);
        if (item) {
          item.quantity = action.payload.quantity;
        }
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(decrementQuantity.fulfilled, (state, action: PayloadAction<{ id: string; quantity: number } | string>) => {
        if (typeof action.payload === "string") {
          state.items = state.items.filter((item) => item.id !== action.payload);
        } else {
          const { id, quantity } = action.payload;
          const item = state.items.find((item) => item.id === id);
          if (item) {
            item.quantity = quantity;
          }
        }
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
  
});

export default cartSlice.reducer;
