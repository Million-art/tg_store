import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../interface/product";
import { db } from "../../firebase/firebase"; 
import { collection, getDocs } from "firebase/firestore";

interface ProductState {
  items: Product[];
  cart: Product[]; // Cart items
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: [],
  cart: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      return products;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Add a product to the cart
    addToCart: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingProduct = state.cart.find((item) => item.id === product.id);

      if (existingProduct) {
        // If the product already exists in the cart, increase its quantity
        existingProduct.quantity = (existingProduct.quantity || 1) + 1;
      } else {
        // If the product is not in the cart, add it with a quantity of 1
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    // Remove a product from the cart
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
    },
    // Clear the cart
    clearCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

// Export actions
export const { addToCart, removeFromCart, clearCart } = productSlice.actions;

export default productSlice.reducer;